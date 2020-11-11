import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserTypes } from '@models/user';
import { AdminService } from '@services/admin.service';
import { AuthService } from '@services/auth.service';
import { ClientService } from '@services/client.service';
import { ManagerService } from '@services/manager.service';
import { TrainerService } from '@services/trainer.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.sass'],
})
export class MenuComponent implements OnInit {
	title: string = 'Gymnasium';
	type: string = 'Trainer';
	user: User = null;
	UserTypes = UserTypes;
	constructor(
		public router: Router,
		public auth: AuthService,
		public clientService: ClientService,
		public trainerService: TrainerService,
		public adminService: AdminService,
		public managerService: ManagerService
	) {
		this.auth.user$.subscribe(user => (this.user = user));
	}

	ngOnInit(): void {}
}
