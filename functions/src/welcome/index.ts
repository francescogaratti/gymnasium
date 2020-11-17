/** firebase */
import * as functions from 'firebase-functions';
import firebase = require('firebase');
/** extra dependencies */
import * as nodemailer from 'nodemailer';
/** models */
import { User, UserTypes } from '../../../models/user';

const myEmail = 'life4weeks@gmail.com';
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: myEmail,
		pass: 'Totheisland97!',
	},
});

export const welcomeMail = functions.auth.user().onCreate(async (u: functions.auth.UserRecord) => {
	const user: User = {
		uid: u.uid,
		email: u.email ? u.email : '',
		displayName: u.displayName ? u.displayName : '',
		photoURL: u.photoURL ? u.photoURL : '',
		photoPath: '', // ? this is needed when the user upload something to firebase storage
		metadata: u.metadata,
		tokenIds: [],
		type: UserTypes.user,
		notifications: {
			push: false,
			mail: false,
		},
	};

	const mailOptions = {
		from: 'Ultra Gymnasium ' + myEmail,
		to: user.email,
		subject: 'Registrazione Ultra Gymnasium',
		html:
			`
			<body>
				<h3>
					Benvenuto ` +
			user.displayName +
			` 😄
				</h3>
				<p style="display: block;">
					Questa è un'email di conferma che ti sei registrato con successo al sito <strong>Ultra Gymnasium</strong>.
				</p>
				<a style="display: block;" href="https://ultra-gymnasium.web.app">Vai al sito<a />
			</body>	
		`,
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

	// write new user to database
	await firebase
		.firestore()
		.collection('users')
		.doc(user.uid)
		.set(JSON.parse(JSON.stringify(user)))
		.then(() => console.info('Inserted new user'))
		.catch(err => console.info(err));
	return;
});
