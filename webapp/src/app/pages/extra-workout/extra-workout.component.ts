import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import {
	ExerciseEntry,
	Exercise,
	ExerciseCategories,
	ExerciseType,
	mock,
	ExerciseRecord,
} from '@models/exercise';
import { User } from '@models/user';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';
import { flattenDiagnosticMessageText } from 'typescript';

const mockExWeights = [
	{
		name: 'panca',
		weight: 50,
		reps: 6,
	},
	// {
	// 	name: 'leg curl',
	// 	weight: 80,
	// 	reps: 8,
	// },
	// {
	// 	name: 'tricipiti',
	// 	weight: 35,
	// 	reps: 10,
	// },
];
@Component({
	selector: 'app-extra-workout',
	templateUrl: './extra-workout.component.html',
	styleUrls: ['./extra-workout.component.sass'],
})
export class ExtraWorkoutComponent implements OnInit {
	user: User = null;
	esercizi: Exercise[] = null;
	selected_exercise: Exercise = null;
	maxPercentage: number = null;
	exesRecs = mockExWeights;
	massimale: number = null;
	valoriCalcolati: number[] = null;
	esercizioFormControl: FormControl = new FormControl('', [Validators.required]);

	displayedColumns: string[] = [
		'Max',
		'2 reps',
		'4 reps',
		'6 reps',
		'8 reps',
		'10 reps',
		'12 reps',
		'15 reps',
	];
	dataSource = mockExWeights;

	constructor() {}

	ngOnInit(): void {}

	selectExercise(exercise: Exercise) {
		this.selected_exercise = exercise;
		//this.workout_sessions = template.sessions;
	}

	changeExercise() {
		this.selected_exercise = null;
		this.esercizioFormControl.setValue(null);
	}

	repsToPerc(reps: number) {
		let maxPercentage = null;
		if (reps == 2 || reps == 3) {
			maxPercentage = 90;
		} else if (reps == 4 || reps == 5) {
			maxPercentage = 85;
		} else if (reps == 6 || reps == 7) {
			maxPercentage = 80;
		} else if (reps == 8 || reps == 9) {
			maxPercentage = 75;
		} else if (reps == 10 || reps == 11) {
			maxPercentage = 70;
		} else if (reps == 12) {
			maxPercentage = 65;
		} else if (reps == 15) {
			maxPercentage = 60;
		} else {
			maxPercentage = 100;
		}
		return maxPercentage;
	}

	calculateMassimale(weight: number, reps: number) {
		let perc = this.repsToPerc(reps);
		let max = (weight * 100) / perc;
		let percentuali = [60, 65, 70, 75, 80, 85, 90];
		let percResult = [];

		percentuali.forEach(p => {
			let v = (weight * p) / perc;
			percResult.push(v);
		});

		this.massimale = max;
		this.valoriCalcolati = percResult;

		console.info(this.valoriCalcolati);
		console.info(this.massimale);
	}

	logCose() {
		console.log(this.repsToPerc(6));
		//this.repsToPerc(mockExWeights[0].reps);
	}
}
