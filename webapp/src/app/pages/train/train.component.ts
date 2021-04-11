import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@models/user';
import { DigitalWorkout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';

@Component({
	selector: 'app-train',
	templateUrl: './train.component.html',
	styleUrls: ['./train.component.sass'],
})
export class TrainComponent implements OnInit {
	id: string = null;
	user: User = null;
	workouts: DigitalWorkout[] = [];
	selectedWorkout: DigitalWorkout = null;
	constructor(
		private activatedRoute: ActivatedRoute,
		private userService: UserService,
		private auth: AuthService
	) {
		this.id = this.activatedRoute.snapshot.queryParams['id'];
	}

	ngOnInit(): void {
		this.userService.readUser(this.auth.getUser().uid).then(user => {
			this.user = user;
			this.getUserWorkouts();
		});
	}

	getUserWorkouts() {
		this.auth
			.readUserWorkouts(this.user)
			.then((workouts: DigitalWorkout[]) => {
				this.workouts = workouts;
				this.selectedWorkout = this.workouts.find(workout => workout.id == this.id);
			})
			.catch(err => console.error(err));
	}
}
