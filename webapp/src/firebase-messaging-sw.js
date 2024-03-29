// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
	apiKey: 'api-key',
	authDomain: 'project-id.firebaseapp.com',
	databaseURL: 'https://project-id.firebaseio.com',
	projectId: 'project-id',
	storageBucket: 'project-id.appspot.com',
	messagingSenderId: 'sender-id',
	appId: 'app-id',
	measurementId: 'G-measurement-id',
});

const messaging = firebase.messaging();
