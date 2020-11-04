import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Admin, User } from '@models/user';
import { AdminService } from '@services/admin.service';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.sass'],
})
export class AdminComponent implements OnInit {
	selected_user: User = null;
	users: User[] = [];
	filteredUsers: Observable<User[]>;

	userFormControl: FormControl = new FormControl('', [Validators.required]);

	constructor(
		private adminService: AdminService,
		private auth: AuthService,
		private utils: UtilsService
	) {}

	ngOnInit(): void {
		this.filteredUsers = this.userFormControl.valueChanges.pipe(
			startWith(''),
			map(name => (name ? this._filterUsersByName(name) : this.users.slice()))
		);
		this.auth.readUsers().then(users => (this.users = users));
	}

	private _filterUsersByName(name: string): User[] {
		return this.users.filter(
			(u: User) => u.displayName.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) !== -1
		);
	}

	addAdmin(): void {
		const admin: Admin = new Admin(this.selected_user);
		this.adminService
			.updateAdmin(admin)
			.then(id => {
				if (id) {
					this.utils.openSnackBar(
						'Congratulazioni!',
						admin.displayName + ' è diventato amministratore!'
					);
					this.resetAdmin();
				} else this.utils.openSnackBar('Ops!', 'Qualcosa è andato storto...');
			})
			.catch(err => {
				console.error(err);
			});
	}

	deleteAdmin(): void {
		this.adminService
			.deleteAdmin(this.selected_user.uid)
			.then(id => {
				if (id) {
					this.utils.openSnackBar(
						'Eliminato!',
						this.selected_user.displayName +
							' è stato rimosso dal ruolo di Amministratore'
					);
					this.resetAdmin();
				} else this.utils.openSnackBar('Ops!', 'Qualcosa è andato storto...');
			})
			.catch(err => {
				console.error(err);
			});
	}

	changeUser(): void {
		this.selected_user = null;
		this.userFormControl.setValue(null);
		this.removePhoto();
	}

	selectedValueChange(user: User) {
		this.selected_user = user;
		let photoProfile: HTMLImageElement = document.getElementById(
			'photo-profile'
		) as HTMLImageElement;
		photoProfile.src = this.selected_user.photoURL;
		photoProfile.hidden = false;
	}

	removePhoto() {
		let photoProfile: HTMLImageElement = document.getElementById(
			'photo-profile'
		) as HTMLImageElement;
		photoProfile.hidden = true;
		photoProfile.src = '';
	}

	resetAdmin() {
		this.removePhoto();
		this.selected_user = null;
	}
}
