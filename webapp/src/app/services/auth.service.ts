import { Injectable } from '@angular/core';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
	AngularFirestore,
	AngularFirestoreDocument,
	AngularFirestoreCollection,
	DocumentReference,
} from '@angular/fire/firestore';

import * as firebaseui from 'firebaseui';

import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';

import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User, Client, UserTypes } from '@models/user';
// import { Client } from '@models/client';
import { DigitalWorkout, StandardWorkout, Workout } from '@models/workout';
import { HttpClient } from '@angular/common/http';
import { ExerciseEntry } from '@models/exercise';
import * as firebase from 'firebase';
import { ClientService } from './client.service';
import { TrainerService } from './trainer.service';
import { AdminService } from './admin.service';

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
	adminUid: string = 'LYdbifVoKLbU22PjidrlaeqHDNG3';
	ui: firebaseui.auth.AuthUI = new firebaseui.auth.AuthUI(auth()); // login firebase ui

	// firebase_user$: Observable<User>; // future logged user
	user$: Observable<User>; // future user
	// client$: Observable<Client>; // future client

	user: User;
	// client: Client;

	// clients$: Subject<Client[]> = new Subject<Client[]>();
	users$: Subject<User[]> = new Subject<User[]>();

	users: User[] = [];
	// clients: Client[] = [];

	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar

	constructor(
		private afAuth: AngularFireAuth,
		private afs: AngularFirestore,
		private afstr: AngularFireStorage,
		private http: HttpClient,
		private clientService: ClientService,
		private trainerService: TrainerService,
		private adminService: AdminService
	) {
		// get credentials
		this.getLoggedUser();
		// get user data
		this.user$.subscribe(firebase_user =>
			this.readUser(firebase_user.uid).then((user: User) => {
				this.user = user;
				if (this.user && this.user.type) {
					switch (this.user.type) {
						case UserTypes.user:
							break;
						case UserTypes.client:
							this.clientService.readClient(this.user.uid);
							break;
						case UserTypes.trainer:
							this.trainerService.readTrainer(this.user.uid);
							break;
						case UserTypes.admin:
							this.adminService.readAdmin(this.user.uid);
							break;
						default:
							break;
					}
				}
				this.startMessaging(user);
			})
		);
		// store all the users here
		this.users$.subscribe((users: User[]) => (this.users = users));
	}

	grantAccess(type: string): boolean {
		if (this.user.type == UserTypes.admin || this.user.uid == this.adminUid) return true;
		return this.user.type == type;
	}

	getAdminUid(): string {
		return this.adminUid;
	}

	/**
	 * @description returns the user data if the user is logged, null otherwise
	 */
	async getLoggedUser() {
		// this.asyncOperation.next(true);
		this.user$ = this.afAuth.authState.pipe(
			switchMap(user => {
				this.asyncOperation.next(false);
				// Logged in
				if (user) return this.readUser(user.uid);
				// Logged out
				else return of(null);
			})
		);
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
		if (this.user) {
			console.info('already read user');
			return this.user;
		}
		console.info('📘 - get user ' + id);
		this.asyncOperation.next(true);
		let user: User = await this.afs
			.collection('users')
			.doc(id)
			.get()
			.toPromise()
			.then(snapshot => snapshot.data() as User)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.user = user;
		this.asyncOperation.next(false);
		return user;
	}

	public async readUsers(): Promise<User[]> {
		// if (this.users) return this.users;
		console.info('📘 - read users');
		this.asyncOperation.next(true);
		let users: User[] = await this.afs
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
		this.asyncOperation.next(false);
		// this.users$.next(users); // send to subscribers
		// console.info(users);
		return users;
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

	async newWorkoutOld(workout: StandardWorkout): Promise<string> {
		this.asyncOperation.next(true);
		console.info('📗 - write');
		let res: string = await this.afs
			.collection('workouts')
			.add(workout)
			.then(async (docRef: DocumentReference) => {
				workout.id = docRef.id;
				// todo: add this workout to the client's workout
				let update_workout_res = await this.updateWorkoutOld(workout);
				return update_workout_res ? workout.id : null;
			})
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async updateWorkoutOld(workout: StandardWorkout): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - update workout');
		let res: boolean = await this.afs
			.collection('workouts')
			.doc(workout.id)
			.set(workout, { merge: true })
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async updateWorkout(workout: DigitalWorkout): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - update workout');
		let res: boolean = await this.afs
			.collection('workouts')
			.doc(workout.id)
			.set(workout, { merge: true })
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	public async readClientWorkoutsOld(client: Client): Promise<StandardWorkout[]> {
		this.asyncOperation.next(true);
		let workouts: StandardWorkout[] = await this.afs
			.collection('clients')
			.doc(client.uid)
			.get()
			.toPromise()
			.then(async snapshot => {
				let refs: DocumentReference[] = snapshot.get('workouts');
				let promises: Promise<StandardWorkout>[] = [];
				refs.forEach((ref: DocumentReference) =>
					promises.push(ref.get().then(res => res.data() as StandardWorkout))
				);
				const shirts = await Promise.all(promises);
				return shirts;
			})
			.catch(err => {
				console.error(err);
				return [];
			});
		this.asyncOperation.next(false);
		return workouts;
	}

	async newWorkout(workout: DigitalWorkout, client: Client): Promise<boolean> {
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
		// ? now I have the workout ID ==> save into the client workouts list
		let res: boolean = await this.clientService.newClientWorkout(client, workoutId);
		this.asyncOperation.next(false);
		return res;
	}

	// todo: extract workouts from client.workouts
	public async readClientWorkouts(client: Client): Promise<DigitalWorkout[]> {
		console.info('📘 - read client workouts');
		this.asyncOperation.next(true);
		let workouts: DigitalWorkout[] = await this.afs
			.collection('clients')
			.doc(client.uid)
			.get()
			.toPromise()
			.then(async snapshot => {
				let refs: DocumentReference[] = snapshot.get('workouts');
				let promises: Promise<DigitalWorkout>[] = [];
				if (!refs) return [];
				refs.forEach((ref: DocumentReference) =>
					promises.push(ref.get().then(res => res.data() as DigitalWorkout))
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

	async deleteWorkout(workout: Workout, client: Client): Promise<boolean> {
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
		// delete from clients list
		if (res) {
			console.info('📘 - read');
			let updated_workouts: DocumentReference[] = await this.afs
				.collection('clients')
				.doc(client.uid)
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
			client.workouts = updated_workouts;
			res = await this.clientService.updateClient(client, false);
		}
		this.asyncOperation.next(false);
		return res;
	}

	async getWorkout(id: string): Promise<DigitalWorkout> {
		this.asyncOperation.next(true);
		let res: DigitalWorkout = await this.afs
			.collection('workouts')
			.doc(id)
			.get()
			.toPromise()
			.then(snapshot => snapshot.data() as DigitalWorkout)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async generateExcel(filename: string, workoutId: string): Promise<boolean> {
		this.asyncOperation.next(true);
		// some costants & params
		const generateExcelURL: string =
			'https://us-central1-ultra-gymnasium.cloudfunctions.net/excel-generateExcel';
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

	async uploadImageToClient(image: File, clientId: string): Promise<string> {
		console.info('📗 - upload file');
		let ref = this.afstr.ref('');
		let fileRef = ref.child('profile-images/' + clientId + '/' + image.name);
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
			.add(ee)
			.then(async (docRef: DocumentReference) => docRef.id)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return res;
	}

	/** messaging */
	async startMessaging(user: User) {
		// Get registration token. Initially this makes a network call, once retrieved
		// subsequent calls to getToken will return from cache.
		firebase
			.messaging()
			.getToken({
				vapidKey:
					'BMqcZLLGiA35N58DuYCuSM5LzTu7omcbopC8VPEoeq0xJ7bgeVd_vT-I8S8hgligQcHnJ8e6uKorDIXQdQmEAOg',
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
