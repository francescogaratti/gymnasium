import { Component, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client, User, UserTypes } from '@models/user';
// import { Client } from '@models/client';
import { AuthService } from '@services/auth.service';
import { ClientService } from '@services/client.service';
import { UtilsService } from '@services/utils.service';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';

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
	selector: 'app-new-client',
	templateUrl: './new-client.component.html',
	styleUrls: ['./new-client.component.sass'],
	encapsulation: ViewEncapsulation.None,
})
export class NewClientComponent implements OnInit {
	client: Client = null;
	selected_user: User = null;
	// all clients & users
	clients: Client[] = [];
	users: User[] = [];
	usersNotClients: User[] = [];

	filteredUsers: Observable<User[]>;

	notShowClients: boolean = false; // flag to toggle already clients visibility
	alreadyClient: boolean = false;

	/** input client */

	userFormControl: FormControl = new FormControl('', [Validators.required]);

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
		this.userFormControl,
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
	my_input: HTMLInputElement = null;
	constructor(
		private auth: AuthService,
		private utils: UtilsService,
		public router: Router,
		private clientService: ClientService
	) {}

	ngOnInit(): void {
		this.my_input = document.createElement('input');
		this.my_input.onchange = () => this.getFiles();

		this.resetClient();
		this.filteredUsers = this.userFormControl.valueChanges.pipe(
			startWith(''),
			map(name => (name ? this._filterUsersByName(name) : this.users.slice()))
		);

		this.readUsersClients();
	}

	async readUsersClients() {
		this.users = await this.auth.readUsers();
		this.clients = await this.clientService.readClients();
		this.usersNotClients = [];
		if (this.users && this.users.length > 0) {
			if (this.clients && this.clients.length > 0)
				this.users.forEach((u: User) => {
					let found = this.clients.find((c: Client) => {
						console.info(c.uid, u.uid);
						return c.uid == u.uid;
					});
					if (!found) this.usersNotClients.push(u);
				});
			else this.usersNotClients = JSON.parse(JSON.stringify(this.users));
		}
	}

	toggleNotShowClients() {
		this.notShowClients = !this.notShowClients;
		this.userFormControl.setValue(null);
	}

	private _filterUsersByName(name: string): User[] {
		if (this.notShowClients)
			return this.usersNotClients.filter(
				(u: User) =>
					u.displayName.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) !== -1
			);
		else
			return this.users.filter(
				(u: User) =>
					u.displayName.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) !== -1
			);
	}

	changeUser(): void {
		this.selected_user = null;
		this.userFormControl.setValue(null);
		this.removePhoto();
		this.alreadyClient = false;
	}

	selectedValueChange(user: User) {
		this.selected_user = user;
		this.nomeFormControl.setValue(this.selected_user.displayName.split(' ')[0]);
		this.cognomeFormControl.setValue(this.selected_user.displayName.split(' ')[1]);
		this.emailFC.setValue(this.selected_user.email);
		this.photoFormControl.setValue(this.selected_user.photoURL);
		let photoProfile: HTMLImageElement = document.getElementById(
			'photo-profile'
		) as HTMLImageElement;
		photoProfile.src = this.selected_user.photoURL;
		photoProfile.hidden = false;
		// check if it's already a client
		let client = this.clients.find((c: Client) => c.uid == user.uid);
		if (client) {
			this.alreadyClient = true;
			// anagraphics
			this.birthdayFormControl.setValue(new Date(client.birthday));
			this.sexFormControl.setValue(client.sex ? 'man' : 'woman');
			this.birthCountryFC.setValue(client.birthCountry);
			this.birthCityFC.setValue(client.birthCity);
			this.codiceFiscaleFormControl.setValue(client.fiscalCode);
			// residence
			this.stateFormControl.setValue(client.address.state);
			this.provinceFormControl.setValue(client.address.province);
			this.cityFormControl.setValue(client.address.city);
			this.postalCodeFormControl.setValue(client.address.postalCode);
			this.streetFormControl.setValue(client.address.street);
			this.numberFC.setValue(client.address.number);
			// notifications
			this.mailNotifications = client.notifications.mail;
			this.pushNotifications = client.notifications.push;
		}
	}

	addClient(): void {
		this.selected_user.type = UserTypes.client;
		this.client = new Client(this.selected_user);
		// anagraphics
		this.client.displayName = this.nomeFormControl.value + ' ' + this.cognomeFormControl.value;
		this.client.birthday = new Date(this.birthdayFormControl.value).toUTCString();
		this.client.sex = this.sexFormControl.value == 'man' ? true : false;
		this.client.birthCountry = this.birthCountryFC.value;
		this.client.birthCity = this.birthCityFC.value;
		this.client.fiscalCode = this.codiceFiscaleFormControl.value;

		// residence information
		this.client.address = {
			state: this.stateFormControl.value,
			province: this.provinceFormControl.value,
			city: this.cityFormControl.value,
			postalCode: this.postalCodeFormControl.value,
			street: this.streetFormControl.value,
			number: this.numberFC.value,
		};
		// notifications
		this.client.notifications = {
			mail: this.mailNotifications,
			push: this.pushNotifications,
		};

		this.client.email = this.emailFC.value;

		console.info('Adding new client: ', this.client);
		if (this.my_input.files)
			this.auth
				.uploadImageToClient(this.my_input.files[0], this.client.uid)
				.then(path => {
					this.client.photoURL = path ? path : ''; // link to new photoURL
					this.updateClient(this.client);
				})
				.catch(err => console.error('uploadImageToClient', err));
		else this.updateClient(this.client);
	}

	async updateClient(client: Client): Promise<void> {
		this.auth.updateUser(this.selected_user);
		return this.clientService
			.updateClient(client, true)
			.then((value: boolean) => {
				if (value) {
					this.utils.openSnackBar(
						'Il cliente ' + client.displayName + ' è stato aggiunto con successo',
						'😉'
					);
					this.resetClient();
				} else
					this.utils.openSnackBar(
						'Attenzione, si è verificato un errore nel salvataggio del nuovo cliente',
						'Riprovare'
					);
			})
			.catch(err => console.error('updateClient', err));
	}

	resetClient(): void {
		this.alreadyClient = false;
		this.selected_user = null;
		this.client = new Client();
		this.pushNotifications = false;
		this.mailNotifications = false;
		this.formsControl.forEach((form: FormControl) => form.setValue(null));
		this.removePhoto();
	}

	uploadPhoto() {
		this.my_input.setAttribute('type', 'file');
		this.my_input.click();
	}

	getFiles() {
		const file = this.my_input.files[0];
		const url = URL.createObjectURL(file);
		this.photoFormControl.setValue(String(url));
		let photoProfile: HTMLImageElement = document.getElementById(
			'photo-profile'
		) as HTMLImageElement;
		photoProfile.src = url;
		photoProfile.hidden = false;
	}

	removePhoto() {
		let photoProfile: HTMLImageElement = document.getElementById(
			'photo-profile'
		) as HTMLImageElement;
		photoProfile.hidden = true;
		photoProfile.src = '';
		this.my_input.remove();
		this.my_input = document.createElement('input');
		this.my_input.onchange = () => this.getFiles();
	}
}
