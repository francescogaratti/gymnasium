import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Client } from '@models/user';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ClientService {
	// actual client
	client$: Subject<Client> = new Subject<Client>(); // future client
	private client: Client = null;
	// all the clients
	clients$: Subject<Client[]> = new Subject<Client[]>();
	private clients: Client[] = null;

	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar

	constructor(private afs: AngularFirestore) {}

	// *** READ ***

	/**
	 *
	 * @param id client id
	 */
	public async readClient(id: string): Promise<Client> {
		if (this.client) return this.client;
		console.info('📘 - read client ' + id);
		this.asyncOperation.next(true);
		this.client = await this.afs
			.collection('clients')
			.doc(id)
			.get()
			.toPromise()
			.then(snapshot => snapshot.data() as Client)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.client$.next(this.client);
		this.asyncOperation.next(false);
		return this.client;
	}

	public async readClients(): Promise<Client[]> {
		if (this.clients) return this.clients;
		console.info('📘 - read clients');
		this.asyncOperation.next(true);
		this.clients = await this.afs
			.collection('clients')
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
		this.clients$.next(this.clients);
		this.asyncOperation.next(false);
		return this.clients;
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

	async updateClient(client: Client, deepCopy?: boolean): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - update client');
		let res: boolean = await this.afs
			.collection('clients')
			.doc(client.uid)
			.set(deepCopy ? JSON.parse(JSON.stringify(client)) : client, { merge: true })
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
