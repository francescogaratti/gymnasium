import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '@models/user';
// import { Client } from '@models/client';
import { DigitalWorkout, StandardWorkout, Workout } from '@models/workout';
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
	URL: string = null;
	selected_workout: DigitalWorkout = null;
	workoutsOld: StandardWorkout[] = [];
	workouts: DigitalWorkout[] = [];
	columnsWorkouts: string[] = [
		'name',
		'trainer',
		'startingDate',
		'endingDate',
		'delete',
		'detail',
		'export',
	];
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
				.then((client: Client) => {
					this.client = client;
					this.getImage(this.client.photoURL);
				})
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
			.then((workoutsOld: StandardWorkout[]) => (this.workoutsOld = workoutsOld))
			.catch(err => console.error(err));
	}

	getClientWorkouts() {
		this.auth
			.readClientWorkouts(this.client)
			.then((workouts: DigitalWorkout[]) => (this.workouts = workouts))
			.catch(err => console.error(err));
	}

	deleteWorkout(workout: DigitalWorkout) {
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

	detailWorkout(workout: DigitalWorkout) {
		this.selected_workout = workout;
	}

	async getImage(path: string) {
		this.auth
			.getFile(path)
			.then(url => (url ? (this.URL = url) : ''))
			.catch(() => (this.URL = this.client.photoURL));
	}

	exportExcel(workout: DigitalWorkout) {
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
}
