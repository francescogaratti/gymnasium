import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators,
	FormControl,
	AbstractControl,
	ValidatorFn,
} from '@angular/forms';
// import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { AuthService } from '@services/auth.service';
import { Workout } from '@models/workout';
import { Client, mocks as clients } from '@models/client';
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
	workouts: Workout[] = [];
	clients: Client[] = clients;
	minDate: Date;
	maxDate: Date;
	workoutFormGroup: FormGroup;
	percentage: number;
	private selectedFile: File;
	@ViewChild('stepper') stepper: MatHorizontalStepper;
	constructor(private fb: FormBuilder, public auth: AuthService) {
		this.maxDate = new Date();
		this.minDate = new Date();
	}

	ngOnInit(): void {
		// this.auth.workouts$.subscribe((workouts: workout[]) => {
		// 	this.workouts = workouts;
		// 	this.startingDate = new Date(this.auth.getUserInfo().metadata.creationTime);
		// 	this.auth
		// 		.readUserSettings()
		// 		.then((settings: Settings) => (this.emotions = settings.customEmotions));
		// });
		this.workoutFormGroup = this.fb.group({
			client: [null, [Validators.required]],
			startingDate: [null, [Validators.required]],
			endingDate: [null, [Validators.required]],
			attachedFile: [null, [Validators.required]],
			notes: null,
		});
		this.workoutFormGroup.valueChanges.subscribe((w: Workout) => {
			this.percentage = 0;
			if (w.client) this.percentage += 33;
			if (w.startingDate) this.percentage += 34;
			if (w.endingDate) this.percentage += 33;
		});
		// let testworkout: workout = {
		// 	date: 'Thu, 16 Apr 2020 22:00:00 GMT',
		// 	emotion: { text: 'happy', emoji: '😄', color: '#95fc95' },
		// 	notes: 'weila',
		// };
		// this.findDate(testworkout);
	}
	get client() {
		return this.workoutFormGroup.get('client');
	}
	get startingDate() {
		return this.workoutFormGroup.get('startingDate');
	}
	get endingDate() {
		return this.workoutFormGroup.get('endingDate');
	}
	get attachedFile() {
		return this.workoutFormGroup.get('attachedFile');
	}
	get notes() {
		return this.workoutFormGroup.get('notes');
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
	newWorkout() {
		let workout: Workout = this.workoutFormGroup.value;
		workout.startingDate = new Date(workout.startingDate).toUTCString();
		workout.endingDate = new Date(workout.endingDate).toUTCString();
		console.info({ workout });
		this.workouts.push(workout);
		console.table(this.workouts);
		this.workoutFormGroup.reset();
		this.stepper.reset();
		// this.auth
		// 	.newworkout(workout) // TODO cambiare la variabile mocked con un valore contenuto nel AuthService senza bisogno di passarlo dal component
		// 	.then((res: boolean) => {
		// 		if (res) {
		// 			this.workouts.push(workout); // mi salvo la copia locale
		// 			this.auth.workouts$.next(this.workouts); // invio l'aggiornamento alle altre componenti
		// 			this.utils.openSnackBar('New workout inserted', 'Keep going 💪😉');
		// 			this.workoutFormGroup.reset(); // reset del form di inserimento
		// 			this.stepper.reset();
		// 		} else
		// 			this.utils.openSnackBar(
		// 				'Error while inserting new workout',
		// 				'Please try again 🙏'
		// 			);
		// 	})
		// 	.catch(err => {
		// 		console.error(err);
		// 		this.utils.openSnackBar('Something went wrong', '💀💀💀');
		// 	});
	}

	addMonths(date: Date, months: number): Date {
		// console.info(date);
		let newDate: Date = new Date();
		newDate.setMonth(date.getMonth() + months);
		return newDate;
	}

	async downloadFile() {
		let file = this.selectedFile;
		let fr: FileReader = new FileReader();
		fr.readAsDataURL(file);

		var blob: Blob = new Blob([file], { type: 'application/pdf' });

		var objectURL = window.URL.createObjectURL(blob);

		if (navigator.appVersion.toString().indexOf('.NET') > 0) {
			window.navigator.msSaveOrOpenBlob(blob, this.selectedFile.name);
		} else {
			var link = document.createElement('a');
			link.href = objectURL;
			link.download = this.selectedFile.name;
			document.body.appendChild(link);
			link.click();
			link.remove();
		}
	}
	onFileSelect(event: any) {
		this.selectedFile = event.target.files[0];
		this.attachedFile.setValue(this.selectedFile);
	}
}
