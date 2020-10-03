import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators,
	FormControl,
	AbstractControl,
	ValidatorFn,
} from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
// import { Emotion } from '@models/emotion/';
// import { Record } from '@models/record/';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { AuthService } from '@services/auth.service';
import { Workout } from '@models/workout';
// import { UtilsService } from '@services/utils.service';
// import { Settings } from '@models/settings';

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const forbidden = nameRe.test(control.value);
		return forbidden ? { forbiddenName: { value: control.value } } : null;
	};
}

function checkDate(utc: string, incomplete: Date): boolean {
	let date = new Date(utc).toLocaleDateString();
	return date == incomplete.toLocaleDateString();
}

@Component({
	selector: 'app-create-workout-routine',
	templateUrl: './create-workout-routine.component.html',
	styleUrls: ['./create-workout-routine.component.sass'],
	encapsulation: ViewEncapsulation.None,
})
export class CreateWorkoutRoutineComponent implements OnInit {
	// records: Record[] = [];
	// emotions: Emotion[];
	minDate: Date;
	maxDate: Date;
	startingDate: Date;
	recordFormGroup: FormGroup;
	percentage: number;
	// dateClass: Function = (d: Date): MatCalendarCellCssClasses => {
	// let record = this.records.find((record: Record) => {
	// 	return checkDate(record.date, d);
	// });
	// let classes: string = '';
	// if (checkDate(this.startingDate.toUTCString(), d)) classes += 'startingDate ';
	// if (record) classes += record.emotion.text;
	// return classes;
	// };
	@ViewChild('stepper') stepper: MatHorizontalStepper;
	constructor(private fb: FormBuilder, public auth: AuthService) {
		this.maxDate = new Date();
		// this.emotions = this.utils.getEmotions();
	}

	ngOnInit(): void {
		// this.auth.records$.subscribe((records: Record[]) => {
		// 	this.records = records;
		// 	this.startingDate = new Date(this.auth.getUserInfo().metadata.creationTime);
		// 	this.auth
		// 		.readUserSettings()
		// 		.then((settings: Settings) => (this.emotions = settings.customEmotions));
		// });
		this.recordFormGroup = this.fb.group({
			date: [null, [Validators.required]],
			// emotion: [null, [Validators.required]],
			notes: null,
		});
		this.recordFormGroup.valueChanges.subscribe((w: Workout) => {
			this.percentage = 0;
			if (w) this.percentage += 33;
			if (w) this.percentage += 34;
			if (w) this.percentage += 33;
		});
		// let testRecord: Record = {
		// 	date: 'Thu, 16 Apr 2020 22:00:00 GMT',
		// 	emotion: { text: 'happy', emoji: '😄', color: '#95fc95' },
		// 	notes: 'weila',
		// };
		// this.findDate(testRecord);
	}
	get date() {
		return this.recordFormGroup.get('date');
	}
	// get emotion() {
	// 	return this.recordFormGroup.get('emotion');
	// }
	get notes() {
		return this.recordFormGroup.get('notes');
	}

	/**
	 * @description ricerca se la data che si è scelta è già parte di un record
	 * e in quel caso carica le informazioni precedenti, per sovrascriverle
	 * @param record record in inserimento
	 */
	// findDate(record: Record) {
	// 	console.info('findDate');
	// 	if (!record || !record.date) return;
	// 	record.date = new Date(record.date).toUTCString();
	// 	let x: Record = this.records.find((r: Record) => r.date === record.date);
	// 	if (x) {
	// 		// console.info('found', x);
	// 		// found
	// 		this.recordFormGroup.setValue(
	// 			{ date: x.date, emotion: x.emotion, notes: x.notes },
	// 			{ emitEvent: false }
	// 		);
	// 		console.info(this.recordFormGroup);
	// 	}
	// }

	/**
	 * @description inserisce il nuovo record nel database
	 */
	newRecord() {
		// let record: Record = this.recordFormGroup.value;
		// record.date = new Date(record.date).toUTCString();
		// this.auth
		// 	.newRecord(record) // TODO cambiare la variabile mocked con un valore contenuto nel AuthService senza bisogno di passarlo dal component
		// 	.then((res: boolean) => {
		// 		if (res) {
		// 			this.records.push(record); // mi salvo la copia locale
		// 			this.auth.records$.next(this.records); // invio l'aggiornamento alle altre componenti
		// 			this.utils.openSnackBar('New record inserted', 'Keep going 💪😉');
		// 			this.recordFormGroup.reset(); // reset del form di inserimento
		// 			this.stepper.reset();
		// 		} else
		// 			this.utils.openSnackBar(
		// 				'Error while inserting new Record',
		// 				'Please try again 🙏'
		// 			);
		// 	})
		// 	.catch(err => {
		// 		console.error(err);
		// 		this.utils.openSnackBar('Something went wrong', '💀💀💀');
		// 	});
	}
}
