import { Component, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Trainer, User, UserTypes } from '@models/user';
// import { Trainer } from '@models/trainer';
import { AuthService } from '@services/auth.service';
import { TrainerService } from '@services/trainer.service';
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
	selector: 'app-new-trainer',
	templateUrl: './new-trainer.component.html',
	styleUrls: ['./new-trainer.component.sass'],
	encapsulation: ViewEncapsulation.None,
})
export class NewTrainerComponent implements OnInit {
	trainer: Trainer = null;
	selected_user: User = null;
	// all trainers & users
	trainers: Trainer[] = [];
	users: User[] = [];
	usersNotTrainers: User[] = [];

	filteredUsers: Observable<User[]>;

	notShowTrainers: boolean = false; // flag to toggle already trainers visibility
	alreadyTrainer: boolean = false;

	/** input trainer */

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
		private trainerService: TrainerService
	) {}

	ngOnInit(): void {
		this.my_input = document.createElement('input');
		this.my_input.onchange = () => this.getFiles();

		this.resetTrainer();
		this.filteredUsers = this.userFormControl.valueChanges.pipe(
			startWith(''),
			map(name => (name ? this._filterUsersByName(name) : this.users.slice()))
		);

		this.readUsersTrainers();
	}

	async readUsersTrainers() {
		this.users = await this.auth.readUsers();
		this.trainers = await this.trainerService.readTrainers();
		this.usersNotTrainers = [];
		if (this.users && this.users.length > 0) {
			if (this.trainers && this.trainers.length > 0)
				this.users.forEach((u: User) => {
					let found = this.trainers.find((c: Trainer) => {
						// console.info(c.uid, u.uid);
						return c.uid == u.uid;
					});
					if (!found) this.usersNotTrainers.push(u);
				});
			else this.usersNotTrainers = JSON.parse(JSON.stringify(this.users));
		}
	}

	toggleNotShowTrainers() {
		this.notShowTrainers = !this.notShowTrainers;
		this.userFormControl.setValue(null);
	}

	private _filterUsersByName(name: string): User[] {
		if (this.notShowTrainers)
			return this.usersNotTrainers.filter(
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
		this.alreadyTrainer = false;
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
		// check if it's already a trainer
		let trainer = this.trainers.find((c: Trainer) => c.uid == user.uid);
		if (trainer) {
			this.alreadyTrainer = true;
			// anagraphics
			this.birthdayFormControl.setValue(new Date(trainer.birthday));
			this.sexFormControl.setValue(trainer.sex ? 'man' : 'woman');
			this.birthCountryFC.setValue(trainer.birthCountry);
			this.birthCityFC.setValue(trainer.birthCity);
			this.codiceFiscaleFormControl.setValue(trainer.fiscalCode);
			// residence
			this.stateFormControl.setValue(trainer.address.state);
			this.provinceFormControl.setValue(trainer.address.province);
			this.cityFormControl.setValue(trainer.address.city);
			this.postalCodeFormControl.setValue(trainer.address.postalCode);
			this.streetFormControl.setValue(trainer.address.street);
			this.numberFC.setValue(trainer.address.number);
			// notifications
			this.mailNotifications = trainer.notifications.mail;
			this.pushNotifications = trainer.notifications.push;
		}
	}

	addTrainer(): void {
		this.selected_user.type = UserTypes.trainer;
		this.trainer = new Trainer(this.selected_user);
		// anagraphics
		this.trainer.displayName = this.nomeFormControl.value + ' ' + this.cognomeFormControl.value;
		this.trainer.birthday = new Date(this.birthdayFormControl.value).toUTCString();
		this.trainer.sex = this.sexFormControl.value == 'man' ? true : false;
		this.trainer.birthCountry = this.birthCountryFC.value;
		this.trainer.birthCity = this.birthCityFC.value;
		this.trainer.fiscalCode = this.codiceFiscaleFormControl.value;

		// residence information
		this.trainer.address = {
			state: this.stateFormControl.value,
			province: this.provinceFormControl.value,
			city: this.cityFormControl.value,
			postalCode: this.postalCodeFormControl.value,
			street: this.streetFormControl.value,
			number: this.numberFC.value,
		};
		// notifications
		this.trainer.notifications = {
			mail: this.mailNotifications,
			push: this.pushNotifications,
		};

		this.trainer.email = this.emailFC.value;

		console.info('Adding new trainer: ', this.trainer);
		if (this.my_input.files)
			this.auth
				.uploadImageToUser(this.my_input.files[0], this.trainer.uid)
				.then(path => {
					this.trainer.photoURL = path ? path : ''; // link to new photoURL
					this.updateTrainer(this.trainer);
				})
				.catch(err => console.error('uploadImageToTrainer', err));
		else this.updateTrainer(this.trainer);
	}

	async updateTrainer(trainer: Trainer): Promise<void> {
		this.auth.updateUser(this.selected_user);
		return this.trainerService
			.updateTrainer(trainer, true)
			.then((value: boolean) => {
				if (value) {
					this.utils.openSnackBar(
						'Il trainere ' + trainer.displayName + ' è stato aggiunto con successo',
						'😉'
					);
					this.resetTrainer();
				} else
					this.utils.openSnackBar(
						'Attenzione, si è verificato un errore nel salvataggio del nuovo trainere',
						'Riprovare'
					);
			})
			.catch(err => console.error('updateTrainer', err));
	}

	resetTrainer(): void {
		this.alreadyTrainer = false;
		this.selected_user = null;
		this.trainer = new Trainer();
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
