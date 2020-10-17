import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from '@models/client';
import { Workout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

@Component({
	selector: 'app-workout',
	templateUrl: './workout.component.html',
	styleUrls: ['./workout.component.sass'],
})
export class WorkoutComponent implements OnInit {
	id: string;
	workout: Workout = null;
	client: Client = null;
	constructor(
		private activatedRoute: ActivatedRoute,
		private auth: AuthService,
		private utils: UtilsService
	) {
		this.id = this.activatedRoute.snapshot.queryParams['id'];
	}

	ngOnInit(): void {
		if (this.id) this.getWorkout(this.id);
	}

	getWorkout(id: string) {
		this.auth
			.getWorkout(id)
			.then((workout: Workout) => {
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
}
