import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import * as firebase from 'firebase/app';
import { auth } from 'firebase/app';
import 'firebase/messaging';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

import * as firebaseui from 'firebaseui';

import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { User, WeigthRecord } from '@models/user';
import { Workout } from '@models/workout';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { ExerciseEntry } from '@models/exercise';

// configuration for the ui
const uiConfig = {
	signInSuccessUrl: '/',
	signInOptions: [auth.GoogleAuthProvider.PROVIDER_ID, auth.EmailAuthProvider.PROVIDER_ID],
	tosUrl: 'terms-of-service',
	privacyPolicyUrl: 'privacy-policy',
};

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	host: string = 'https://ultra-gymnasium.herokuapp.com/';
	localhost: string = 'http://localhost:5000/';
	adminUids: string[] = ['WRcrJKbtjpfe2nIQJpQWhkrwOdx2'];
	ui: firebaseui.auth.AuthUI =
		firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth()); // login firebase ui

	user$: Subject<User> = new Subject<User>(); // future user
	user: User = null;

	users$: Subject<User[]> = new Subject<User[]>();
	users: User[] = null;

	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar

	constructor(
		private afAuth: AngularFireAuth,
		private afs: AngularFirestore,
		private afstr: AngularFireStorage,
		private http: HttpClient,
		private userService: UserService
	) {
		this.user$.subscribe(user => {
			if (user) {
				this.userService.readUser(user.uid);
				this.startMessaging(user);
			}
		});
		// store all the users here
		this.users$.subscribe((users: User[]) => (this.users = users));
	}

	async grantAccess(type?: string): Promise<boolean> {
		// for logged access
		if (!this.user) {
			this.user = await this.getFirebaseUser()
				.then(user => user)
				.catch(() => null);
		}
		return !!this.user;
	}

	isAdmin(uid: string): boolean {
		return !!this.adminUids.find(id => id == uid);
	}

	async getFirebaseUser(): Promise<User> {
		if (this.user) return this.user;
		console.info('🔥 Firebase User');
		const firebaseUser: firebase.User = await this.afAuth.authState
			.pipe(first())
			.toPromise()
			.then(u => u)
			.catch(() => null);
		return firebaseUser
			? this.readUser(firebaseUser.uid)
					.then(u => u)
					.catch(() => null)
			: null;
	}

	getUser(): User {
		return this.user ? this.user : null;
	}

	startUi() {
		this.ui.start('#firebaseui-auth-container', uiConfig);
	}

	signOut() {
		this.afAuth.signOut();
	}

	async readUser(id: string): Promise<User> {
		if (this.user) return this.user;
		console.info('📘 - get user ' + id);
		this.asyncOperation.next(true);
		this.user = await this.afs
			.collection('users')
			.doc(id)
			.get()
			.toPromise()
			.then(snapshot => snapshot.data() as User)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.user$.next(this.user);
		this.asyncOperation.next(false);
		return this.user;
	}

	public async readUsers(): Promise<User[]> {
		if (this.users) return this.users;
		console.info('📘 - read users');
		this.asyncOperation.next(true);
		this.users = await this.afs
			.collection('users')
			.get()
			.toPromise()
			.then(snapshot => {
				let values: User[] = [];
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

	async updateUser(user: User): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - update user');
		let res: boolean = await this.afs
			.collection('users')
			.doc(user.uid)
			.set(user)
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
		console.info('📗 - update workout');
		let res: boolean = await this.afs
			.collection('workouts')
			.doc(workout.id)
			.set(Object.assign({}, workout), { merge: true })
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async newWorkout(workout: Workout, user: User): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - write');
		let workoutId: string = await this.afs
			.collection('workouts')
			.add(workout)
			.then(async (docRef: DocumentReference) => {
				workout.id = docRef.id;
				let update_workout_res = await this.updateWorkout(workout);
				return update_workout_res ? workout.id : null;
			})
			.catch(err => {
				console.error(err);
				return null;
			});
		// ? now I have the workout ID ==> save into the user workouts list
		let res: boolean = await this.userService.newUserWorkout(user, workoutId);
		this.asyncOperation.next(false);
		return res;
	}

	// todo: extract workouts from user.workouts
	public async readUserWorkouts(user: User): Promise<Workout[]> {
		console.info('📘 - read user workouts');
		this.asyncOperation.next(true);
		let workouts: Workout[] = await this.afs
			.collection('users')
			.doc(user.uid)
			.get()
			.toPromise()
			.then(async snapshot => {
				let refs: DocumentReference[] = snapshot.get('workouts');
				let promises: Promise<Workout>[] = [];
				if (!refs) return [];
				refs.forEach((ref: DocumentReference) =>
					promises.push(ref.get().then(res => res.data() as Workout))
				);
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

	async deleteWorkout(workout: Workout, user?: User): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📕 - delete');
		// delete from the workouts list
		let res: boolean = await this.afs
			.collection('workouts')
			.doc(workout.id)
			.delete()
			.then(() => true) // unica possibilità di diventare "true"
			.catch(err => {
				console.error(err);
				return false;
			});
		// delete from users list
		if (res) {
			console.info('📘 - read');
			let updated_workouts: DocumentReference[] = await this.afs
				.collection('users')
				.doc(workout.userId)
				.get()
				.toPromise()
				.then(async snapshot => {
					let refs: DocumentReference[] = snapshot.get('workouts');
					console.info({ refs });
					let new_list: DocumentReference[] = refs.filter(
						(ref: DocumentReference) => ref.id !== workout.id
					);
					return new_list;
				})
				.catch(err => {
					console.error(err);
					return [];
				});
			user.workouts = updated_workouts;
			res = await this.userService.updateUser(user, false);
		}
		this.asyncOperation.next(false);
		return res;
	}

	async getWorkout(id: string): Promise<Workout> {
		this.asyncOperation.next(true);
		let res: Workout = await this.afs
			.collection('workouts')
			.doc(id)
			.get()
			.toPromise()
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

		let res: boolean = await this.http
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
		let res: boolean = await this.http
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
		console.info('📗 - upload file');
		let ref = this.afstr.ref('');
		let fileRef = ref.child('profile-images/' + userId + '/' + image.name);
		return await fileRef.put(image).then((snapshot: any) => {
			console.log('Uploaded', snapshot);
			return snapshot.ref.location.path_;
		});
	}

	async getFile(path: string): Promise<string> {
		console.info('📘 - read file');
		return await this.afstr
			.ref(path)
			.getDownloadURL()
			.toPromise()
			.then(url => (url ? url : null))
			.catch(() => null);
	}

	/** Exercises */
	async newExercise(ee: ExerciseEntry): Promise<string> {
		this.asyncOperation.next(true);
		console.info('📗 - write');
		let res: string = await this.afs
			.collection('exercises')
			.add(Object.assign({}, ee))
			.then(async (docRef: DocumentReference) => docRef.id)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async updateExercise(ee: ExerciseEntry): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - update exercise');
		let res: boolean = await this.afs
			.collection('exercises')
			.doc(ee.id)
			.set(Object.assign({}, ee), { merge: true })
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	/** Exercises */
	async newWeightRecord(userId: string, record: WeigthRecord): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - write');
		let res: boolean = await this.afs
			.collection('users')
			.doc(userId)
			.collection('weights')
			.add(Object.assign({}, record))
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	// todo: get weights per user

	/** messaging */
	async startMessaging(user: User) {
		// Get registration token. Initially this makes a network call, once retrieved
		// subsequent calls to getToken will return from cache.
		firebase
			.messaging()
			.getToken({
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
