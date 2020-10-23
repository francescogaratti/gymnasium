import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from '@models/client';
import { DigitalWorkout, Workout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';
@Component({
	selector: 'app-workout',
	templateUrl: './workout.component.html',
	styleUrls: ['./workout.component.sass'],
})
export class WorkoutComponent implements OnInit {
	id: string;
	@Input() workout: DigitalWorkout = null;
	@Input() client: Client = null;
	constructor(
		private activatedRoute: ActivatedRoute,
		private auth: AuthService,
		private utils: UtilsService
	) {
		this.id = this.activatedRoute.snapshot.queryParams['id'];
	}

	ngOnInit(): void {
		// if (!this.workout && this.id) this.getWorkout(this.id);
	}

	getWorkout(id: string) {
		this.auth
			.getWorkout(id)
			.then((workout: DigitalWorkout) => {
				this.workout = workout;
				this.getClient(this.workout.clientId);
			})
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
			});
	}

	getClient(id: string) {
		this.auth
			.readClient(id)
			.then((client: Client) => (this.client = client))
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
			});
	}

	// generateExcel() {
	// 	const filename: string = this.workout.name + '.xlsx';
	// 	this.auth
	// 		.generateExcel(filename, this.workout.id)
	// 		.then((value: boolean) => {
	// 			if (value) this.utils.openSnackBar('Conversione in file Excel riuscita!', '📝📝');
	// 			else
	// 				this.utils.openSnackBar(
	// 					"Si è verificato un errore durante la conversione dell'allenamento",
	// 					'Riprovare, per favore 🙏'
	// 				);
	// 		})
	// 		.catch(err => {
	// 			console.error(err);
	// 			this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
	// 		});
	// }
}
