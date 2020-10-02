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
 * @param {shirts} Shirt[] list of associated shirts
 * @author Davide Ghiotto
 */
export interface User {
	uid: string;
	email: string;
	displayName: string;
	photoURL: string;
	metadata: Metadata;
	shirts?: any[];
}

export const mocked: User = {
	uid: '3NHoQl7UUGZuWtNV02QM',
	email: 'test@gmail.com',
	displayName: 'Bomber Test',
	photoURL: 'no-one',
	metadata: {
		creationTime: '21/04/2020',
		lastSignInTime: '27/04/2020',
	},
	shirts: [],
};
