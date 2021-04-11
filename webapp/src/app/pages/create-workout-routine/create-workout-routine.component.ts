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
import { Workout, StandardWorkout } from '@models/workout';
// import { User, mocks as users } from '@models/user';
import { UtilsService } from '@services/utils.service';
import { User } from '@models/user';
import { UserService } from '@services/user.service';
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
	// workouts: Workout[] = [];
	users: User[] = [];
	minDate: Date;
	maxDate: Date;
	workoutFormGroup: FormGroup;
	percentage: number;
	private selectedFile: File;
	@ViewChild('stepper') stepper: MatHorizontalStepper;
	constructor(
		private fb: FormBuilder,
		public auth: AuthService,
		private utils: UtilsService,
		private userService: UserService
	) {
		this.maxDate = new Date();
		this.minDate = new Date();
		this.userService.users$.subscribe((users: User[]) => (this.users = users));
	}

	ngOnInit(): void {
		// this.users = this.userService.getUsers();
		this.workoutFormGroup = this.fb.group({
			user: [null, [Validators.required]],
			startingDate: [null, [Validators.required]],
			endingDate: [null, [Validators.required]],
			attachedFile: [null, [Validators.required]],
			notes: null,
		});
	}
	get user() {
		return this.workoutFormGroup.get('user');
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

	newWorkout() {
		let workout: StandardWorkout = {
			id: null,
			name: null,
			creationDate: new Date().toUTCString(),
			userId: this.user.value,
			userName: this.user.value,
			startingDate: new Date(this.startingDate.value).toUTCString(),
			endingDate: new Date(this.endingDate.value).toUTCString(),
			filePath: this.attachedFile.value.name,
		};
		console.info({ workout });
		this.auth
			.newWorkoutOld(workout)
			.then((id: string) => {
				if (id) {
					let user: User = this.users.find((user: User) => workout.userId == user.uid);
					this.userService
						.newUserWorkout(user, workout.id)
						.then((value: boolean) => {
							if (value) {
								this.utils.openSnackBar(
									"L'allenamento è stato salvato correttamente",
									'💪😉'
								);
								this.workoutFormGroup.reset();
								this.stepper.reset();
							} else
								this.utils.openSnackBar(
									"Si è verificato un errore durante il salvataggio dell'allenamento",
									'Riprovare, per favore 🙏'
								);
						})
						.catch(err => {
							console.error(err);
							this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
						});
				} else
					this.utils.openSnackBar(
						"Si è verificato un errore durante il salvataggio dell'allenamento",
						'Riprovare, per favore 🙏'
					);
			})
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
			});
	}

	addMonths(date: Date, months: number): Date {
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
