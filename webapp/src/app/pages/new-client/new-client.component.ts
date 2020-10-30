import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client, User } from '@models/user';
// import { Client } from '@models/client';
import { AuthService } from '@services/auth.service';
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

	filteredUsers: Observable<User[]>;

	userFormControl: FormControl = new FormControl('', [Validators.required]);
	nomeFormControl: FormControl = new FormControl('', [Validators.required]);
	cognomeFormControl: FormControl = new FormControl('', [Validators.required]);
	birthdayFormControl: FormControl = new FormControl('', [Validators.required]);
	codicePostaleFormControl: FormControl = new FormControl('', [Validators.required]);
	codiceFiscaleFormControl: FormControl = new FormControl('', [
		Validators.required,
		Validators.maxLength(16),
		Validators.minLength(16),
		// Validators.pattern(fiscalCodePattern),
	]);
	photoFormControl: FormControl = new FormControl('', [Validators.required]);
	indirizzoFormControl: FormControl = new FormControl('', [Validators.required]);
	provinciaFormControl: FormControl = new FormControl('', [Validators.required]);
	cittaFormControl: FormControl = new FormControl('', [Validators.required]);

	formsControl: FormControl[] = [
		this.userFormControl,
		this.nomeFormControl,
		this.cognomeFormControl,
		this.birthdayFormControl,
		this.codicePostaleFormControl,
		this.codiceFiscaleFormControl,
		this.photoFormControl,
		this.indirizzoFormControl,
		this.provinciaFormControl,
		this.cittaFormControl,
	];
	my_input: HTMLInputElement = null;
	constructor(private auth: AuthService, private utils: UtilsService, public router: Router) {
		this.auth.clients$.subscribe((clients: Client[]) => (this.clients = clients));
		this.auth.users$.subscribe((users: User[]) => (this.users = users));
	}

	ngOnInit(): void {
		this.my_input = document.createElement('input');
		this.my_input.onchange = () => this.getFiles();
		this.resetClient();
		this.filteredUsers = this.userFormControl.valueChanges.pipe(
			startWith(''),
			map(name => (name ? this._filterUsersByName(name) : this.users.slice()))
		);
		this.auth.readUsers();
		// this.auth.readClients();
	}

	private _filterUsersByName(name: string): User[] {
		return this.users.filter(
			(u: User) => u.displayName.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) !== -1
		);
	}

	changeUser(): void {
		this.selected_user = null;
		this.userFormControl.setValue(null);
		this.removePhoto();
	}

	selectedValueChange(user: User) {
		this.selected_user = user;
		this.nomeFormControl.setValue(this.selected_user.displayName.split(' ')[0]);
		this.cognomeFormControl.setValue(this.selected_user.displayName.split(' ')[1]);
		this.photoFormControl.setValue(this.selected_user.photoURL);
		let photoProfile: HTMLImageElement = document.getElementById(
			'photo-profile'
		) as HTMLImageElement;
		photoProfile.src = this.selected_user.photoURL;
		photoProfile.hidden = false;
	}

	addClient(): void {
		this.client = new Client(this.selected_user);

		this.client.birthday = new Date(this.birthdayFormControl.value).toUTCString();
		this.client.fiscalCode = this.codiceFiscaleFormControl.value;
		this.client.address = this.indirizzoFormControl.value;
		this.client.city = this.cittaFormControl.value;
		this.client.postalCode = this.codicePostaleFormControl.value;

		console.info('Adding new client: ', this.client);
		if (this.my_input.files)
			this.auth
				.uploadImageToClient(this.my_input.files[0], this.client.uid)
				.then(path => {
					console.info(path);
					this.client.photoURL = path; // link to new photoURL
					this.updateClient(this.client);
				})
				.catch(err => console.error('uploadImageToClient', err));
		else this.updateClient(this.client);
	}

	async updateClient(client: Client): Promise<void> {
		return this.auth
			.updateClient(client)
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
		this.client = new Client();
		this.formsControl.forEach((form: FormControl) => form.setValue(null));
		this.removePhoto();
	}

	uploadPhoto() {
		console.info('uploadPhoto');
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
