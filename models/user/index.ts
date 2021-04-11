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
 * @param {tokenIds} string[] list of tokens for notifications
 * @param {notifications} any preferences for notifications
 * @param {workouts} Workout[] list of workouts
 * @author Davide Ghiotto
 */
export interface User {
	uid: string;
	email: string;
	displayName: string;
	photoURL: string;
	photoPath: string;
	metadata: Metadata;
	tokenIds?: string[];
	notifications: {
		mail: boolean;
		push: boolean;
	};
	workouts: any[] | null;
}

export class User implements User {
	constructor(user?: User) {
		this.uid = user && user.uid ? user.uid : '';
		this.email = user && user.email ? user.email : '';
		this.displayName = user && user.displayName ? user.displayName : '';
		this.photoURL = user && user.photoURL ? user.photoURL : '';
		this.photoPath = user && user.photoPath ? user.photoPath : '';
		this.metadata =
			user && user.metadata
				? user.metadata
				: {
						creationTime: '',
						lastSignInTime: '',
				  };
		this.tokenIds = user && user.tokenIds ? user.tokenIds : [];
		this.notifications =
			user && user.notifications
				? user.notifications
				: {
						mail: false,
						push: false,
				  };
		this.workouts = user && user.workouts ? user.workouts : [];
	}
}
