import { Component, Input, OnInit } from '@angular/core';
import { TrainingCheck } from '@models/diary';

@Component({
	selector: 'app-training-check',
	templateUrl: './training-check.component.html',
	styleUrls: ['./training-check.component.sass'],
})
export class TrainingCheckComponent implements OnInit {
	@Input() trainingCheck: TrainingCheck;
	constructor() {}

	ngOnInit(): void {}
}
