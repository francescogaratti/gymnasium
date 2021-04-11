import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@models/user';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.sass'],
})
export class UsersComponent implements OnInit {
	displayedColumns: string[] = ['name', 'fiscalCode', 'delete', 'detail'];
	users: User[] = [];
	constructor(
		private utils: UtilsService,
		public router: Router,
		private userService: UserService
	) {}

	ngOnInit(): void {}

	showUsers() {
		this.userService.readUsers().then((users: User[]) => {
			this.users = users;
			if (!this.users || this.users.length == 0)
				this.utils.openSnackBar(
					'Nessun usere presente.',
					'Per inserirne uno cliccare su "Nuovo Usere"',
					10000
				);
		});
	}

	remove(user: User) {
		this.userService
			.deleteUser(user.uid)
			.then(res => {
				if (res) {
					this.utils.openSnackBar(
						'Il usere ' + user.displayName + ' è stato correttamente rimosso',
						'👋👋'
					);
					this.showUsers();
				}
			})
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar(
					"Si è verificato un errore durante l'eliminazione del usere " +
						user.displayName,
					'Si prega di riprovare.'
				);
			});
	}

	detail(user: User) {
		this.router.navigateByUrl('user?id=' + user.uid);
	}
}
