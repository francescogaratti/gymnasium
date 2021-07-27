import {
	Component,
	OnInit,
	AfterViewInit,
	ViewChild,
	ViewEncapsulation,
	Input,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Exercise, mock } from '@models/exercise';
import { Workout, WorkoutSession, standard, starterUomo, starterDonna } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

import { Observable } from 'rxjs';

import { MatAccordion } from '@angular/material/expansion';
import { User } from '@models/user';
import { ThrowStmt } from '@angular/compiler';

let exsDatabase: Exercise[] = null;

//let exercises: Exercise[] = [];
//vedi weight tracker a riga 71 per prendere dati da database

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

	URL: string = null;

	templates: Workout[] = [standard, starterUomo, starterDonna];
	selected_template: Workout = null;

	esercizi: Exercise[] = [];

	selected_exercise: Exercise = null;

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

	constructor(private auth: AuthService, private utils: UtilsService, public router: Router) {}

	ngOnInit(): void {
		this.refreshInput();
		this.auth.getExercises().then(exercises => {
			this.esercizi = exercises;
		});
		console.info(this.auth.allExercises);
		//this.awaitExs();
		console.info(this.esercizi);
	}

	ngAfterViewInit(): void {}

	addExercise(ws: WorkoutSession) {
		let new_exercise: Exercise = {
			id: this.selected_exercise.id,
			name: this.selected_exercise.name,
			reps: this.repsFormControl.value,
			type: null, // todo: fix this
			time: null, // todo: fix this
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
			records: null,
		};
		this.workout_sessions.push(new_workout_session);
		this.cleanForm();
		this.sessionFormControl.setValue('');
	}

	selectTemplateWorkout(template: Workout) {
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
		console.info('\tUser:', this.auth.user.displayName);
		console.info('\tWorkout Name:', this.nameFormControl.value);
		console.info('\tSessions');
		console.table(this.workout_sessions);
		let workout: Workout = {
			id: null,
			name: this.nameFormControl.value,
			creationDate: new Date().toUTCString(),
			userId: this.auth.user.uid,
			userName: this.auth.user.displayName,
			startingDate: new Date(this.startingDateFormControl.value).toUTCString(),
			endingDate: new Date(this.endingDateFormControl.value).toUTCString(),
			sessions: this.workout_sessions,
		};
		console.info({ workout });

		this.auth
			.newWorkout(workout, this.auth.user)
			.then((id: string) => {
				if (id) {
					this.utils.openSnackBar("L'allenamento è stato salvato correttamente", '💪😉');
					this.router.navigateByUrl('train?id=' + id);
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

	uploadWorkout() {
		this.my_input.click();
	}

	selectExercise(exercise: Exercise) {
		this.selected_exercise = exercise;
		//this.workout_sessions = template.sessions;
	}

	changeExercise() {
		this.workout_sessions = [];
		this.selected_exercise = null;
		this.esercizioFormControl.setValue(null);
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

	// async awaitExs() {
	// 	this.esercizi = await this.auth.getExercises().then();
	// }
}
