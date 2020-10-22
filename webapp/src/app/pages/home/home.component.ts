import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
	title: string = 'Gymnasium';
	constructor(public router: Router) {}

	async ngOnInit() {
		let credential = await navigator.credentials.create({
			publicKey: {
				challenge: new Uint8Array([117, 61, 252, 231, 191, 241]),
				rp: { id: 'localhost:4201', name: 'ACME Corporation' },
				user: {
					id: new Uint8Array([79, 252, 83, 72, 214, 7, 89, 26]),
					name: 'jamiedoe',
					displayName: 'Jamie Doe',
				},
				pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
			},
		});
	}
}
