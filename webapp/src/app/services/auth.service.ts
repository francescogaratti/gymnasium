import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from '@firebase/auth';
import { addDoc, getDoc, getDocs, getFirestore, setDoc } from '@firebase/firestore';
import { getStorage, getDownloadURL, uploadBytes, ref } from '@firebase/storage';
import { Exercise, ExerciseEntry } from '@models/exercise';
import { User, WeightRecord } from '@models/user';
import { Workout } from '@models/workout';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { getMessaging, getToken } from 'firebase/messaging';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	host: string = environment.serverURL;

	user$: Subject<User> = new Subject<User>(); // future user
	user: User = null;

	users$: Subject<User[]> = new Subject<User[]>();
	users: User[] = null;
	allExercises: Exercise[] = null;

	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar

	auth = getAuth();
	firestore = getFirestore();
	storage = getStorage();
	messaging = getMessaging();

	constructor(
		private http: HttpClient,
		private userService: UserService,
		private router: Router
	) {
		// store all the users here
		this.user$.subscribe(user => (this.user = user));
		this.users$.subscribe((users: User[]) => (this.users = users));
		onAuthStateChanged(this.auth, async firebaseUser => {
			if (firebaseUser) {
				const user = await this.userService.readUser(firebaseUser.uid);
				this.user$.next(user);
			} else this.user$.next(null);
		});
	}

	async isLogged(): Promise<boolean> {
		if (this.user) return true;
		return new Promise((resolve, reject) => {
			this.user$.subscribe((user: any) => {
				if (user) resolve(true);
				else reject(false);
			});
		});
	}

	isAdmin(): boolean {
		return this.user && this.user.admin;
	}

	// todo: fix this
	async getFirebaseUser(): Promise<User> {
		if (this.user) return this.user;
		else return null;
	}

	getUser(): User {
		return this.user ? this.user : null;
	}

	startUi() {
		signInWithPopup(this.auth, new GoogleAuthProvider())
			.then(async result => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				// The signed-in user info.
				const fUser = result.user;
				console.info(fUser);
				const user = await this.userService.readUser(fUser.uid);
				this.user$.next(user);
				// ...
			})
			.catch(error => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.email;
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				// ...
			});
		// getRedirectResult(auth)
		// 	.then(result => {
		// 		// This gives you a Google Access Token. You can use it to access Google APIs.
		// 		const credential = GoogleAuthProvider.credentialFromResult(result);
		// 		const token = credential.accessToken;

		// 		// The signed-in user info.
		// 		const user = result.user;
		// 	})
		// 	.catch(error => {
		// 		// Handle Errors here.
		// 		const errorCode = error.code;
		// 		const errorMessage = error.message;
		// 		// The email of the user's account used.
		// 		const email = error.email;
		// 		// The AuthCredential type that was used.
		// 		const credential = GoogleAuthProvider.credentialFromError(error);
		// 		// ...
		// 	});
	}

	signOut() {
		this.auth.signOut();
	}

	async readUser(id: string): Promise<User> {
		if (this.user) return this.user;

		this.asyncOperation.next(true);
		this.user = await getDoc(doc(this.firestore, 'users', id))
			.then(snapshot => snapshot.data() as User)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.user$.next(this.user);
		this.asyncOperation.next(false);
		return this.user;
	}

	async readUsers(): Promise<User[]> {
		if (this.users) return this.users;

		this.asyncOperation.next(true);
		this.users = await getDocs(collection(this.firestore, 'users'))
			.then(snapshot => {
				const values: User[] = [];
				snapshot.forEach(doc => values.push(doc.data() as User));
				return values;
			})
			.catch(err => {
				console.error(err);
				return [];
			});
		this.users$.next(this.users); // send to subscribers
		this.asyncOperation.next(false);
		return this.users;
	}

	async getExercises(): Promise<Exercise[]> {
		if (this.allExercises) return this.allExercises;

		this.asyncOperation.next(true);
		this.allExercises = await getDocs(collection(this.firestore, 'exercises'))
			.then(snapshot => {
				const exs: Exercise[] = [];
				snapshot.docs.forEach(doc => exs.push(doc.data() as Exercise));
				this.allExercises = exs;
				return this.allExercises;
			})

			.catch(err => {
				console.error(err);
				return [];
			});

		this.asyncOperation.next(false);

		return this.allExercises;
	}

	async updateUser(user: User): Promise<boolean> {
		this.asyncOperation.next(true);

		const res: boolean = await setDoc(doc(this.firestore, 'users', user.uid), { ...user })
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async updateWorkout(workout: Workout): Promise<boolean> {
		this.asyncOperation.next(true);

		const res: boolean = await setDoc(
			doc(this.firestore, 'workouts', workout.id),
			{
				...workout,
			},
			{ merge: true }
		)
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async newWorkout(workout: Workout, _user: User): Promise<string> {
		this.asyncOperation.next(true);
		workout.id = (
			await addDoc(collection(this.firestore, 'workouts'), workout).catch(err => {
				console.error(err);
				return null;
			})
		).id;
		await this.updateWorkout(workout);
		this.asyncOperation.next(false);
		return workout.id;
	}

	// todo: extract workouts from user.workouts
	async readUserWorkouts(user: User): Promise<Workout[]> {
		this.asyncOperation.next(true);
		const workouts: Workout[] = await getDoc(doc(this.firestore, 'users', user.uid))
			.then(async snapshot => {
				const refs: any[] = snapshot.get('workouts');
				const promises: Promise<Workout>[] = [];
				if (!refs) return [];
				refs.forEach(ref => promises.push(ref.get().then(res => res.data() as Workout)));
				const workouts = await Promise.all(promises);
				return workouts;
			})
			.catch(err => {
				console.error(err);
				return [];
			});
		this.asyncOperation.next(false);
		return workouts;
	}

	async deleteWorkoutFromUser(workout: Workout, user: User): Promise<boolean> {
		const updated_workouts = await getDocs(collection(this.firestore, 'users', workout.userId))
			.then(async (snapshot: any) =>
				snapshot.get('workouts').filter((ref: any) => ref.id !== workout.id)
			)
			.catch(err => {
				console.error(err);
				return [];
			});
		user.workouts = updated_workouts;
		return await this.userService.updateUser(user);
	}

	async deleteWorkout(workout: Workout, user?: User): Promise<boolean> {
		this.asyncOperation.next(true);

		const deleteFromWorkouts = await deleteDoc(doc(this.firestore, 'workouts', workout.id))
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		if (!deleteFromWorkouts) {
			this.asyncOperation.next(false);
			return false;
		} else {
			const deleteFromUserResult = await this.deleteWorkoutFromUser(workout, user);
			this.asyncOperation.next(false);
			return deleteFromUserResult;
		}
	}

	async getWorkout(id: string): Promise<Workout> {
		this.asyncOperation.next(true);
		const res: Workout = await getDoc(doc(this.firestore, 'workouts', id))
			.then(snapshot => snapshot.data() as Workout)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async sendWorkout(workout: Workout): Promise<boolean> {
		this.asyncOperation.next(true);
		this.user.workouts = null;
		const body: Object = {
			params: { user: JSON.stringify(this.user), workout: JSON.stringify(workout) },
			responseType: 'arrayBuffer',
		};

		const res: boolean = await this.http
			.post<any>(this.host + 'workout/send', body)
			.toPromise()
			.then((res: { sent: boolean; message: string }) => {
				console.info(res.message);
				return res.sent;
			})
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	// todo: refactor with axios
	async generateExcel(filename: string, workoutId: string): Promise<boolean> {
		this.asyncOperation.next(true);
		// some costants & params
		// const generateExcelURL: string =
		// 	'https://us-central1-ultra-gymnasium.cloudfunctions.net/excel-generateExcel';
		const generateExcelURL: string = this.host + 'excel'; // todo: change this with real host
		const requestOptions: Object = {
			params: { workoutId: workoutId },
			responseType: 'arrayBuffer',
		};
		// http request
		const res: boolean = await this.http
			.get<any>(generateExcelURL, requestOptions)
			.toPromise()
			.then((res: ArrayBuffer) => {
				const link = document.createElement('a');
				link.style.display = 'none';
				document.body.appendChild(link);

				const blob = new Blob([res]);
				const objectURL = URL.createObjectURL(blob);

				link.href = objectURL;
				link.href = URL.createObjectURL(blob);
				link.download = filename;
				link.click();
				return true;
			})
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async uploadImageToUser(image: File, userId: string): Promise<string> {
		const fileRef = ref(this.storage, 'profile-images/' + userId + '/' + image.name);
		return await uploadBytes(fileRef, image).then((snapshot: any) => {
			console.log('Uploaded', snapshot);
			return snapshot.ref.location.path_;
		});
	}

	async getFile(path: string): Promise<string> {
		return await getDownloadURL(ref(this.storage, path))
			.then(url => (url ? url : null))
			.catch(() => null);
	}

	/** Exercises */
	async newExercise(ee: ExerciseEntry): Promise<string> {
		this.asyncOperation.next(true);
		const res: string = await addDoc(collection(this.firestore, 'exercises'), { ...ee })
			.then(docRef => docRef.id)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async updateExercise(ee: ExerciseEntry): Promise<boolean> {
		this.asyncOperation.next(true);
		const res: boolean = await setDoc(
			doc(this.firestore, 'exercises', ee.id),
			{ ...ee },
			{ merge: true }
		)
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	/** Exercises */
	async newWeightRecord(userId: string, record: WeightRecord): Promise<boolean> {
		this.asyncOperation.next(true);
		const id = await addDoc(collection(this.firestore, 'users', userId, 'weights'), {
			...record,
		})
			.then(ref => ref.id)
			.catch(err => {
				console.error(err);
				return null;
			});
		record.id = id;
		const res = await this.updateWeightRecord(userId, record);
		this.asyncOperation.next(false);
		return res;
	}

	async updateWeightRecord(userId: string, weight: WeightRecord): Promise<boolean> {
		this.asyncOperation.next(true);
		const res: boolean = await setDoc(
			doc(this.firestore, 'users', userId, 'weights', weight.id),
			{ ...weight }
		)
			.then(() => true) // unica possibilità di diventare "true"
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	// todo: remove weights
	async deleteWeightRecord(userId: string, weight_id: string): Promise<boolean> {
		this.asyncOperation.next(true);
		const res: boolean = await deleteDoc(
			doc(this.firestore, 'users', userId, 'weights', weight_id)
		)
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	// todo: get weights per user
	async getUserWeightRecords(user: User): Promise<WeightRecord[]> {
		this.asyncOperation.next(true);
		const weightRecords: WeightRecord[] = await getDocs(
			collection(this.firestore, 'users', user.uid, 'weights')
		)
			.then(async snapshot => snapshot.docs.map(doc => doc.data() as WeightRecord))
			.catch(err => {
				console.error(err);
				return [];
			});
		this.asyncOperation.next(false);
		return weightRecords;
	}

	/** messaging */
	async startMessaging(user: User) {
		// Get registration token. Initially this makes a network call, once retrieved
		// subsequent calls to getToken will return from cache.

		getToken(this.messaging, {
			vapidKey: environment.cloudMessagingKeyPair,
		})
			.then(async (currentToken: string) => {
				if (currentToken) {
					// no token saved
					if (!user.tokenIds || user.tokenIds.length == 0) {
						console.info('save token to ', user.uid);
						user.tokenIds = [currentToken];
						this.updateUser(user);
					}
					// if not present in the list
					else if (!user.tokenIds.find(t => currentToken == t)) {
						console.info('append token to ', user.uid);
						user.tokenIds.push(currentToken);
						this.updateUser(user);
					}
				} else {
					user.tokenIds = [];
					this.updateUser(user);
					console.warn(
						'No registration token available. Request permission to generate one.'
					);
				}
			})
			.catch(err => {
				console.error('An error occurred while retrieving token. ', err);
			});
	}
}
