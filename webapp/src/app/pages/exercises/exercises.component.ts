import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ExerciseEntry, Exercise, ExerciseCategories, ExerciseType, mock } from '@models/exercise';
import { User } from '@models/user';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

@Component({
	selector: 'app-exercises',
	templateUrl: './exercises.component.html',
	styleUrls: ['./exercises.component.sass'],
})
export class ExercisesComponent implements OnInit {
	user: User = null;
	exercises: Exercise[] = mock;
	types: string[] = Object.keys(ExerciseType);
	categories: string[] = Object.keys(ExerciseCategories);
	nameFormControl: FormControl = new FormControl('', [Validators.required]);
	descriptionFormControl: FormControl = new FormControl('', [Validators.required]);
	typeFormControl: FormControl = new FormControl('', [Validators.required]);
	categoryFormControl: FormControl = new FormControl('', [Validators.required]);

	formsControl: FormControl[] = [
		this.nameFormControl,
		this.descriptionFormControl,
		this.typeFormControl,
		this.categoryFormControl,
	];

	constructor(private auth: AuthService, private utils: UtilsService) {}

	ngOnInit(): void {}

	reset() {
		this.formsControl.forEach((f: FormControl) => f.setValue(null));
	}

	createExercise() {
		// todo : create exercise on DB
		let name = this.nameFormControl.value;
		let type = this.typeFormControl.value;
		let description = this.descriptionFormControl.value;
		let category = this.categoryFormControl.value;
		let authorId = this.auth.user.uid;
		let newExerciseDefinition: ExerciseEntry = new ExerciseEntry(
			null,
			name,
			type,
			description,
			category,
			authorId
		);
		console.info(newExerciseDefinition);
		// todo: check for same exercise based on name + description + type + category
		this.auth
			.newExercise(newExerciseDefinition)
			.then((id: string) => {
				if (id) {
					newExerciseDefinition.id = id;
					this.auth
						.updateExercise(newExerciseDefinition)
						.then((value: boolean) => {
							if (value)
								this.utils.openSnackBar(
									"L'esercizio è stato salvato correttamente",
									'💪😉'
								);
							else
								this.utils.openSnackBar(
									"Si è verificato un errore durante il salvataggio dell'esercizio",
									'Riprovare, per favore 🙏'
								);
						})
						.catch(err => {
							console.error(err);
							this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
						});
				} else
					this.utils.openSnackBar(
						"Si è verificato un errore durante il salvataggio dell'esercizio",
						'Riprovare, per favore 🙏'
					);
			})
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
			});
	}
}
