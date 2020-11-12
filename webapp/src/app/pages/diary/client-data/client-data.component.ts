import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Frequencies, Periods, TimeRanges, DiaryClientData } from '@models/diary';
import { Client, Trainer, User } from '@models/user';
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

	constructor(private clientService: ClientService, private trainerService: TrainerService) {
		this.clientService.readClients().then(clients => (this.clients = clients));
		this.trainerService.readTrainers().then(trainers => (this.trainers = trainers));
	}

	values(obj: any) {
		return Object.values(obj);
	}

	ngOnInit(): void {}

	// todo: create new diary client data
	confirm(): void {
		// let clientData: DiaryClientData = {
		// };
	}
}
