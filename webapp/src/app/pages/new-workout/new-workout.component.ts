import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Exercise } from '@models/exercise';
import {
	DigitalWorkout,
	WorkoutSession,
	standard,
	starterUomo,
	starterDonna,
} from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { MatAccordion } from '@angular/material/expansion';
import { User } from '@models/user';
import { UserService } from '@services/user.service';

@Component({
	selector: 'app-new-workout',
	templateUrl: './new-workout.component.html',
	styleUrls: ['./new-workout.component.sass'],
	encapsulation: ViewEncapsulation.None,
})
export class NewWorkoutComponent implements OnInit {
	before_changes_exercise: Exercise;
	workout_sessions: WorkoutSession[] = [];

	templateWorkoutFormControl: FormControl = new FormControl('', [Validators.required]);
	sessionFormControl: FormControl = new FormControl('', [Validators.required]);
	nameFormControl: FormControl = new FormControl('', [Validators.required]);
	startingDateFormControl: FormControl = new FormControl('', [Validators.required]);
	endingDateFormControl: FormControl = new FormControl('', [Validators.required]);
	esercizioFormControl: FormControl = new FormControl('', [Validators.required]);
	setsFormControl: FormControl = new FormControl('', [Validators.required]);
	repsFormControl: FormControl = new FormControl('', [Validators.required]);
	restMinFormControl: FormControl = new FormControl('', [Validators.required]);
	restSecFormControl: FormControl = new FormControl('', [Validators.required]);
	notesFormControl: FormControl = new FormControl('', []);

	excelFormControl: FormControl = new FormControl('', [Validators.required]);

	users: User[] = [];
	userCtrl = new FormControl();
	selected_user: User = null;
	URL: string = null;

	templates: DigitalWorkout[] = [standard, starterUomo, starterDonna];
	selected_template: DigitalWorkout = null;

	my_input: HTMLInputElement = null;

	filteredUsers: Observable<User[]>;

	formsControl: FormControl[] = [
		this.esercizioFormControl,
		this.setsFormControl,
		this.repsFormControl,
		this.restMinFormControl,
		this.restSecFormControl,
		this.notesFormControl,
	];

	@ViewChild(MatAccordion) accordion: MatAccordion;

	constructor(
		private auth: AuthService,
		private utils: UtilsService,
		public router: Router,
		private userService: UserService
	) {
		this.filteredUsers = this.userCtrl.valueChanges.pipe(
			startWith(''),
			map(name => (name ? this._filterUsersByName(name) : this.users.slice()))
		);
		// this.userService.users$.subscribe((users: User[]) => (this.users = users));
	}

	private _filterUsersByName(name: string): User[] {
		return this.users.filter(
			(c: User) => c.displayName.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) !== -1
		);
	}

	changeUser(): void {
		this.selected_user = null;
		this.userCtrl.setValue(null);
	}

	ngOnInit(): void {
		this.refreshInput();
		this.userService.readUsers().then(users => (this.users = users));
	}

	addExercise(ws: WorkoutSession) {
		let new_exercise: Exercise = {
			id: null,
			name: this.esercizioFormControl.value,
			reps: this.repsFormControl.value,
			sets: this.setsFormControl.value,
			rest: {
				minutes: this.restMinFormControl.value,
				seconds: this.restSecFormControl.value,
			},
			notes: this.notesFormControl.value,
		};
		ws.exercises.push(new_exercise);
		this.cleanForm();
	}

	addWorkoutSession() {
		let new_workout_session: WorkoutSession = {
			name: this.sessionFormControl.value,
			exercises: [],
			notes: null,
			history: null,
		};
		this.workout_sessions.push(new_workout_session);
		this.cleanForm();
		this.sessionFormControl.setValue('');
	}

	selectTemplateWorkout(template: DigitalWorkout) {
		this.selected_template = template;
		this.workout_sessions = template.sessions;
	}

	changeTemplate() {
		this.workout_sessions = [];
		this.selected_template = null;
		this.templateWorkoutFormControl.setValue(null);
	}

	cleanForm() {
		this.formsControl.forEach((f: FormControl) => f.setValue(null));
	}

	createWorkout() {
		console.info('Create Workout');
		console.info('\tUser:', this.selected_user.displayName);
		console.info('\tTrainer:', this.auth.user.displayName);
		console.info('\tWorkout Name:', this.nameFormControl.value);
		console.info('\tSessions');
		console.table(this.workout_sessions);
		let workout: DigitalWorkout = {
			id: null,
			name: this.nameFormControl.value,
			creationDate: new Date().toUTCString(),
			userId: this.selected_user.uid,
			userName: this.selected_user.displayName,
			trainerId: this.auth.user.uid,
			trainerName: this.auth.user.displayName,
			startingDate: new Date(this.startingDateFormControl.value).toUTCString(),
			endingDate: new Date(this.endingDateFormControl.value).toUTCString(),
			sessions: this.workout_sessions,
		};
		console.info({ workout });

		this.auth
			.newWorkout(workout, this.selected_user)
			.then((value: boolean) => {
				if (value)
					this.utils.openSnackBar("L'allenamento è stato salvato correttamente", '💪😉');
				else
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

	resetExercises() {
		this.workout_sessions = [];
		this.cleanForm();
	}

	removeExercise(exercise: Exercise, ws: WorkoutSession) {
		ws.exercises = ws.exercises.filter((e: Exercise) => e.id !== exercise.id);
	}

	editExercise(exercise: Exercise) {
		this.before_changes_exercise = JSON.parse(JSON.stringify(exercise));
		exercise['edit'] = true;
	}

	saveChanges(exercise: Exercise) {
		this.before_changes_exercise = null;
		exercise['edit'] = false;
	}

	cancelChanges(exercise: Exercise) {
		exercise['edit'] = false;
		exercise = this.before_changes_exercise;
	}

	selectedValueChange(user: User) {
		this.selected_user = user;
		this.URL = null;
		this.auth
			.getFile(user.photoURL)
			.then(url => (url ? (this.URL = url) : ''))
			.catch(() => (this.URL = this.selected_user.photoURL));
	}

	detailUser(user: User) {
		this.router.navigateByUrl('user?id=' + user.uid);
	}

	uploadWorkout() {
		this.my_input.click();
	}

	getFiles() {
		if (this.my_input.files[0])
			this.excelFormControl.setValue(String(this.my_input.files[0].name));
	}

	refreshInput() {
		if (this.my_input) this.my_input.remove();
		this.my_input = document.createElement('input');
		this.my_input.setAttribute('type', 'file');
		this.my_input.onchange = () => this.getFiles();
	}
}
