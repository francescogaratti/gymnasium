import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { diary, Diary, DiaryClientData, FitCheck, TrainingCheck } from '@models/diary';
import { Client, Trainer } from '@models/user';
import { ClientService } from '@services/client.service';
import { DiaryService } from '@services/diary.service';
import { TrainerService } from '@services/trainer.service';
import { UtilsService } from '@services/utils.service';
@Component({
	selector: 'app-diary',
	templateUrl: './diary.component.html',
	styleUrls: ['./diary.component.sass'],
})
export class DiaryComponent implements OnInit {
	diary: Diary = null;
	clients: Client[] = [];
	trainers: Trainer[] = [];
	selectedClient: Client = null;
	selectedConsultant: Trainer = null;

	constructor(
		private clientService: ClientService,
		private trainerService: TrainerService,
		private diaryService: DiaryService,
		private utils: UtilsService
	) {
		this.clientService.readClients().then(clients => (this.clients = clients));
		// this.trainerService.readTrainers().then(trainers => (this.trainers = trainers));
	}

	ngOnInit(): void {}

	async onSelectClient(client: Client) {
		await this.diaryService
			.readUserDiary(client.uid)
			.then((d: Diary) => (this.diary = d))
			.catch(err => console.error(err));
		// if (this.diary) this.findConsultant(); // todo: uncomment when trainers ready
		// ? set the client right here => avoid to show fallback message while querying the DB
		this.selectedClient = client;
	}

	onSelectConsultant(consultant: Trainer) {
		this.selectedConsultant = consultant;
		this.diary.consultantId = this.selectedConsultant.uid;
		this.diary.consultantName = this.selectedConsultant.displayName;
	}

	onNewClientData(clientData: DiaryClientData) {
		this.diary.clientData = clientData;
	}

	onNewFitCheck(fitCheck: FitCheck) {
		this.diary.fitCheck = fitCheck;
	}

	onNewTrainingCheck(trainingCheck: TrainingCheck) {
		if (!this.diary.trainingChecks) this.diary.trainingChecks = [];
		this.diary.trainingChecks.push(trainingCheck);
	}

	createNewDiary() {
		this.diary = {
			uid: this.selectedClient.uid,
			clientId: this.selectedClient.uid,
			clientName: this.selectedClient.displayName,
			clientData: null,
			fitCheck: null,
			trainingChecks: [],
			date: new Date().toUTCString(),
			consultantId: '',
			consultantName: '',
			notes: '',
		};
		this.updateDiary(true);
	}

	updateDiary(deepCopy?: boolean) {
		this.diaryService
			.updateUserDiary(this.diary, deepCopy)
			.then((value: boolean) => {
				if (value)
					this.utils.openSnackBar(
						'Ottimo!',
						'Ora ' + this.selectedClient.displayName + ' ha un Diario'
					);
				else
					this.utils.openSnackBar(
						'Si è verificato un errore durante il salvataggio del Diario',
						'Riprovare per favore'
					);
			})
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar(
					'Si è verificato un errore durante il salvataggio del Diario',
					'Riprovare per favore'
				);
			});
	}

	findConsultant() {
		if (this.diary && this.diary.consultantId)
			this.selectedConsultant = this.trainers.find(
				(t: Trainer) => t.uid == this.diary.consultantId
			);
		else console.error('Consultant Id is not present');
	}
}
