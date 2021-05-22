import { Component, Input, OnInit } from '@angular/core';
import { Exercise } from '@models/exercise';

@Component({
	selector: 'custom-exercises',
	templateUrl: './custom-exercises.component.html',
	styleUrls: ['./custom-exercises.component.sass'],
})
export class CustomExercisesComponent implements OnInit {
	@Input() exercise: Exercise = null;
	constructor() {}

	ngOnInit(): void {}
}
