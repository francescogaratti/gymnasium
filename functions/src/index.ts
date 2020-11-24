import * as firebase from 'firebase/app';
require('firebase/database');
require('firebase/firestore');

// automatically set the right firebase app
const firebaseConfig = process.env.FIREBASE_CONFIG;

if (firebaseConfig) firebase.initializeApp(JSON.parse(firebaseConfig));
else console.error('No config available');

export * as excel from './create-excel';

export * as welcome from './welcome';

export * as notifications from './notifications';

export * as pdf from './pdf';
