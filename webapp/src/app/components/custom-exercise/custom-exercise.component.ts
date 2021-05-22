import { Component, Input, OnInit } from '@angular/core';
import { Exercise } from '@models/exercise';

@Component({
	selector: 'app-custom-exercise',
	templateUrl: './custom-exercise.component.html',
	styleUrls: ['./custom-exercise.component.sass'],
})
export class CustomExerciseComponent implements OnInit {
	@Input() exercise: Exercise = null;
	constructor() {}

	ngOnInit(): void {}
}
