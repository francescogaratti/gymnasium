import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '@services/admin.service';
import { AuthService } from '@services/auth.service';
import { ClientService } from '@services/client.service';
import { TrainerService } from '@services/trainer.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.sass'],
})
export class MenuComponent implements OnInit {
	title: string = 'Gymnasium';
	type: string = 'Trainer';
	constructor(
		public router: Router,
		public auth: AuthService,
		public clientService: ClientService,
		public trainerService: TrainerService,
		public adminService: AdminService
	) {}

	ngOnInit(): void {}
}
