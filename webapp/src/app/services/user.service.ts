import { Injectable } from '@angular/core';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	setDoc,
} from 'firebase/firestore';
import { User } from '@models/user';
import { Subject } from 'rxjs';
import { Workout } from '@models/workout';

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

	firestore = getFirestore();
	constructor() {}

	// *** READ ***

	public async readUser(id: string): Promise<User> {
		if (this.user) return this.user;
		this.asyncOperation.next(true);
		this.user = await getDoc(doc(this.firestore, 'users', id))
			.then(doc => doc.data() as User)
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
		this.asyncOperation.next(true);
		this.users = await getDocs(collection(this.firestore, 'users'))
			.then(snapshot => snapshot.docs.map(doc => doc.data() as User))
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

		const res: string = await addDoc(collection(this.firestore, 'users'), user)
			.then(docRef => docRef.id)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async updateUser(user: User): Promise<boolean> {
		this.asyncOperation.next(true);

		const res: boolean = await setDoc(
			doc(this.firestore, 'users', user.uid),
			{ ...user },
			{ merge: true }
		)
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async newUserWorkout(user: User, workout: Workout): Promise<boolean> {
		this.asyncOperation.next(true);
		if (user.workouts) user.workouts.push(workout.id);
		else user.workouts = [workout.id];
		const res: boolean = await setDoc(
			doc(this.firestore, 'users', user.uid),
			{ ...user },
			{ merge: true }
		)
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
		const res: boolean = await deleteDoc(doc(this.firestore, 'users', id))
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
