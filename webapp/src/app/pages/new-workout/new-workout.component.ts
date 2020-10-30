import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { Client } from '@models/client';
import { Exercise } from '@models/exercise';
import { DigitalWorkout, WorkoutSession, mock as digital_workout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { MatAccordion } from '@angular/material/expansion';
import { Client } from '@models/user';

@Component({
	selector: 'app-new-workout',
	templateUrl: './new-workout.component.html',
	styleUrls: ['./new-workout.component.sass'],
	encapsulation: ViewEncapsulation.None,
})
export class NewWorkoutComponent implements OnInit {
	before_changes_exercise: Exercise;
	workout_sessions: WorkoutSession[] = digital_workout.sessions;

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

	clients: Client[] = [];
	clientCtrl = new FormControl();
	selected_client: Client = null;
	URL: string = null;

	my_input: HTMLInputElement = null;

	filteredClients: Observable<Client[]>;

	formsControl: FormControl[] = [
		this.esercizioFormControl,
		this.setsFormControl,
		this.repsFormControl,
		this.restMinFormControl,
		this.restSecFormControl,
		this.notesFormControl,
	];

	@ViewChild(MatAccordion) accordion: MatAccordion;

	constructor(private auth: AuthService, private utils: UtilsService, public router: Router) {
		this.filteredClients = this.clientCtrl.valueChanges.pipe(
			startWith(''),
			map(name => (name ? this._filterClientsByName(name) : this.clients.slice()))
		);
		this.auth.clients$.subscribe((clients: Client[]) => (this.clients = clients));
	}

	private _filterClientsByName(name: string): Client[] {
		return this.clients.filter(
			(c: Client) =>
				c.displayName.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) !== -1
		);
	}

	changeClient(): void {
		this.selected_client = null;
		this.clientCtrl.setValue(null);
	}

	ngOnInit(): void {
		this.refreshInput();
		this.auth.readClients();
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
		};
		this.workout_sessions.push(new_workout_session);
		this.cleanForm();
		this.sessionFormControl.setValue('');
	}

	cleanForm() {
		this.formsControl.forEach((f: FormControl) => f.setValue(null));
	}

	createWorkout() {
		console.info('Create Workout');
		console.info('\tClient:', this.selected_client.displayName);
		console.info('\tTrainer:', this.auth.user.displayName);
		console.info('\tWorkout Name:', this.nameFormControl.value);
		console.info('\tSessions');
		console.table(this.workout_sessions);
		let workout: DigitalWorkout = {
			id: null,
			name: this.nameFormControl.value,
			clientId: this.selected_client.uid,
			clientName: this.selected_client.displayName,
			trainerId: this.auth.user.uid,
			trainerName: this.auth.user.displayName,
			startingDate: new Date(this.startingDateFormControl.value).toUTCString(),
			endingDate: new Date(this.endingDateFormControl.value).toUTCString(),
			sessions: this.workout_sessions,
		};
		console.info({ workout });

		this.auth
			.newWorkout(workout, this.selected_client)
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

	selectedValueChange(client: Client) {
		this.selected_client = client;
		this.URL = null;
		this.auth
			.getFile(client.photoURL)
			.then(url => (url ? (this.URL = url) : ''))
			.catch(() => (this.URL = this.selected_client.photoURL));
	}

	detailClient(client: Client) {
		this.router.navigateByUrl('client?id=' + client.uid);
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
