import * as firebase from 'firebase/app';
require('firebase/database');
require('firebase/firestore');
import { Workout } from '../../models/workout';
import { createWorkbook } from './excel';
import { User } from '../../models/user';
import { sendWelcomeMail, sendWorkoutMail } from './mails';

// automatically set the right firebase app
const firebaseConfig = process.env.FIREBASE_CONFIG;
// local dev fallback
const firebaseConfigTest = {
	apiKey: 'AIzaSyC7GHqyxUR4iCxMlG4hl1NSrrjPoIO66JE',
	authDomain: 'ultra-gymnasium-test.firebaseapp.com',
	databaseURL: 'https://ultra-gymnasium-test.firebaseio.com',
	projectId: 'ultra-gymnasium-test',
	storageBucket: 'ultra-gymnasium-test.appspot.com',
	messagingSenderId: '497854599467',
	appId: '1:497854599467:web:05dcd3097702a64e18f56e',
	measurementId: 'G-4WVYJZK2W4',
};

if (firebaseConfig) firebase.initializeApp(JSON.parse(firebaseConfig));
else {
	console.error('No config available');
	console.info('Loading local config');
	firebase.initializeApp(firebaseConfigTest);
}

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send(`<h1>ultra-gymnasium Node.js server on heroku</h1>`);
});

app.get('/excel', async (req, res) => {
	const id: string = String(req.query['workoutId']);
	if (!id) res.send(undefined);

	const workout: Workout | null = await firebase
		.firestore()
		.collection('workouts')
		.doc(id)
		.get()
		.then(snapshot => snapshot.data() as Workout)
		.catch(err => {
			console.error(err);
			return null;
		});
	// if something went wrong == > exit
	if (!workout) {
		res.send(undefined);
		return;
	}
	// now I have the workout to work with

	const filename = workout.name + '.xlsx';
	res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Origin', '*');

	const wb = createWorkbook(workout);
	wb.write(filename, res, function (err: any, stats: any) {
		if (err) {
			console.error(err);
		} else {
			res.send();
		}
	});
});

app.post('/user/new', async (req, res) => {
	const user: User = req.body;
	if (!user) res.send(undefined);

	// variable for the status of different operations
	const results: any = {
		mail: '',
		database: '',
	};

	// send email
	try {
		sendWelcomeMail(user);
		results.mail = '✔️';
	} catch (err) {
		results.mail = '❌';
	}

	// write new user to database
	await firebase
		.firestore()
		.collection('users')
		.doc(user.uid)
		.set(JSON.parse(JSON.stringify(user)))
		.then(() => (results.database = '✔️'))
		.catch(err => {
			results.database = '❌';
			console.error(err);
		});

	res.send(results);
});

app.post('/workouts/new', async (req, res) => {
	// todo: get from DB
	const user: User = req.body['user'];
	if (!user) res.send(undefined);
	// todo: get from DB
	const workout: Workout = req.body['workout'];
	if (!workout) res.send(undefined);
});

app.post('/workout/send', async (req, res) => {
	const user: User = req.body['user'];
	if (!user) res.send(undefined);
	const workout: Workout = req.body['workout'];
	if (!workout) res.send(undefined);
	try {
		sendWorkoutMail(user, workout);
	} catch (err) {
		console.error(err);
		res.send({ sent: false, message: 'An error occurred while sending the workout' });
	} finally {
		res.send({ sent: true, message: 'Workout sent to ' + user.email });
	}
});

app.listen(PORT, () => {
	console.log(`ultra-gymnasium listening at http://localhost:${PORT}`);
});
