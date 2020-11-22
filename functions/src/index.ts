import * as firebase from 'firebase/app';
require('firebase/database');
require('firebase/firestore');

// const firebaseConfig = {
// 	apiKey: 'AIzaSyAX-eB7XUbfgRKxpq3y4nFnSkF2-iBv2Wk',
// 	authDomain: 'ultra-gymnasium.firebaseapp.com',
// 	databaseURL: 'https://ultra-gymnasium.firebaseio.com',
// 	projectId: 'ultra-gymnasium',
// 	storageBucket: 'ultra-gymnasium.appspot.com',
// 	messagingSenderId: '13160087679',
// 	appId: '1:13160087679:web:636c78361cf50f78773f4a',
// 	measurementId: 'G-N3YW5GFN8D',
// };
const firebaseConfig = process.env.FIREBASE_CONFIG;
if (firebaseConfig) firebase.initializeApp(JSON.parse(firebaseConfig));
else console.error('No config available');

export * as excel from './create-excel';

export * as welcome from './welcome';

export * as notifications from './notifications';
