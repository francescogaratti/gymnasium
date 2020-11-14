import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Frequencies, Periods, TimeRanges, DiaryClientData } from '@models/diary';
import { Client, Trainer, User } from '@models/user';
import { ClientService } from '@services/client.service';
import { DiaryService } from '@services/diary.service';
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

	@Output() onNewClientData: EventEmitter<DiaryClientData> = new EventEmitter<DiaryClientData>();

	clients: Client[] = [];
	trainers: Trainer[] = [];
	selectedClient: Client = null;
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
		private trainerService: TrainerService,
		private diaryService: DiaryService
	) {
		this.clientService.readClients().then(clients => (this.clients = clients));
		this.trainerService.readTrainers().then(trainers => (this.trainers = trainers));
	}

	values(obj: any) {
		return Object.values(obj);
	}

	ngOnInit(): void {}

	// todo: create new diary client data
	confirm(): void {
		let clientData: DiaryClientData = {
			subscription: this.subscriptionFC.value,
			club: this.clubFC.value,
			dateStart: new Date(this.dateStartFC.value).toLocaleDateString(),
			trainerId: this.selectedTrainer.uid,
			trainerName: this.selectedTrainer.displayName,

			clientId: this.selectedClient.uid,
			clientName: this.selectedClient.displayName,

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

			when: new Date(this.whenFC.value).toLocaleDateString(),
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
