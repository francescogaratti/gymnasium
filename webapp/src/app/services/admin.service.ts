import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Admin } from '@models/user';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AdminService {
	// actual admin
	admin$: Subject<Admin> = new Subject<Admin>(); // future admin
	private admin: Admin = null;
	// all the clients
	admins$: Subject<Admin[]> = new Subject<Admin[]>();
	private admins: Admin[] = null;

	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar

	constructor(private afs: AngularFirestore) {}

	// *** GET ***

	public async readAdmin(id: string): Promise<Admin> {
		if (this.admin) return this.admin;
		console.info('📘 - read admin ' + id);
		this.asyncOperation.next(true);
		this.admin = await this.afs
			.collection('admins')
			.doc(id)
			.get()
			.toPromise()
			.then(snapshot => snapshot.data() as Admin)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.admin$.next(this.admin);
		this.asyncOperation.next(false);
		return this.admin;
	}

	public async readAdmins(): Promise<Admin[]> {
		if (this.admins) return this.admins;
		console.info('📘 - read admins');
		this.asyncOperation.next(true);
		this.admins = await this.afs
			.collection('admins')
			.get()
			.toPromise()
			.then(snapshot => {
				let values: Admin[] = [];
				snapshot.forEach(doc => values.push(doc.data() as Admin));
				return values;
			})
			.catch(err => {
				console.error(err);
				return [];
			});
		this.admins$.next(this.admins);
		this.asyncOperation.next(false);
		return this.admins;
	}

	// *** POST ***

	async newAdmin(admin: Admin): Promise<string> {
		console.info('📗 - write');
		this.asyncOperation.next(true);
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
