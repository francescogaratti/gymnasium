import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Frequencies, TrainingCheck } from '@models/diary';

@Component({
	selector: 'app-training-check',
	templateUrl: './training-check.component.html',
	styleUrls: ['./training-check.component.sass'],
})
export class TrainingCheckComponent implements OnInit {
	@Input() trainingCheck: TrainingCheck;
	@Output() onNewTrainingCheck: EventEmitter<TrainingCheck> = new EventEmitter<TrainingCheck>();

	dateFC: FormControl = new FormControl('', [Validators.required]);
	trainingFrequencyFC: FormControl = new FormControl('', [Validators.required]);

	goalFC: FormControl = new FormControl('', [Validators.required]);

	testFC: FormControl = new FormControl('', [Validators.required]);

	goalConsiderationsFC: FormControl = new FormControl('', [Validators.required]);
	goalFeelingsFC: FormControl = new FormControl('', [Validators.required]);
	goalFavoritesFC: FormControl = new FormControl('', [Validators.required]);

	nextTrainingCheckDateFC: FormControl = new FormControl('', [Validators.required]);
	nextTrainingWorkoutDateFC: FormControl = new FormControl('', [Validators.required]);

	motivationFC: FormControl = new FormControl('', [Validators.required]);
	satisfactionFC: FormControl = new FormControl('', [Validators.required]);

	constructor() {}

	ngOnInit(): void {
		if (this.trainingCheck) this.loadData();
	}

	loadData() {
		this.dateFC.setValue(new Date(this.trainingCheck.date));
		this.trainingFrequencyFC.setValue(this.trainingCheck.trainingFrequency.value);

		this.goalFC.setValue(this.trainingCheck.goal);

		this.testFC.setValue(this.trainingCheck.test);

		this.goalConsiderationsFC.setValue(this.trainingCheck.goalConsiderations);
		this.goalFeelingsFC.setValue(this.trainingCheck.goalFeelings);
		this.goalFavoritesFC.setValue(this.trainingCheck.goalFavorites);

		this.nextTrainingCheckDateFC.setValue(this.trainingCheck.nextTrainingCheckDate);
		this.nextTrainingWorkoutDateFC.setValue(this.trainingCheck.nextTrainingWorkoutDate);

		this.motivationFC.setValue(this.trainingCheck.motivation);
		this.satisfactionFC.setValue(this.trainingCheck.satisfaction);
	}

	create(): void {
		let trainingCheck: TrainingCheck = {
			date: new Date(this.dateFC.value).toLocaleDateString(),
			trainingFrequency: {
				value: this.trainingFrequencyFC.value,
				period: Frequencies.week,
			},
			goal: this.goalFC.value,
			test: this.testFC.value,

			goalConsiderations: this.goalConsiderationsFC.value,
			goalFeelings: this.goalFeelingsFC.value,
			goalFavorites: this.goalFavoritesFC.value,

			nextTrainingCheckDate: new Date(
				this.nextTrainingCheckDateFC.value
			).toLocaleDateString(),
			nextTrainingWorkoutDate: new Date(
				this.nextTrainingWorkoutDateFC.value
			).toLocaleDateString(),

			motivation: this.motivationFC.value,
			satisfaction: this.satisfactionFC.value,
		};
		console.info('training check', trainingCheck);
		this.onNewTrainingCheck.emit(trainingCheck);
	}
}
