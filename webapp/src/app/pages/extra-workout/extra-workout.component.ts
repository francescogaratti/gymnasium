import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ExerciseEntry, Exercise, ExerciseCategories, ExerciseType, mock } from '@models/exercise';
import { User } from '@models/user';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

const mockExWeights = [55, 60, 65];

@Component({
	selector: 'app-extra-workout',
	templateUrl: './extra-workout.component.html',
	styleUrls: ['./extra-workout.component.sass'],
})
export class ExtraWorkoutComponent implements OnInit {
	user: User = null;
	esercizi: Exercise[] = null;
	selected_exercise: Exercise = null;
	displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
	dataSource = mockExWeights;

	constructor() {}

	ngOnInit(): void {}

	selectExercise(exercise: Exercise) {
		this.selected_exercise = exercise;
		//this.workout_sessions = template.sessions;
	}
}
