import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
	title: string = 'Gymnasium';
	constructor(public router: Router, private auth: AuthService) {}

	async ngOnInit() {
		const messaging = this.auth.messaging();
		// Get registration token. Initially this makes a network call, once retrieved
		// subsequent calls to getToken will return from cache.
		messaging
			.getToken({
				vapidKey:
					'BMqcZLLGiA35N58DuYCuSM5LzTu7omcbopC8VPEoeq0xJ7bgeVd_vT-I8S8hgligQcHnJ8e6uKorDIXQdQmEAOg',
			})
			.then(currentToken => {
				if (currentToken) {
					// sendTokenToServer(currentToken);
					// updateUIForPushEnabled(currentToken);
					console.info(currentToken);
				} else {
					// Show permission request.
					console.log(
						'No registration token available. Request permission to generate one.'
					);
					// Show permission UI.
					// updateUIForPushPermissionRequired();
					// setTokenSentToServer(false);
				}
			})
			.catch(err => {
				console.log('An error occurred while retrieving token. ', err);
				// showToken('Error retrieving registration token. ', err);
				// setTokenSentToServer(false);
			});
	}
}
