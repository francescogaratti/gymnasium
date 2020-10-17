import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
	constructor(
		private activatedRoute: ActivatedRoute,
		private auth: AuthService,
		private utils: UtilsService
	) {
		this.id = this.activatedRoute.snapshot.queryParams['id'];
	}

	ngOnInit(): void {
		if (this.id)
			this.auth
				.getWorkout(this.id)
				.then((workout: Workout) => (this.workout = workout))
				.catch(err => {
					console.error(err);
					this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
				});
	}
}
