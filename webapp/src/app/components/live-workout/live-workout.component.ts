import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Workout, WorkoutSession, WorkoutStates, SessionRecord } from '@models/workout';
import { Exercise, ExerciseRecord, Rest } from '@models/exercise';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '@components/dialog-info/dialog-info.component';
import { MatStepper } from '@angular/material/stepper';

@Component({
	selector: 'app-live-workout',
	templateUrl: './live-workout.component.html',
	styleUrls: ['./live-workout.component.sass'],
})
export class LiveWorkoutComponent implements OnInit {
	id: string;
	states = WorkoutStates;
	chosen_session: string = null;
	exercises_records: ExerciseRecord[] = [];
	time: number = 0;
	time_formatted: string = '00:00:00';
	timer = null;
	@Input() workout: Workout = null;
	resting: boolean = false;
	exercise_rest: number = 0;
	exercise_timer = null;
	constructor(
		private activatedRoute: ActivatedRoute,
		private auth: AuthService,
		private utils: UtilsService,
		public dialog: MatDialog
	) {
		this.id = this.activatedRoute.snapshot.queryParams['id'];
	}

	ngOnInit(): void {}

	downloadExcel(workout: Workout) {
		const filename: string = workout.name + '.xlsx';
		this.auth
			.generateExcel(filename, workout.id)
			.then((value: boolean) => {
				if (value) this.utils.openSnackBar('Conversione in file Excel riuscita!', '📝📝');
				else
					this.utils.openSnackBar(
						"Si è verificato un errore durante la conversione dell'allenamento",
						'Riprovare, per favore 🙏'
					);
			})
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
			});
	}

	openInfoNotes(exercise: Exercise) {
		this.dialog.open(DialogInfoComponent, {
			width: '300px',
			data: { title: exercise.name, messages: ['Note: ' + exercise.notes] },
		});
	}

	start(session: WorkoutSession) {
		this.workout.state = WorkoutStates.started;
		if (!this.chosen_session) {
			this.chosen_session = session.name;
			this.exercises_records = [];
			session.exercises.forEach((exercise: Exercise) =>
				this.exercises_records.push(new ExerciseRecord(exercise))
			);
		}
		this.timer = setInterval(() => {
			this.time += 1;
			let hours = Math.floor(this.time / 3600);
			let minutes = Math.floor(this.time / 60 - hours * 60);
			let seconds = this.time - hours * 3600 - minutes * 60;
			this.time_formatted =
				(hours < 10 ? '0' + hours : hours) +
				':' +
				(minutes < 10 ? '0' + minutes : minutes) +
				':' +
				(seconds < 10 ? '0' + seconds : seconds);
		}, 1000);
	}

	pause() {
		this.workout.state = WorkoutStates.paused;
		clearInterval(this.timer);
	}

	stop() {
		this.workout.state = WorkoutStates.stopped;
		clearInterval(this.timer);

		let hours = Math.floor(this.time / 3600);
		let minutes = Math.floor(this.time / 60 - hours * 60);
		let seconds = this.time - hours * 3600 - minutes * 60;

		let sessionIndex = this.workout.sessions.findIndex(
			session => session.name == this.chosen_session
		);
		// todo: use new SessionRecord(session)
		let record: SessionRecord = {
			date: new Date().toLocaleDateString(),
			length: this.time,
			notes: null,
			exercises: JSON.parse(JSON.stringify(this.exercises_records)),
		};

		if (!this.workout.sessions[sessionIndex].records)
			this.workout.sessions[sessionIndex].records = [];
		this.workout.sessions[sessionIndex].records.push(record);
		console.info(this.workout);

		// clean the chosen session
		this.chosen_session = null;

		this.utils.openSnackBar(
			'You completed the workout in ' +
				(hours ? hours + 'h ' : '') +
				(minutes ? minutes + 'min ' : '') +
				seconds +
				's',
			'Good job!💪'
		);

		this.save(this.workout);

		this.time = 0;
	}

	save(workout: Workout) {
		this.auth
			.updateWorkout(workout)
			.then((value: boolean) => {
				if (value) this.utils.openSnackBar('Workout Session Saved!', '💪');
				else
					this.utils.openSnackBar(
						'There was an error during the saving of the workout session',
						'Please, try again 🙏'
					);
			})
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar('Ops! Something went wrong!', '💀💀💀');
			});
	}

	insertSet(input: HTMLInputElement, exercise: ExerciseRecord, stepper: MatStepper) {
		exercise.weights.push(parseFloat(input.value));
		exercise.currentSet += 1;
		input.value = null;
		if (exercise.currentSet == exercise.sets) stepper.next();
		else {
			this.resting = true;
			this.startRest(exercise.rest);
		}
	}

	startRest(rest: Rest) {
		this.exercise_rest = 0;
		let total_rest: number = rest.minutes * 60 + rest.seconds;
		this.exercise_timer = setInterval(() => {
			if (this.exercise_rest < 100) this.exercise_rest += (1 / total_rest) * 100;
			else this.stopRest();
		}, 1000);
	}

	stopRest() {
		clearInterval(this.exercise_timer);
		this.resting = false;
	}

	showStats() {}
}
