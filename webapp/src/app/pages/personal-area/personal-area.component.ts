import { Component, OnInit } from '@angular/core';
import { Client } from '@models/user';
import { DigitalWorkout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { ClientService } from '@services/client.service';

@Component({
	selector: 'app-personal-area',
	templateUrl: './personal-area.component.html',
	styleUrls: ['./personal-area.component.sass'],
})
export class PersonalAreaComponent implements OnInit {
	client: Client = null;
	workouts: DigitalWorkout[] = [];
	selectedWorkout: DigitalWorkout = null;
	constructor(private auth: AuthService, private clientService: ClientService) {}

	ngOnInit(): void {
		this.clientService.readClient(this.auth.getUser().uid).then(client => {
			this.client = client;
		});
	}

	getClientWorkouts() {
		this.auth
			.readClientWorkouts(this.client)
			.then((workouts: DigitalWorkout[]) => (this.workouts = workouts))
			.catch(err => console.error(err));
	}
}
