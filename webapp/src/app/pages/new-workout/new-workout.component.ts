import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client, mocks as clients } from '@models/client';
import { Exercise, mock as exercises } from '@models/exercise';
import { Workout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-new-workout',
	templateUrl: './new-workout.component.html',
	styleUrls: ['./new-workout.component.sass'],
	encapsulation: ViewEncapsulation.None,
})
export class NewWorkoutComponent implements OnInit {
	new_exercise: Exercise;
	before_changes_exercise: Exercise;
	exercises: Exercise[] = exercises; // todo: remove mock

	esercizioFormControl: FormControl = new FormControl('', [Validators.required]);
	setsFormControl: FormControl = new FormControl('', [Validators.required]);
	repsFormControl: FormControl = new FormControl('', [Validators.required]);
	restMinFormControl: FormControl = new FormControl('', [Validators.required]);
	restSecFormControl: FormControl = new FormControl('', [Validators.required]);
	notesFormControl: FormControl = new FormControl('', []);

	clients: Client[] = [];
	clientCtrl = new FormControl();
	selected_client: Client = null;
	filteredClients: Observable<Client[]>;

	formsControl: FormControl[] = [
		this.esercizioFormControl,
		this.setsFormControl,
		this.repsFormControl,
		this.restMinFormControl,
		this.restSecFormControl,
		this.notesFormControl,
	];
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
		this.auth.readClients();
	}

	addExercise() {
		this.new_exercise = {
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
		this.exercises.push(this.new_exercise);
		this.cleanForm();
	}

	cleanForm() {
		this.formsControl.forEach((f: FormControl) => f.setValue(null));
	}

	createWorkout() {
		console.info('Create Workout');
		console.info('\tClient:', this.selected_client.displayName);
		console.info('\tTrainer:', this.auth.user.displayName);
		console.info('\tExercises');
		console.table(this.exercises);
		let workout: Workout = {
			id: null,
			clientId: this.selected_client.id,
			exercises: this.exercises,
			trainer: this.auth.user.displayName,
		};
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
		this.exercises = [];
		this.cleanForm();
	}

	removeExercise(exercise: Exercise) {
		this.exercises = this.exercises.filter((e: Exercise) => e.id !== exercise.id);
	}

	editExercise(exercise: Exercise) {
		this.before_changes_exercise = JSON.parse(JSON.stringify(exercise));
		exercise['edit'] = true;
	}

	saveChanges(exercise: Exercise) {
		this.before_changes_exercise = null;
		exercise['edit'] = false;
		console.info('save', exercise);
	}

	cancelChanges(exercise: Exercise) {
		exercise['edit'] = false;
		exercise = this.before_changes_exercise;
		console.info('cancel', exercise);
	}

	selectedValueChange(client: Client) {
		this.selected_client = client;
	}

	detailClient(client: Client) {
		this.router.navigateByUrl('client?id=' + client.id);
	}
}