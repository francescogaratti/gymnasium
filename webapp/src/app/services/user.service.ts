import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { User } from '@models/user';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	// actual user
	user$: Subject<User> = new Subject<User>(); // future user
	private user: User = null;
	// all the users
	users$: Subject<User[]> = new Subject<User[]>();
	private users: User[] = null;

	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar

	constructor(private afs: AngularFirestore) {}

	// *** READ ***

	public async readUser(id: string): Promise<User> {
		if (this.user) return this.user;
		console.info('📘 - read user ' + id);
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
		this.users$.next(this.users);
		this.asyncOperation.next(false);
		return this.users;
	}

	// *** POST ***

	async newUser(user: User): Promise<string> {
		this.asyncOperation.next(true);
		console.info('📗 - write');
		let res: string = await this.afs
			.collection('users')
			.add(user)
			.then(async (docRef: DocumentReference) => docRef.id)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async updateUser(user: User, deepCopy?: boolean): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - update user');
		let res: boolean = await this.afs
			.collection('users')
			.doc(user.uid)
			.set(deepCopy ? JSON.parse(JSON.stringify(user)) : user, { merge: true })
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async newUserWorkout(user: User, workoutId: string): Promise<boolean> {
		this.asyncOperation.next(true);
		let new_workout_ref: DocumentReference = this.afs.collection('workouts').doc(workoutId).ref;
		if (user.workouts) user.workouts.push(new_workout_ref);
		else user.workouts = [new_workout_ref];
		console.info('📗 - append workout');
		let res: boolean = await this.afs
			.collection('users')
			.doc(user.uid)
			.set({ workouts: user.workouts }, { merge: true })
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	// *** DELETE ***

	async deleteUser(id: string): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📕 - delete');
		let res: boolean = await this.afs
			.collection('users')
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

	public getUser(): User {
		return this.user ? this.user : null;
	}

	public isUser(): boolean {
		return this.user ? true : false;
	}

	public getUsers(): User[] {
		return this.users ? this.users : [];
	}
}
