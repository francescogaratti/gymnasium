import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from '@models/client';
import { WorkoutOld } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

@Component({
	selector: 'app-client',
	templateUrl: './client.component.html',
	styleUrls: ['./client.component.sass'],
})
export class ClientComponent implements OnInit {
	id: string;
	client: Client = null;
	workouts: WorkoutOld[] = [];
	displayedColumns: string[] = ['id', 'startingDate', 'endingDate', 'fileId'];
	constructor(
		private router: ActivatedRoute,
		private auth: AuthService,
		private utils: UtilsService
	) {
		this.id = this.router.snapshot.queryParams['id'];
	}

	ngOnInit(): void {
		if (this.id) {
			this.auth
				.readClient(this.id)
				.then((client: Client) => (this.client = client))
				.catch(err => {
					this.utils.openSnackBar(
						'Si è verificato un errore con il caricamento dei dati del cliente',
						'Riprovare, per favore.'
					);
					console.error(err);
				});
		}
	}

	getClientWorkouts() {
		this.auth
			.readClientWorkouts(this.client)
			.then((workouts: WorkoutOld[]) => (this.workouts = workouts))
			.catch(err => console.error(err));
	}
}
