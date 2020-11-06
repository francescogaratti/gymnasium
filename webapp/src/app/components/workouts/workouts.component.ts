import { Component, Input, OnInit } from '@angular/core';
import { DigitalWorkout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

@Component({
	selector: 'app-workouts',
	templateUrl: './workouts.component.html',
	styleUrls: ['./workouts.component.sass'],
})
export class WorkoutsComponent implements OnInit {
	@Input() workouts: DigitalWorkout[] = [];

	selectedWorkout: DigitalWorkout = null;
	columnsWorkouts: string[] = [
		'name',
		'trainer',
		'startingDate',
		'endingDate',
		'delete',
		'detail',
		'export',
	];

	constructor(private auth: AuthService, private utils: UtilsService) {}

	ngOnInit(): void {}

	deleteWorkout(workout: DigitalWorkout) {
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

	selectWorkout(workout: DigitalWorkout) {
		this.selectedWorkout = workout;
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
