import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
	constructor(private auth: AuthService, public router: Router) {}

	ngOnInit(): void {
		this.auth.startUi();
	}
}
