import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserTypes } from '@models/user';
import { AuthService } from '@services/auth.service';

@Component({
	selector: 'app-mobile-sidenav',
	templateUrl: './mobile-sidenav.component.html',
	styleUrls: ['./mobile-sidenav.component.sass'],
})
export class MobileSidenavComponent implements OnInit {
	title = 'Gymnasium';
	showFiller = false;
	user: User = null;
	UserTypes = UserTypes;
	constructor(public router: Router, public auth: AuthService) {
		this.auth.user$.subscribe(user => (this.user = user));
	}

	ngOnInit(): void {}
}
