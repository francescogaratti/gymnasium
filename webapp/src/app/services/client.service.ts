import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Client } from '@models/user';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class ClientService {
	// actual client
	client$: Observable<Client> = new Observable<Client>(); // future client
	private client: Client;
	// all the clients
	clients$: Observable<Client[]> = new Observable<Client[]>();
	private clients: Client[] = [];

	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar

	constructor(private afs: AngularFirestore) {
		// store the client here
		this.client$.subscribe((client: Client) => (this.client = client));
		// store all the clients here
		this.clients$.subscribe((clients: Client[]) => (this.clients = clients));
	}

	// *** READ ***

	/**
	 *
	 * @param id client id
	 */
	public async readClient(id: string) {
		this.asyncOperation.next(true);
		console.info('📘 - read client ' + id);
		this.client$ = await this.afs
			.collection('clients')
			.doc(id)
			.get()
			.toPromise()
			.then(snapshot => of(snapshot.data() as Client))
			.catch(err => {
				console.error(err);
				return of(null);
			});
		this.asyncOperation.next(false);
	}

	public async readClients() {
		this.asyncOperation.next(true);
		console.info('📘 - read clients');
		this.clients$ = await this.afs
			.collection('clients')
			.get()
			.toPromise()
			.then(snapshot => {
				let values: Client[] = [];
				snapshot.forEach(doc => values.push(doc.data() as Client));
				return of(values);
			})
			.catch(err => {
				console.error(err);
				return of([]);
			});
		this.asyncOperation.next(false);
	}

	// *** POST ***

	async newClient(client: Client): Promise<string> {
		this.asyncOperation.next(true);
		console.info('📗 - write');
		let res: string = await this.afs
			.collection('clients')
			.add(client)
			.then(async (docRef: DocumentReference) => docRef.id)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async updateClient(client: Client): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - update client');
		let res: boolean = await this.afs
			.collection('clients')
			.doc(client.uid)
			.set(JSON.parse(JSON.stringify(client)), { merge: true })
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
			.doc(client.uid)
			.set({ workouts: client.workouts }, { merge: true })
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	// *** DELETE ***

	async deleteClient(id: string): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📕 - delete');
		let res: boolean = await this.afs
			.collection('clients')
			.doc(id)
			.delete()
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	// *** GETTER / SETTER ***

	public getClient(): Client {
		return this.client ? this.client : null;
	}

	public isClient(): boolean {
		return this.client ? true : false;
	}

	public getClients(): Client[] {
		return this.clients ? this.clients : [];
	}
}
