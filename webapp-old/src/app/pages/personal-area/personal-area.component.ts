import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@models/user';
import { Workout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';

@Component({
	selector: 'app-personal-area',
	templateUrl: './personal-area.component.html',
	styleUrls: ['./personal-area.component.sass'],
})
export class PersonalAreaComponent implements OnInit {
	user: User = null;
	workouts: Workout[] = [];
	selectedWorkout: Workout = null;
	constructor(
		private auth: AuthService,
		private userService: UserService,
		public router: Router
	) {}

	ngOnInit(): void {
		this.userService.readUser(this.auth.getUser().uid).then(user => {
			this.user = user;
		});
	}
}
