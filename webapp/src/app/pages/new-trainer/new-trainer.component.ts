import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { Client } from '@models/client';
import { EmployeeType } from '@models/employee';
import { Trainer } from '@models/trainer';
import { Client, User } from '@models/user';
import { AuthService } from '@services/auth.service';
import { ClientService } from '@services/client.service';
import { UtilsService } from '@services/utils.service';

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
	selector: 'app-new-trainer',
	templateUrl: './new-trainer.component.html',
	styleUrls: ['./new-trainer.component.sass'],
	encapsulation: ViewEncapsulation.None,
})
export class NewTrainerComponent implements OnInit {
	client: Client = null;
	trainer: Trainer = null;

	nomeFormControl: FormControl = new FormControl('', [Validators.required]);
	cognomeFormControl: FormControl = new FormControl('', [Validators.required]);
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
		this.nomeFormControl,
		this.cognomeFormControl,
		this.codicePostaleFormControl,
		this.codiceFiscaleFormControl,
		this.photoFormControl,
		this.indirizzoFormControl,
		this.provinciaFormControl,
		this.cittaFormControl,
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
		this.resetClient(this.client);
		this.resetTrainer(this.trainer);
	}

	addClient(user: User): void {
		this.client = new Client(user ? user : this.auth.user);
		this.client.fiscalCode = this.codiceFiscaleFormControl.value;
		this.client.address = this.indirizzoFormControl.value;
		this.client.city = this.cittaFormControl.value;
		this.client.postalCode = this.codicePostaleFormControl.value;
		console.info('Adding new client: ', this.client);
		this.clientService
			.newClient(this.client)
			.then((id: string) => {
				if (id) {
					this.client.uid = id;
					this.auth
						.uploadImageToClient(this.my_input.files[0], id)
						.then(path => {
							console.info(path);
							this.client.photoURL = path;
							this.clientService
								.updateClient(this.client)
								.then((value: boolean) => {
									if (value) {
										this.utils.openSnackBar(
											"L'istruttore " +
												this.client.displayName +
												' è stato aggiunto con successo',
											'😉'
										);
										this.resetClient(this.client);
									} else
										this.utils.openSnackBar(
											'Attenzione, si è verificato un errore nel salvataggio del nuovo utente',
											'Riprovare'
										);
								})
								.catch(err => console.error('updateClient', err));
						})
						.catch(err => console.error('uploadImageToClient', err));
				} else
					this.utils.openSnackBar(
						'Attenzione, si è verificato un errore nel salvataggio del nuovo utente',
						'Riprovare'
					);
			})
			.catch(err => console.error('newClient', err));
	}

	resetClient(client: Client): void {
		client = new Client();
		this.formsControl.forEach((form: FormControl) => form.setValue(null));
		this.removePhoto();
	}

	addTrainer(trainer: Trainer): void {
		console.info('Adding new trainer: ', trainer);
	}

	resetTrainer(trainer: Trainer): void {
		trainer = {
			id: null,
			displayName: null,
			type: EmployeeType.Trainer,
			shifts: [],
			trainees: [],
		};
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
