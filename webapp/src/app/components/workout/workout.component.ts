import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Workout } from '@models/workout';
import { Exercise } from '@models/exercise';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '@components/dialog-info/dialog-info.component';
@Component({
	selector: 'app-workout',
	templateUrl: './workout.component.html',
	styleUrls: ['./workout.component.sass'],
})
export class WorkoutComponent implements OnInit {
	id: string;
	@Input() workout: Workout = null;
	constructor(
		private activatedRoute: ActivatedRoute,
		private auth: AuthService,
		private utils: UtilsService,
		public dialog: MatDialog,
		private router: Router
	) {
		this.id = this.activatedRoute.snapshot.queryParams['id'];
	}

	ngOnInit(): void {}

	downloadExcel(workout: Workout) {
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

	openInfoNotes(exercise: Exercise) {
		this.dialog.open(DialogInfoComponent, {
			width: '300px',
			data: { title: exercise.name, messages: ['Note: ' + exercise.notes] },
		});
	}

	train(workout: Workout) {
		this.router.navigateByUrl('train?id=' + workout.id);
	}
}
