import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { History, LiveWorkout, WorkoutSession, WorkoutStates } from '@models/workout';
import { Exercise, LiveExercise } from '@models/exercise';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '@components/dialog-info/dialog-info.component';

@Component({
	selector: 'app-live-workout',
	templateUrl: './live-workout.component.html',
	styleUrls: ['./live-workout.component.sass'],
})
export class LiveWorkoutComponent implements OnInit {
	id: string;
	states = WorkoutStates;
	chosen_session: string = null;
	live_exercises: LiveExercise[] = [];
	time: number = 0;
	timer = null;
	@Input() workout: LiveWorkout = null;
	constructor(
		private activatedRoute: ActivatedRoute,
		private auth: AuthService,
		private utils: UtilsService,
		public dialog: MatDialog
	) {
		this.id = this.activatedRoute.snapshot.queryParams['id'];
	}

	ngOnInit(): void {}

	downloadExcel(workout: LiveWorkout) {
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
		// const dialogRef =
		this.dialog.open(DialogInfoComponent, {
			width: '300px',
			data: { title: exercise.name, messages: ['Note: ' + exercise.notes] },
		});
		// dialogRef.afterClosed().subscribe(result => {
		// 	console.log('The dialog was closed');
		// });
	}

	start(session: WorkoutSession) {
		this.workout.state = WorkoutStates.started;
		this.chosen_session = session.name;
		this.live_exercises = JSON.parse(JSON.stringify(session.exercises));
		this.timer = setInterval(() => (this.time += 1), 1000);
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
		let history: History = {
			date: new Date().toLocaleDateString(),
			length: this.time,
			notes: null,
			exercises: this.live_exercises,
		};

		if (!this.workout.sessions[sessionIndex].history)
			this.workout.sessions[sessionIndex].history = [];
		this.workout.sessions[sessionIndex].history.push(history);
		console.info(this.workout);

		// clean the chosen session
		this.chosen_session = null;

		// here I can save the history of the workout

		this.utils.openSnackBar(
			'You completed the workout in ' +
				(hours ? hours + 'h ' : '') +
				(minutes ? minutes + 'min ' : '') +
				seconds +
				's',
			'Good job!💪'
		);
		this.time = 0;
	}
}