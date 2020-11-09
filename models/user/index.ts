/**
 * @interface Metadata
 * @description contains additional info about the user
 * @param {creationTime} string date of the creation of the account
 * @param {lastSignInTime} string date of the last sign in
 * @author Davide Ghiotto
 */
interface Metadata {
	creationTime: string;
	lastSignInTime: string;
}

export enum UserTypes {
	user = 'User',
	client = 'Client',
	trainer = 'Trainer',
	manager = 'Manager',
	admin = 'Admin',
	receptionist = 'Receptionist',
}

export interface Address {
	state: string;
	province: string;
	city: string;
	postalCode: string;
	street: string;
	number: string;
}

export interface Shift {
	day: string;
	start: string;
	end: string;
}

/**
 * @interface User
 * @description interface for the user data returned by `firebase auth`
 * @param {uid} string unique id assigned to the user by `firebase auth`
 * @param {email} string email of the user
 * @param {displayName} string name of the user
 * @param {photoURL} string url of the profile picture of the user
 * @param {metadata} Metadata additonal information
 * @author Davide Ghiotto
 */
export interface User {
	uid: string;
	email: string;
	displayName: string;
	photoURL: string;
	metadata: Metadata;
	tokenIds?: string[];
	type?: string;
	notifications: {
		mail: boolean;
		push: boolean;
	};
}

export class User implements User {
	constructor(user?: User) {
		this.uid = user && user.uid ? user.uid : '';
		this.email = user && user.email ? user.email : '';
		this.displayName = user && user.displayName ? user.displayName : '';
		this.photoURL = user && user.photoURL ? user.photoURL : '';
		this.metadata =
			user && user.metadata
				? user.metadata
				: {
						creationTime: '',
						lastSignInTime: '',
				  };
		this.tokenIds = user && user.tokenIds ? user.tokenIds : [];
		this.type = user && user.type ? user.type : '';
		this.notifications =
			user && user.notifications
				? user.notifications
				: {
						mail: false,
						push: false,
				  };
	}
}

export interface Client extends User {
	sex: boolean;
	birthday: string;
	birthCountry: string;
	birthCity: string;
	fiscalCode: string;
	address: Address;
	workouts: any[];
}

export class Client extends User {
	constructor(user?: User) {
		super(user);
	}
}

export interface Employee extends User {
	birthday: string;
	fiscalCode: string;
	address: string;
	city: string;
	postalCode: string;
	shifts: Shift[];
}

export interface Trainer extends Employee {
	clients: any[];
}

export interface Receptionist extends Employee {}

export interface Admin extends User {}

export class Admin extends User {
	constructor(user: User) {
		super(user);
	}
}

export interface Manager extends User {}

export class Manager extends User {
	constructor(user: User) {
		super(user);
	}
}
