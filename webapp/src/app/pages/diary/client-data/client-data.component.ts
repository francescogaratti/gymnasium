import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Frequencies, Periods, TimeRanges, DiaryClientData } from '@models/diary';
import { Client, Trainer } from '@models/user';
import { ClientService } from '@services/client.service';
import { TrainerService } from '@services/trainer.service';

@Component({
	selector: 'app-client-data',
	templateUrl: './client-data.component.html',
	styleUrls: ['./client-data.component.sass'],
})
export class ClientDataComponent implements OnInit {
	Periods = Periods;
	Frequencies = Frequencies;
	TimeRanges = TimeRanges;
	@Input() clientData: DiaryClientData = null;
	@Output() onNewClientData: EventEmitter<DiaryClientData> = new EventEmitter<DiaryClientData>();

	clients: Client[] = [];
	trainers: Trainer[] = [];
	selectedTrainer: Trainer = null;

	/** from controls */
	subscriptionFC: FormControl = new FormControl('', [Validators.required]);
	clubFC: FormControl = new FormControl('', [Validators.required]);
	dateStartFC: FormControl = new FormControl('', [Validators.required]);

	jobTypeFC: FormControl = new FormControl('', [Validators.required]);
	alreadyAttended: boolean = false;

	experiencesFC: FormControl = new FormControl('', [Validators.required]);
	durationValueFC: FormControl = new FormControl('', [Validators.required]);
	durationPeriodFC: FormControl = new FormControl('', [Validators.required]);
	frequencyValueFC: FormControl = new FormControl('', [Validators.required]);
	frequencyPeriodFC: FormControl = new FormControl('', [Validators.required]);

	achieved: boolean = false;
	achievedNotesFC: FormControl = new FormControl('', [Validators.required]);

	goalFC: FormControl = new FormControl('', [Validators.required]);

	timeToAchieveValueFC: FormControl = new FormControl('', [Validators.required]);
	timeToAchievePeriodFC: FormControl = new FormControl('', [Validators.required]);
	keepGoal: boolean = false;

	whenFC: FormControl = new FormControl('', [Validators.required]);
	trainingRangeStartFC: FormControl = new FormControl('', [Validators.required]);
	trainingRangeEndFC: FormControl = new FormControl('', [Validators.required]);
	trainingFrequencyValueFC: FormControl = new FormControl('', [Validators.required]);
	trainingFrequencyPeriodFC: FormControl = new FormControl('', [Validators.required]);

	constructor(
		private clientService: ClientService,
		private trainerService: TrainerService // private diaryService: DiaryService
	) {
		this.clientService.readClients().then(clients => (this.clients = clients));
	}

	values(obj: any) {
		return Object.values(obj);
	}

	ngOnInit(): void {
		if (this.clientData) this.loadData();
	}

	async loadData() {
		await this.trainerService.readTrainers().then(trainers => (this.trainers = trainers));
		if (this.trainers && this.clientData.trainerId)
			this.selectedTrainer = this.trainers.find(
				(t: Trainer) => t.uid == this.clientData.trainerId
			);
		console.info(this.selectedTrainer);

		this.subscriptionFC.setValue(this.clientData.subscription);
		this.clubFC.setValue(this.clientData.club);
		this.dateStartFC.setValue(new Date(this.clientData.dateStart));

		this.jobTypeFC.setValue(this.clientData.jobType);
		this.alreadyAttended = this.clientData.alreadyAttended;

		this.experiencesFC.setValue(this.clientData.experiences);
		this.durationValueFC.setValue(this.clientData.duration.value);
		this.durationPeriodFC.setValue(this.clientData.duration.period);
		this.frequencyValueFC.setValue(this.clientData.frequency.value);
		this.frequencyPeriodFC.setValue(this.clientData.frequency.period);

		this.achieved = this.clientData.achieved;
		this.achievedNotesFC.setValue(this.clientData.achievedNotes);

		this.goalFC.setValue(this.clientData.goal);

		this.timeToAchieveValueFC.setValue(this.clientData.timeToAchieve.value);
		this.timeToAchievePeriodFC.setValue(this.clientData.timeToAchieve.period);
		this.keepGoal = this.clientData.keepGoal;

		this.whenFC.setValue(new Date(this.clientData.when));
		this.trainingRangeStartFC.setValue(this.clientData.trainingRange.start);
		this.trainingRangeEndFC.setValue(this.clientData.trainingRange.finish);
		this.trainingFrequencyValueFC.setValue(this.clientData.trainingFrequency.value);
		this.trainingFrequencyPeriodFC.setValue(this.clientData.trainingFrequency.period);
	}

	onSelectTrainer(trainer: Trainer) {
		this.selectedTrainer = trainer;
	}

	// todo: create new diary client data
	confirm(): void {
		let clientData: DiaryClientData = {
			subscription: this.subscriptionFC.value,
			club: this.clubFC.value,
			dateStart: new Date(this.dateStartFC.value).toUTCString(),
			trainerId: this.selectedTrainer.uid,
			trainerName: this.selectedTrainer.displayName,

			// clientId: this.selectedClient.uid,
			// clientName: this.selectedClient.displayName,

			jobType: this.jobTypeFC.value,
			alreadyAttended: this.alreadyAttended,

			experiences: this.experiencesFC.value,
			duration: {
				value: this.durationValueFC.value,
				period: this.durationPeriodFC.value,
			},
			frequency: {
				value: this.frequencyValueFC.value,
				period: this.frequencyPeriodFC.value,
			},

			achieved: this.achieved,
			achievedNotes: this.achievedNotesFC.value,

			goal: this.goalFC.value,

			timeToAchieve: {
				value: this.timeToAchieveValueFC.value,
				period: this.timeToAchievePeriodFC.value,
			},
			keepGoal: this.keepGoal,

			when: new Date(this.whenFC.value).toUTCString(),
			trainingRange: {
				start: this.trainingRangeStartFC.value,
				finish: this.trainingRangeEndFC.value,
			},
			trainingFrequency: {
				value: this.trainingFrequencyValueFC.value,
				period: this.trainingFrequencyPeriodFC.value,
			},
		};
		console.info('client data', clientData);
		this.onNewClientData.emit(clientData);
	}
}
