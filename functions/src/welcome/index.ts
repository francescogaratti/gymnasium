import * as firebase from 'firebase/app';
import 'firebase/firestore';
import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import { User } from '../../../models/user';

const myEmail = 'life4weeks@gmail.com';
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: myEmail,
		pass: 'totheisland97$',
	},
});

export const welcomeMail = functions.auth.user().onCreate((u: functions.auth.UserRecord) => {
	const user: User = {
		uid: u.uid,
		email: u.email ? u.email : '',
		displayName: u.displayName ? u.displayName : '',
		photoURL: u.photoURL ? u.photoURL : '',
		metadata: u.metadata,
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
                    Questa è un'email di conferma che ti sei registrato con successo al sito "Ultra Gymnasium"!
                </p>
                <a style="display: block;" href="https://ultra-gymnasium.web.app">Go to website<a />
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
	firebase
		.firestore()
		.collection('users')
		.doc(user.uid)
		.set(user)
		.then(() => console.info('Inserted new user'))
		.catch(err => console.info(err));
});
