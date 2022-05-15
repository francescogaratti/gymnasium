import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { Workout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';

@Component({
	selector: 'app-workouts',
	templateUrl: './workouts.component.html',
	styleUrls: ['./workouts.component.sass'],
})
export class WorkoutsComponent implements OnInit {
	workouts: Workout[] = [];
	user: User = null;

	columnsWorkouts: string[] = [
		'name',
		'trainer',
		'startingDate',
		// 'endingDate',
		// 'delete',
		'detail',
		// 'export',
	];

	constructor(
		private auth: AuthService,
		private utils: UtilsService,
		private userService: UserService
	) {
		this.userService.readUser(this.auth.getUser().uid).then(user => {
			this.user = user;
			if (this.workouts.length == 0) this.getUserWorkouts();
		});
	}

	ngOnInit(): void {}

	getUserWorkouts() {
		this.auth
			.readUserWorkouts(this.user)
			.then((workouts: Workout[]) => (this.workouts = workouts))
			.catch(err => console.error(err));
	}

	deleteWorkout(workout: Workout) {
		this.auth
			.deleteWorkout(workout)
			.then((value: boolean) => {
				if (value) {
					this.utils.openSnackBar(
						"L'allenamento è stato eliminato correttamente",
						'💪😉'
					);
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

	exportExcel(workout: Workout) {
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
