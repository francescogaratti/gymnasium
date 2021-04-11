import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@models/user';
// import { User } from '@models/user';
import { DigitalWorkout, StandardWorkout, Workout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.sass'],
})
export class UserComponent implements OnInit {
	id: string;
	user: User = null;
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
		private auth: AuthService,
		private utils: UtilsService,
		private userService: UserService
	) {
		this.id = this.activatedRoute.snapshot.queryParams['id'];
		this.userService.user$.subscribe((user: User) => {
			this.user = user;
			this.getImage(this.user.photoURL);
		});
	}

	ngOnInit(): void {
		if (this.id) this.userService.readUser(this.id);
	}

	getUserWorkoutsOld() {
		this.auth
			.readUserWorkoutsOld(this.user)
			.then((workoutsOld: StandardWorkout[]) => (this.workoutsOld = workoutsOld))
			.catch(err => console.error(err));
	}

	getUserWorkouts() {
		this.auth
			.readUserWorkouts(this.user)
			.then((workouts: DigitalWorkout[]) => {
				this.workouts = workouts;
				if (!this.workouts || this.workouts.length == 0)
					this.utils.openSnackBar(
						'Non sono presenti schede di allenamento per te 😓',
						'Contatta un istruttore 👆'
					);
			})
			.catch(err => console.error(err));
	}

	deleteWorkout(workout: DigitalWorkout) {
		this.auth
			.deleteWorkout(workout, this.user)
			.then((value: boolean) => {
				if (value) {
					this.utils.openSnackBar(
						"L'allenamento è stato eliminato correttamente",
						'💪😉'
					);
					this.getUserWorkouts();
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
			.catch(() => (this.URL = this.user.photoURL));
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
