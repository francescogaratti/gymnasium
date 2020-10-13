import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '@models/client';
import { EmployeeType } from '@models/employee';
import { Exercise } from '@models/exercise';
import { Trainer } from '@models/trainer';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

export function checkFiscalCode(nameRe: RegExp): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const forbidden = nameRe.test(control.value);
		return forbidden ? { forbiddenName: { value: control.value } } : null;
	};
}
// '(?:[\\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\\dLMNP-V]|[0L][1-9MNP-V]))'
const fiscalCodePattern: string =
	'(?:[\\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\\dLMNP-V]|[0L][1-9MNP-V]))';
@Component({
	selector: 'app-new-workout',
	templateUrl: './new-workout.component.html',
	styleUrls: ['./new-workout.component.sass'],
	encapsulation: ViewEncapsulation.None,
})
export class NewWorkoutComponent implements OnInit {
  
	new_exercise:Exercise;
	exercises:Exercise[] = [];
	edit_mode:boolean = false;

	esercizioFormControl:FormControl = new FormControl('',[Validators.required]);
	setsFormControl:FormControl = new FormControl('',[Validators.required]);
	repsFormControl:FormControl = new FormControl('',[Validators.required]);
	restMinFormControl:FormControl = new FormControl('',[Validators.required]);
	restSecFormControl:FormControl = new FormControl('',[Validators.required]);
	notesFormControl:FormControl = new FormControl('',[]);


	formsControl: FormControl[] = [
		this.esercizioFormControl,
		this.setsFormControl,
		this.repsFormControl,
		this.restMinFormControl,
		this.restSecFormControl,
		this.notesFormControl
	];
	constructor(private auth: AuthService, private utils:UtilsService, public router:Router) {}

	ngOnInit(): void {
	}

	newExercise(){
		// todo: create new input row
		console.info("new exercise");
		this.edit_mode = true;
	}
	addExercise(){
		this.new_exercise = {
			id:null,
			name:this.esercizioFormControl.value,
			reps:this.repsFormControl.value,
			sets:this.setsFormControl.value,
			rest: {
				minutes:this.restMinFormControl.value,
				seconds:this.restSecFormControl.value
			},
			notes: this.notesFormControl.value
		}
		this.exercises.push(this.new_exercise);
		this.formsControl.forEach((f:FormControl)=>f.setValue(null));
		this.edit_mode = false;
	}

	createWorkout(){
		console.info("create workout");
	}
}
