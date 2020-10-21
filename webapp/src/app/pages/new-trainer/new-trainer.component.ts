import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
	AbstractControl,
	Form,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '@models/client';
import { EmployeeType } from '@models/employee';
import { Trainer } from '@models/trainer';
import { AuthService } from '@services/auth.service';
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
	indirizzo2FormControl: FormControl = new FormControl('', []);
	provinciaFormControl: FormControl = new FormControl('', [Validators.required]);
	cittaFormControl: FormControl = new FormControl('', [Validators.required]);

	formsControl: FormControl[] = [
		this.nomeFormControl,
		this.cognomeFormControl,
		this.codicePostaleFormControl,
		this.codiceFiscaleFormControl,
		this.photoFormControl,
		this.indirizzoFormControl,
		this.indirizzo2FormControl,
		this.provinciaFormControl,
		this.cittaFormControl,
	];
	my_input: HTMLInputElement = null;
	constructor(private auth: AuthService, private utils: UtilsService, public router: Router) {}

	ngOnInit(): void {
		this.my_input = document.createElement('input');
		this.my_input.onchange = () => this.getFiles();
		this.resetClient(this.client);
		this.resetTrainer(this.trainer);
	}

	addClient(client: Client): void {
		client = {
			id: String(Math.round(Math.random() * 1000000)),
			displayName: this.nomeFormControl.value + ' ' + this.cognomeFormControl.value,
			fiscalCode: this.codiceFiscaleFormControl.value,
			photoUrl: this.photoFormControl.value,
			address: this.indirizzoFormControl.value,
			address2: this.indirizzo2FormControl.value,
			city: this.cittaFormControl.value,
			postalCode: this.codicePostaleFormControl.value,
		};
		console.info('Adding new client: ', client);
		this.auth.newClient(client).then((value: boolean) => {
			if (value) {
				this.utils.openSnackBar(
					'Il cliente ' + client.displayName + ' è stato aggiunto con successo',
					'😉'
				);
				this.resetClient(client);
			} else
				this.utils.openSnackBar(
					'Attenzione, si è verificato un errore nel salvataggio del nuovo utente',
					'Riprovare'
				);
		});
		this.auth.uploadImage(this.my_input.files[0]);
	}

	resetClient(client: Client): void {
		client = new Client();
		this.formsControl.forEach((form: FormControl) => form.setValue(null));
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
		console.table(this.my_input.files);
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
	}
}
