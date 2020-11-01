import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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
}
