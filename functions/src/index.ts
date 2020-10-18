// import * as functions from 'firebase-functions';
// import * as firebase from 'firebase/app';
// const database = require('firebase/database');
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
// firebase.initializeApp(firebaseConfig);

export * as excel from './create-excel';
