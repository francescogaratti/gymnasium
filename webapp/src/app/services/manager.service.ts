import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Manager } from '@models/user';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

	// actual manager
	manager$: Observable<Manager> = new Observable<Manager>(); // future manager
	private manager: Manager;
	// all the clients
	managers$: Observable<Manager[]> = new Observable<Manager[]>();
	private managers: Manager[] = [];

	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar
  
  constructor(private afs: AngularFirestore) {
		// store the manager here
		this.manager$.subscribe((manager: Manager) => (this.manager = manager));
		// store all the clients here
		this.managers$.subscribe((managers: Manager[]) => (this.managers = managers));
	}

	// *** GET ***

	public async readManager(id: string) {
		this.asyncOperation.next(true);
		console.info('📘 - read manager ' + id);
		this.manager$ = await this.afs
			.collection('managers')
			.doc(id)
			.get()
			.toPromise()
			.then(snapshot => of(snapshot.data() as Manager))
			.catch(err => {
				console.error(err);
				return of(null);
			});
		this.asyncOperation.next(false);
	}

	// *** POST ***

	async newManager(manager: Manager): Promise<string> {
		this.asyncOperation.next(true);
		console.info('📗 - write');
		let res: string = await this.afs
			.collection('managers')
			.add(JSON.parse(JSON.stringify(manager)))
			.then(async (docRef: DocumentReference) => docRef.id)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async updateManager(manager: Manager): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - update manager');
		let res: boolean = await this.afs
			.collection('managers')
			.doc(manager.uid)
			.set(JSON.parse(JSON.stringify(manager)), { merge: true })
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	// *** DELETE ***
}
