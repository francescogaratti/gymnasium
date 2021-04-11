import * as functions from 'firebase-functions';
import firebase = require('firebase');
import * as admin from 'firebase-admin';
import { DigitalWorkout } from '../../../models/workout';

import * as nodemailer from 'nodemailer';
import { createWorkbook } from '../create-excel';
import { User } from '../../../models/user';

admin.initializeApp();

const myEmail = 'life4weeks@gmail.com';
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: myEmail,
		pass: 'Totheisland97!',
	},
});

export const SendNotificationNewWorkout = functions.firestore
	.document('workouts/{workoutId}')
	.onCreate(async (snap, context) => {
		const workout: DigitalWorkout = snap.data() as DigitalWorkout;
		const clientId: string = workout.userId;
		if (!clientId) return;

		// get the user
		const user: User | null = await firebase
			.firestore()
			.collection('clients')
			.doc(clientId)
			.get()
			.then(snapshot => snapshot.data() as User)
			.catch(err => {
				console.error(err);
				return null;
			});

		if (user && user.notifications) {
			if (user.notifications.push)
				// web notification
				sendNotification(user)
					.then(() => console.log('Notification sent'))
					.catch((err: any) => console.error('Notification error', err));
			if (user.notifications.mail)
				// email with attachment
				sendMail(user, workout)
					.then(() => console.log('Email sent'))
					.catch((err: any) => console.error('Email error', err));
		}
	});

async function sendNotification(user: User) {
	// extract registration token
	const registrationTokens: string[] = user.tokenIds ? user.tokenIds : [];

	// if something went wrong == > exit
	if (!registrationTokens || registrationTokens.length === 0) return;

	const message: admin.messaging.MulticastMessage = {
		webpush: {
			notification: {
				title: 'Nuova scheda',
				// actions: [{ action: 'leggi', title: 'Leggi la scheda' }],
				body: 'La tua nuova scheda è pronta!',
			},
			fcmOptions: {
				link: 'https://ultra-gymnasium.web.app/area-personale?last=true',
			},
		},
		tokens: registrationTokens,
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
}

async function sendMail(user: User, workout: DigitalWorkout) {
	const wb = createWorkbook(workout);
	const filename = workout.name + '.xlsx';
	const excel_buffer: any = await wb.writeToBuffer().then((buffer: any) => buffer);

	const mailOptions = {
		from: 'Ultra Gymnasium ' + myEmail,
		to: user.email,
		subject: 'Nuova Scheda 📝🔥',
		html:
			`
			<body>
				<h3>
					La tua nuova scheda di allenamento <em>` +
			workout.name +
			`<em> è pronta.
				</h3>				
				<p style="display: block;">
					` +
			user.displayName +
			` 😄 <br>
					La puoi trovare insieme a tutte le altre schede scadute o passate nella tua <a href="https://ultra-gymnasium.web.app/area-personale/">area personale</a> del sito.
				</p>
				<p style="display: block;">
					Ecco la tua <a href="https://ultra-gymnasium.web.app/area-personale?last=true"> nuova scheda<a />
				</p>
			</body>
			`,
		attachments: [
			{
				filename: filename,
				content: excel_buffer,
			},
		],
	};

	transporter.sendMail(mailOptions, (err: any, info: any) => {
		if (err) {
			console.log('Error', err);
			throw err;
		} else {
			console.info('Email sent', info);
			return info;
		}
	});
}
