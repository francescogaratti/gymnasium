import { Component, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@models/user';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';
import { Observable } from 'rxjs/internal/Observable';

export function checkFiscalCode(nameRe: RegExp): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const forbidden = nameRe.test(control.value);
		return forbidden ? { forbiddenName: { value: control.value } } : null;
	};
}
// '(?:[\\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\\dLMNP-V]|[0L][1-9MNP-V]))'
const fiscalCodePattern: string =
	'(?:[\\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\\dLMNP-V]|[0L][1-9MNP-V]))';
@Component({
	selector: 'app-new-user',
	templateUrl: './new-user.component.html',
	styleUrls: ['./new-user.component.sass'],
	encapsulation: ViewEncapsulation.None,
})
export class NewClientComponent implements OnInit {
	user: User = null;
	selected_user: User = null;
	// all users & users
	users: User[] = [];
	clients: User[] = [];
	usersNotUsers: User[] = [];

	filteredUsers: Observable<User[]>;

	notShowUsers: boolean = false; // flag to toggle already users visibility
	alreadyUser: boolean = false;

	/** input user */

	nomeFormControl: FormControl = new FormControl('', [Validators.required]);
	cognomeFormControl: FormControl = new FormControl('', [Validators.required]);
	birthdayFormControl: FormControl = new FormControl('', [Validators.required]);
	sexFormControl: FormControl = new FormControl('', [Validators.required]);
	birthCountryFC: FormControl = new FormControl('', [Validators.required]);
	birthCityFC: FormControl = new FormControl('', [Validators.required]);
	codiceFiscaleFormControl: FormControl = new FormControl('', [
		Validators.required,
		Validators.maxLength(16),
		Validators.minLength(16),
		// Validators.pattern(fiscalCodePattern),
	]);

	stateFormControl: FormControl = new FormControl('', [Validators.required]);
	provinceFormControl: FormControl = new FormControl('', [Validators.required]);
	cityFormControl: FormControl = new FormControl('', [Validators.required]);
	postalCodeFormControl: FormControl = new FormControl('', [Validators.required]);
	streetFormControl: FormControl = new FormControl('', [Validators.required]);
	numberFC: FormControl = new FormControl('', [Validators.required]);

	photoFormControl: FormControl = new FormControl('', [Validators.required]);
	emailFC: FormControl = new FormControl('', [Validators.required, Validators.email]);

	mailNotifications: boolean = false;
	pushNotifications: boolean = true;

	/** ****** */

	formsControl: FormControl[] = [
		// anagraphics
		this.nomeFormControl,
		this.cognomeFormControl,
		this.birthdayFormControl,
		this.sexFormControl,
		this.birthCityFC,
		this.birthCountryFC,
		this.codiceFiscaleFormControl,
		// residence
		this.stateFormControl,
		this.provinceFormControl,
		this.cityFormControl,
		this.postalCodeFormControl,
		this.streetFormControl,
		this.numberFC,
		// contact
		this.photoFormControl,
		this.emailFC,
	];
	imageFile: File = null;
	constructor(
		private auth: AuthService,
		private utils: UtilsService,
		public router: Router,
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.resetUser();
		this.readUsersUsers();
	}

	async readUsersUsers() {
		this.users = await this.auth.readUsers();
		this.users = await this.userService.readUsers();
		this.usersNotUsers = [];
		if (this.users && this.users.length > 0) {
			if (this.users && this.users.length > 0)
				this.users.forEach((u: User) => {
					let found = this.users.find((c: User) => {
						// console.info(c.uid, u.uid);
						return c.uid == u.uid;
					});
					if (!found) this.usersNotUsers.push(u);
				});
			else this.usersNotUsers = JSON.parse(JSON.stringify(this.users));
		}
	}

	toggleNotShowUsers() {
		this.notShowUsers = !this.notShowUsers;
	}

	private _filterUsersByName(name: string): User[] {
		if (this.notShowUsers)
			return this.usersNotUsers.filter(
				(u: User) =>
					u.displayName.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) !== -1
			);
		else
			return this.users.filter(
				(u: User) =>
					u.displayName.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) !== -1
			);
	}

	async onSelectUser(user: User) {
		this.selected_user = user;
		this.nomeFormControl.setValue(this.selected_user.displayName.split(' ')[0]);
		this.cognomeFormControl.setValue(this.selected_user.displayName.split(' ')[1]);
		this.emailFC.setValue(this.selected_user.email);
		let path = await this.auth
			.getFile(this.selected_user.photoPath)
			.then(path => path)
			.catch(err => null);
		console.info(path);
		this.photoFormControl.setValue(
			this.selected_user.photoURL ? this.selected_user.photoURL : path
		);
		// check if it's already a user
		let existing_user = this.users.find((c: User) => c.uid == user.uid);
		if (existing_user) {
			this.alreadyUser = true;
			// anagraphics
			this.birthdayFormControl.setValue(new Date(existing_user.birthday));
			this.sexFormControl.setValue(existing_user.sex ? 'man' : 'woman');
			this.birthCountryFC.setValue(existing_user.birthCountry);
			this.birthCityFC.setValue(existing_user.birthCity);
			this.codiceFiscaleFormControl.setValue(existing_user.fiscalCode);
			// residence
			this.stateFormControl.setValue(existing_user.address.state);
			this.provinceFormControl.setValue(existing_user.address.province);
			this.cityFormControl.setValue(existing_user.address.city);
			this.postalCodeFormControl.setValue(existing_user.address.postalCode);
			this.streetFormControl.setValue(existing_user.address.street);
			this.numberFC.setValue(existing_user.address.number);
			// notifications
			this.mailNotifications = existing_user.notifications.mail;
			this.pushNotifications = existing_user.notifications.push;
		}
	}

	onNewImageFile(file: File) {
		this.imageFile = file;
	}

	async addUser() {
		// save the new typed name
		this.selected_user.displayName =
			this.nomeFormControl.value + ' ' + this.cognomeFormControl.value;
		this.user = new User(this.selected_user);
		// anagraphics
		this.user.displayName = this.nomeFormControl.value + ' ' + this.cognomeFormControl.value;
		this.user.birthday = new Date(this.birthdayFormControl.value).toUTCString();
		this.user.sex = this.sexFormControl.value == 'man' ? true : false;
		this.user.birthCountry = this.birthCountryFC.value;
		this.user.birthCity = this.birthCityFC.value;
		this.user.fiscalCode = this.codiceFiscaleFormControl.value;

		// residence information
		this.user.address = {
			state: this.stateFormControl.value,
			province: this.provinceFormControl.value,
			city: this.cityFormControl.value,
			postalCode: this.postalCodeFormControl.value,
			street: this.streetFormControl.value,
			number: this.numberFC.value,
		};
		// notifications
		this.user.notifications = {
			mail: this.mailNotifications,
			push: this.pushNotifications,
		};

		this.user.email = this.emailFC.value;

		console.info('Adding new user: ', this.user);
		if (this.imageFile)
			await this.auth
				.uploadImageToUser(this.imageFile, this.user.uid)
				.then(
					path => {
						this.user.photoPath = path ? path : '';
						this.selected_user.photoPath = this.user.photoPath;
					} // link to new photoURL
				)
				.catch(err => console.error('uploadImageToUser', err));
		this.updateUser(this.user);
	}

	async updateUser(user: User): Promise<void> {
		this.auth.updateUser(this.selected_user);
		return this.userService
			.updateUser(user, true)
			.then((value: boolean) => {
				if (value) {
					this.utils.openSnackBar(
						"L'utente " + user.displayName + ' è stato aggiunto con successo',
						'😉'
					);
					this.resetUser();
				} else
					this.utils.openSnackBar(
						'Attenzione, si è verificato un errore nel salvataggio del nuovo usere',
						'Riprovare'
					);
			})
			.catch(err => console.error('updateUser', err));
	}

	resetUser(): void {
		this.alreadyUser = false;
		this.selected_user = null;
		this.user = new User();
		this.pushNotifications = false;
		this.mailNotifications = false;
		this.formsControl.forEach((form: FormControl) => form.setValue(null));
	}
}
