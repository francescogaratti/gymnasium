import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
	selector: 'app-mobile-sidenav',
	templateUrl: './mobile-sidenav.component.html',
	styleUrls: ['./mobile-sidenav.component.sass'],
})
export class MobileSidenavComponent implements OnInit {
	title = 'Gymnasium';
	showFiller = false;
	constructor(public router: Router, public auth: AuthService) {}

	ngOnInit(): void {}
}
