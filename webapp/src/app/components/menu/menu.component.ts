import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.sass'],
})
export class MenuComponent implements OnInit {
	title: string = 'Gymnasium';
	type: string = 'Trainer';
	constructor(public router: Router, public auth: AuthService) {}

	ngOnInit(): void {}
}
