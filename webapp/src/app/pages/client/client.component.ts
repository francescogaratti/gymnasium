import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '@models/client';
import { Workout, WorkoutOld } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

@Component({
	selector: 'app-client',
	templateUrl: './client.component.html',
	styleUrls: ['./client.component.sass'],
})
export class ClientComponent implements OnInit {
	id: string;
	client: Client = null;
	selected_workout: Workout = null;
	workoutsOld: WorkoutOld[] = [];
	workouts: Workout[] = [];
	columnsWorkoutsOld: string[] = ['startingDate', 'endingDate', 'fileId'];
	columnsWorkouts: string[] = ['name', 'trainer', 'remove', 'detail'];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private auth: AuthService,
		private utils: UtilsService
	) {
		this.id = this.activatedRoute.snapshot.queryParams['id'];
	}

	ngOnInit(): void {
		if (this.id) {
			this.auth
				.readClient(this.id)
				.then((client: Client) => (this.client = client))
				.catch(err => {
					this.utils.openSnackBar(
						'Si è verificato un errore con il caricamento dei dati del cliente',
						'Riprovare, per favore.'
					);
					console.error(err);
				});
		}
	}

	getClientWorkoutsOld() {
		this.auth
			.readClientWorkoutsOld(this.client)
			.then((workoutsOld: WorkoutOld[]) => (this.workoutsOld = workoutsOld))
			.catch(err => console.error(err));
	}

	getClientWorkouts() {
		this.auth
			.readClientWorkouts(this.client)
			.then((workouts: Workout[]) => (this.workouts = workouts))
			.catch(err => console.error(err));
	}

	deleteWorkout(workout: Workout) {
		this.auth
			.deleteWorkout(workout, this.client)
			.then((value: boolean) => {
				if (value) {
					this.utils.openSnackBar(
						"L'allenamento è stato eliminato correttamente",
						'💪😉'
					);
					this.getClientWorkouts();
				} else
					this.utils.openSnackBar(
						"Si è verificato un errore durante l'eliminazione dell'allenamento",
						'Riprovare, per favore 🙏'
					);
			})
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
			});
	}

	detailWorkout(workout: Workout) {
		this.selected_workout = workout;
		// this.router.navigateByUrl('workout?id=' + workout.id);
	}
}
