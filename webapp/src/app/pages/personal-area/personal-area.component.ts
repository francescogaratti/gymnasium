import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { DigitalWorkout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';

@Component({
	selector: 'app-personal-area',
	templateUrl: './personal-area.component.html',
	styleUrls: ['./personal-area.component.sass'],
})
export class PersonalAreaComponent implements OnInit {
	user: User = null;
	workouts: DigitalWorkout[] = [];
	selectedWorkout: DigitalWorkout = null;
	constructor(private auth: AuthService, private userService: UserService) {}

	ngOnInit(): void {
		this.userService.readUser(this.auth.getUser().uid).then(user => {
			this.user = user;
		});
	}

	getUserWorkouts() {
		this.auth
			.readUserWorkouts(this.user)
			.then((workouts: DigitalWorkout[]) => (this.workouts = workouts))
			.catch(err => console.error(err));
	}
}
