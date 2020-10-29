import * as functions from 'firebase-functions';
import firebase = require('firebase');
import * as admin from 'firebase-admin';
import { Client } from '../../../models/user';
import { DigitalWorkout } from '../../../models/workout';

admin.initializeApp();

// This registration token comes from the client FCM SDKs.
// 'd3EisCzJPJ-Pz8dVjMrc7D:APA91bFuKBW6tTBm--M3TrO0ko9IpHgHovrBJBpK6uxuXvvKtqCasOaYXeSXBckB7gXCXFG6nx9lcXFYcd1_WWFTSD6edJ3H6Rdn7bfnufWs0nhA3wJf5poOUXWi6Vian_VF3zirPkZ6';
export const SendNotificationNewWorkout = functions.firestore
	.document('workouts/{workoutId}')
	.onCreate(async (snap, context) => {
		console.info(snap.data());
		const workout: DigitalWorkout = snap.data() as DigitalWorkout;

		const clientId: string = workout.clientId;
		if (!clientId) {
			return;
		}
		// extract the client
		const client: Client | null = await firebase
			.firestore()
			.collection('clients')
			.doc(clientId)
			.get()
			.then(snapshot => snapshot.data() as Client)
			.catch(err => {
				console.error(err);
				return null;
			});
		// extract registration token
		const registrationToken: string = client && client.tokenId ? client.tokenId : '';

		// if something went wrong == > exit
		if (!registrationToken || registrationToken.length == 0) {
			return;
		}

		const message: admin.messaging.MulticastMessage = {
			webpush: {
				notification: {
					title: 'Nuova scheda',
					actions: [{ action: 'leggi', title: 'Leggi la scheda' }],
					data: {
						clientId: '12345',
					},
					body: 'La tua nuova scheda è pronta!',
					image:
						'https://firebasestorage.googleapis.com/v0/b/ultra-gymnasium.appspot.com/o/profile-images%2FQnYr6IhAXstlPiS51XRw%2Fme.jpg?alt=media&token=105cb25c-e489-4d58-bf05-f9abbe1125a5',
				},
				fcmOptions: {
					link: 'https://ultra-gymnasium.web.app/home',
				},
			},
			tokens: [registrationToken],
		};
		// Send a message to the device corresponding to the provided
		// registration token.
		await admin
			.messaging()
			.sendMulticast(message)
			.then((response: any) => {
				// Response is a message ID string.
				console.log('Successfully sent message:', response);
			})
			.catch((error: any) => {
				console.log('Error sending message:', error);
			});
	});

export const sendNotification = functions.https.onRequest(
	async (req: functions.https.Request, res: functions.Response<boolean>) => {
		const clientId: string = String(req.query['clientId']);
		if (!clientId) {
			res.send(false);
			return;
		}
		// extract the client
		const client: Client | null = await firebase
			.firestore()
			.collection('clients')
			.doc(clientId)
			.get()
			.then(snapshot => snapshot.data() as Client)
			.catch(err => {
				console.error(err);
				return null;
			});
		// extract registration token
		const registrationToken: string = client && client.tokenId ? client.tokenId : '';

		// if something went wrong == > exit
		if (!registrationToken || registrationToken.length == 0) {
			res.send(false);
			return;
		}

		const message: admin.messaging.MulticastMessage = {
			webpush: {
				notification: {
					title: 'Nuova scheda',
					actions: [{ action: 'leggi', title: 'Leggi la scheda' }],
					data: {
						clientId: '12345',
					},
					body: 'La tua nuova scheda è pronta!',
					image:
						'https://firebasestorage.googleapis.com/v0/b/ultra-gymnasium.appspot.com/o/profile-images%2FQnYr6IhAXstlPiS51XRw%2Fme.jpg?alt=media&token=105cb25c-e489-4d58-bf05-f9abbe1125a5',
				},
				fcmOptions: {
					link: 'https://ultra-gymnasium.web.app/home',
				},
			},
			tokens: [registrationToken],
		};
		// Send a message to the device corresponding to the provided
		// registration token.
		await admin
			.messaging()
			.sendMulticast(message)
			.then((response: any) => {
				// Response is a message ID string.
				console.log('Successfully sent message:', response);
			})
			.catch((error: any) => {
				console.log('Error sending message:', error);
			});
		res.send(true);
	}
);
