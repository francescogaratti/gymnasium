import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Admin } from '@models/user';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AdminService {
	// actual admin
	admin$: Observable<Admin> = new Observable<Admin>(); // future admin
	private admin: Admin;
	// all the clients
	admins$: Observable<Admin[]> = new Observable<Admin[]>();
	private admins: Admin[] = [];

	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar

	constructor(private afs: AngularFirestore) {
		// store the admin here
		this.admin$.subscribe((admin: Admin) => (this.admin = admin));
		// store all the clients here
		this.admins$.subscribe((admins: Admin[]) => (this.admins = admins));
	}

	// *** GET ***

	public async readAdmin(id: string) {
		this.asyncOperation.next(true);
		console.info('📘 - read admin ' + id);
		this.admin$ = await this.afs
			.collection('admins')
			.doc(id)
			.get()
			.toPromise()
			.then(snapshot => of(snapshot.data() as Admin))
			.catch(err => {
				console.error(err);
				return of(null);
			});
		this.asyncOperation.next(false);
	}

	// *** POST ***

	async newAdmin(admin: Admin): Promise<string> {
		this.asyncOperation.next(true);
		console.info('📗 - write');
		let res: string = await this.afs
			.collection('admins')
			.add(JSON.parse(JSON.stringify(admin)))
			.then(async (docRef: DocumentReference) => docRef.id)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async updateAdmin(admin: Admin): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - update admin');
		let res: boolean = await this.afs
			.collection('admins')
			.doc(admin.uid)
			.set(JSON.parse(JSON.stringify(admin)), { merge: true })
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	// *** DELETE ***

	async deleteAdmin(id: string): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📕 - delete');
		let res: boolean = await this.afs
			.collection('admins')
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
}
