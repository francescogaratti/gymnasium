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

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';

import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from '@models/user';
import { Client } from '@models/client';
import { Workout, WorkoutOld } from '@models/workout';
import { HttpClient } from '@angular/common/http';

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
	user$: Observable<User>; // user observable
	user: User;
	ui: firebaseui.auth.AuthUI = new firebaseui.auth.AuthUI(auth()); // login firebase ui
	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar

	clients$: Subject<Client[]> = new Subject<Client[]>();
	constructor(
		private afAuth: AngularFireAuth,
		private afs: AngularFirestore,
		private afstr: AngularFireStorage,
		private aff: AngularFireFunctions,
		private router: Router,
		private http: HttpClient
	) {
		this.getUser();
	}

	async getUser() {
		this.user$ = this.afAuth.authState.pipe(
			switchMap(user => {
				this.asyncOperation.next(false);
				// Logged in
				if (user) {
					this.user = user as User;
					return of(this.user);
				} else {
					// Logged out
					return of(null);
				}
			})
		);
	}

	startUi() {
		this.ui.start('#firebaseui-auth-container', uiConfig);
	}

	signOut() {
		this.afAuth.signOut();
	}

	firestore() {
		return this.afs;
	}

	public async readClients() {
		console.info('📘 - read');
		this.asyncOperation.next(true);
		let res = await this.afs
			.collection('clients')
			// .doc(this.user.uid)
			// .collection('records')
			.get()
			.toPromise()
			.then(snapshot => {
				let values: Client[] = [];
				snapshot.forEach(doc => values.push(doc.data() as Client));
				return values;
			})
			.catch(err => {
				console.error(err);
				return [];
			});
		this.asyncOperation.next(false);
		console.info(res);
		this.clients$.next(res); // send to subscribers
	}

	async readClient(id: string): Promise<Client> {
		console.info('📘 - get client ' + id);
		this.asyncOperation.next(true);
		let client: Client = await this.afs
			.collection('clients')
			.doc(id)
			.get()
			.toPromise()
			.then(snapshot => snapshot.data() as Client)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return client;
	}

	async newClient(client: Client): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - write');
		let res: boolean = await this.afs
			.collection('clients')
			.add(client)
			.then(async (docRef: DocumentReference) => {
				client.id = docRef.id;
				let update_res = await this.updateClient(client);
				return update_res;
			})
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async updateClient(client: Client): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - update client');
		let res: boolean = await this.afs
			.collection('clients')
			.doc(client.id)
			.set(client, { merge: true })
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async deleteClient(client: Client): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📘 - read');
		let res: boolean = false;
		// records reference
		let clientsRef = this.afs.collection('clients').ref;
		// prepare query
		let query = clientsRef.where('fiscalCode', '==', client.fiscalCode);
		// find doc id with date == record.date
		let id: string = await query
			.get()
			.then(found => {
				if (!found) return null;
				else {
					if (found.docs.length > 1)
						console.warn(
							'more than one records found with fiscalCode: ',
							client.fiscalCode
						);
					return found.docs[0].id; // me fido
				}
			})
			.catch(err => {
				console.error(err);
				return null;
			});
		if (id) {
			console.info('📕 - delete');
			// delete that doc
			res = await clientsRef
				.doc(id)
				.delete()
				.then(() => true) // unica possibilità di diventare "true"
				.catch(err => {
					console.error(err);
					return false;
				});
		}
		this.asyncOperation.next(false);
		return res;
	}

	// workouts

	async newWorkoutOld(workout: WorkoutOld): Promise<string> {
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

	async updateWorkoutOld(workout: WorkoutOld): Promise<boolean> {
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

	async updateWorkout(workout: Workout): Promise<boolean> {
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

	async newClientWorkout(client: Client, workoutId: string): Promise<boolean> {
		this.asyncOperation.next(true);
		let new_workout_ref: DocumentReference = this.afs.collection('workouts').doc(workoutId).ref;
		if (client.workouts) client.workouts.push(new_workout_ref);
		else client.workouts = [new_workout_ref];
		console.info('📗 - append workout');
		let res: boolean = await this.afs
			.collection('clients')
			.doc(client.id)
			.set({ workouts: client.workouts }, { merge: true })
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	public async readClientWorkoutsOld(client: Client): Promise<WorkoutOld[]> {
		this.asyncOperation.next(true);
		let workouts: WorkoutOld[] = await this.afs
			.collection('clients')
			.doc(client.id)
			.get()
			.toPromise()
			.then(async snapshot => {
				let refs: DocumentReference[] = snapshot.get('workouts');
				let promises: Promise<WorkoutOld>[] = [];
				refs.forEach((ref: DocumentReference) =>
					promises.push(ref.get().then(res => res.data() as WorkoutOld))
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

	async newWorkout(workout: Workout, client: Client): Promise<boolean> {
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
		let res: boolean = await this.newClientWorkout(client, workoutId);
		this.asyncOperation.next(false);
		return res;
	}

	public async readClientWorkouts(client: Client): Promise<Workout[]> {
		this.asyncOperation.next(true);
		let workouts: Workout[] = await this.afs
			.collection('clients')
			.doc(client.id)
			.get()
			.toPromise()
			.then(async snapshot => {
				let refs: DocumentReference[] = snapshot.get('workouts');
				let promises: Promise<Workout>[] = [];
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
				.doc(client.id)
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
			res = await this.updateClient(client);
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

	async uploadImage(image: File) {
		let ref = this.afstr.ref('');
		let fileRef = ref.child(image.name);
		fileRef.put(image).then(function (snapshot) {
			console.log('Uploaded a blob or file!', snapshot);
		});
	}
}
