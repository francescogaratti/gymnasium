import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '@models/client';
import { EmployeeType } from '@models/employee';
import { ExerciseCategory, ExerciseEntry } from '@models/exercise';
import { Trainer } from '@models/trainer';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

@Component({
	selector: 'app-new-exercise',
	templateUrl: './new-exercise.component.html',
	styleUrls: ['./new-exercise.component.sass'],
	encapsulation: ViewEncapsulation.None,
})
export class NewExerciseComponent implements OnInit {
	exerciseEntry: ExerciseEntry = null;

	nomeFormControl: FormControl = new FormControl('', [Validators.required]);
	categoryFormControl: FormControl = new FormControl('', [Validators.required]);

	formsControl: FormControl[] = [this.nomeFormControl, this.categoryFormControl];
	constructor(private auth: AuthService, private utils: UtilsService, public router: Router) {}

	ngOnInit(): void {}

	addExercise(exerciseEntry: ExerciseEntry): void {
		exerciseEntry = {
			name: this.nomeFormControl.value,
			category: this.categoryFormControl.value
				? this.categoryFormControl.value
				: ExerciseCategory.petto,
		};
		console.info('Adding new exercise: ', exerciseEntry);
		this.auth.newExercise(exerciseEntry).then((id: string) => {
			if (id) {
				console.info(id);
				this.utils.openSnackBar(
					"L'esercizio " + exerciseEntry.name + ' è stato aggiunto con successo',
					'😉'
				);
				this.resetExercise(exerciseEntry);
			} else
				this.utils.openSnackBar(
					'Attenzione, si è verificato un errore nel salvataggio del nuovo esercizio',
					'Riprovare'
				);
		});
	}

	resetExercise(ee: ExerciseEntry): void {
		ee = {
			name: null,
			category: null,
		};
		this.formsControl.forEach((form: FormControl) => form.setValue(null));
	}
}
