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

	clients$:Subject<Client[]> = new Subject<Client[]>();
	constructor(
		private afAuth: AngularFireAuth,
		private afs: AngularFirestore,
		private afstr: AngularFireStorage,
		private aff: AngularFireFunctions,
		private router: Router
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

	async readClient(id:string):Promise<Client>{
		console.info('📘 - get client ' + id);
		this.asyncOperation.next(true);
		let client:Client = await this.afs
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
			.then(async (docRef:DocumentReference) => {
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

	async updateClient(client:Client): Promise<boolean>{
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
						console.warn('more than one records found with fiscalCode: ', client.fiscalCode);
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

	async newWorkoutOld(workout:WorkoutOld):Promise<boolean>{
		this.asyncOperation.next(true);
		console.info('📗 - write');
		let res: boolean = await this.afs
			.collection('workouts')
			.add(workout)
			.then(async (docRef:DocumentReference) => {
				// workout.id = docRef.id;
				// let update_res = await this.updateWorkout(workout);
				// return update_res;
				return true;
			})
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}
}
