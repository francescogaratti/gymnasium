import { Component, OnInit } from '@angular/core';
import { Exercise, mock } from '@models/exercise';

@Component({
	selector: 'app-exercises',
	templateUrl: './exercises.component.html',
	styleUrls: ['./exercises.component.sass'],
})
export class ExercisesComponent implements OnInit {
	exercises: Exercise[] = mock;
	constructor() {}

	ngOnInit(): void {}
}
