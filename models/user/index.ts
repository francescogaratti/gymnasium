import { Shift } from '../shift';
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
	tokenId?: string;
}

export interface Client extends User {
	birthday: string;
	fiscalCode: string;
	address: string;
	city: string;
	postalCode: string;
	workouts: any[];
}

export class Client implements Client {
	constructor(user?: User) {
		if (user) {
			this.uid = user.uid;
			this.email = user.email;
			this.displayName = user.displayName;
			this.photoURL = user.photoURL;
			this.metadata = user.metadata;
			this.tokenId = user.tokenId;
		}
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
