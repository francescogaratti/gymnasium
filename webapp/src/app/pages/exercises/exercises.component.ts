import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ExerciseEntry, Exercise, ExerciseCategories, ExerciseType, mock} from '@models/exercise';
import { User } from '@models/user';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

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
	descriptionFormControl: FormControl = new FormControl('', []);
	typeFormControl: FormControl = new FormControl('', [Validators.required]);
	categoryFormControl: FormControl = new FormControl('', [Validators.required]);
	compoundFormControl: FormControl = new FormControl('', []);
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;
	tags: string[] = [];


	formsControl: FormControl[] = [
		this.nameFormControl,
		this.descriptionFormControl,
		this.typeFormControl,
		this.categoryFormControl,
		this.compoundFormControl
	];
	
	
	
	  constructor(private auth: AuthService, private utils: UtilsService) {}

	ngOnInit(): void {}
    reset() {
		this.formsControl.forEach((f: FormControl) => f.setValue(null));
	}
	
	add(event: MatChipInputEvent): void {
		
		const value = (event.value || '').trim();
		// Add our tags
		if (value) {

		  this.tags.push(value);
		  console.log(this.tags);
		}
		let inputTag = document.getElementById("inputTag");
		(inputTag as HTMLInputElement).value = null; 
	  }
	
	  remove(tag: string): void {
		const index = this.tags.indexOf(tag);
	
		if (index >= 0) {
		  this.tags.splice(index, 1);
		}
	  }


	createExercise() {
		let name = this.nameFormControl.value;
		let type = this.typeFormControl.value;
		let description = this.descriptionFormControl.value;
		let category = this.categoryFormControl.value;
		let compound = this.compoundFormControl.value;
		let authorId = this.auth.user.uid;

		let newExerciseDefinition: ExerciseEntry = new ExerciseEntry(
			null,
			name,
			type,
			description,
			category,
			authorId,
			compound,
			this.tags
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

	

