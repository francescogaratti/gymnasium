import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FitCheck } from '@models/diary';

@Component({
	selector: 'app-fit-check',
	templateUrl: './fit-check.component.html',
	styleUrls: ['./fit-check.component.sass'],
})
export class FitCheckComponent implements OnInit {
	@Input() fitCheck: FitCheck = null;
	@Output() onNewFitCheck: EventEmitter<FitCheck> = new EventEmitter<FitCheck>();

	healthStatusFC: FormControl = new FormControl('', [Validators.required]);
	heightFC: FormControl = new FormControl('', [Validators.required]);
	weightFC: FormControl = new FormControl('', [Validators.required]);
	smoker: boolean = false;
	injuriesFC: FormControl = new FormControl('', [Validators.required]);
	drugsFC: FormControl = new FormControl('', [Validators.required]);
	dietFC: FormControl = new FormControl('', [Validators.required]);

	constructor() {}

	ngOnInit(): void {
		if (this.fitCheck) this.loadData();
	}

	loadData() {
		this.healthStatusFC.setValue(this.fitCheck.healthStatus);
		this.heightFC.setValue(this.fitCheck.height);
		this.weightFC.setValue(this.fitCheck.weight);
		this.smoker = this.fitCheck.smoker;
		this.injuriesFC.setValue(this.fitCheck.injuries);
		this.drugsFC.setValue(this.fitCheck.drugs);
		this.dietFC.setValue(this.fitCheck.diet);
	}

	confirm(): void {
		let fitCheck: FitCheck = {
			healthStatus: this.healthStatusFC.value,
			height: this.heightFC.value,
			weight: this.weightFC.value,
			smoker: this.smoker,
			injuries: this.injuriesFC.value,
			drugs: this.drugsFC.value,
			diet: this.dietFC.value,
		};
		this.fitCheck = fitCheck;
		console.info('fit check', this.fitCheck);
		this.onNewFitCheck.emit(this.fitCheck);
	}
}
