import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@models/user';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.sass'],
})
export class MenuComponent implements OnInit {
	title: string = 'Gymnasium';
	type: string = 'Trainer';
	user: User = null;
	constructor(public router: Router, public auth: AuthService, public userService: UserService) {
		this.auth.user$.subscribe(user => (this.user = user));
	}

	ngOnInit(): void {}
}
