import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from '@models/user';
import { DigitalWorkout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { ClientService } from '@services/client.service';

@Component({
	selector: 'app-train',
	templateUrl: './train.component.html',
	styleUrls: ['./train.component.sass'],
})
export class TrainComponent implements OnInit {
	id: string = null;
	client: Client = null;
	workouts: DigitalWorkout[] = [];
	selectedWorkout: DigitalWorkout = null;
	constructor(
		private activatedRoute: ActivatedRoute,
		private clientService: ClientService,
		private auth: AuthService
	) {
		this.id = this.activatedRoute.snapshot.queryParams['id'];
	}

	ngOnInit(): void {
		this.clientService.readClient(this.auth.getUser().uid).then(client => {
			this.client = client;
			this.getClientWorkouts();
		});
	}

	getClientWorkouts() {
		this.auth
			.readClientWorkouts(this.client)
			.then((workouts: DigitalWorkout[]) => {
				this.workouts = workouts;
				this.selectedWorkout = this.workouts.find(workout => workout.id == this.id);
			})
			.catch(err => console.error(err));
	}
}
