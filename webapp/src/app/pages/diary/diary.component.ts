import { Component, OnInit } from '@angular/core';
import { Diary, DiaryClientData, FitCheck, TrainingCheck } from '@models/diary';
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
	}

	ngOnInit(): void {}

	async onSelectClient(client: Client) {
		await this.trainerService
			.readTrainers()
			.then(trainers => (this.trainers = trainers ? trainers : []))
			.catch(err => console.error(err));
		await this.diaryService
			.readUserDiary(client.uid)
			.then((d: Diary) => (this.diary = d))
			.catch(err => console.error(err));
		// ? set the client right here => avoid to show fallback message while querying the DB
		this.selectedClient = client;
		this.findConsultant();
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
						deepCopy
							? 'Ora ' + this.selectedClient.displayName + ' ha un Diario'
							: 'Il Diario di ' +
									this.selectedClient.displayName +
									' è stato aggiornato con successo!'
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

	downloadDiary() {
		// ? call the service for the download of the file
		const filename: string = 'Diario_' + this.diary.clientName.replace(' ', '_') + '.xlsx';
		this.diaryService
			.downloadExcel(filename, this.diary.uid)
			.then((value: boolean) => {
				if (value) this.utils.openSnackBar('Conversione in file Excel riuscita!', '📝📝');
				else
					this.utils.openSnackBar(
						'Si è verificato un errore durante la conversione del diario',
						'Riprovare, per favore 🙏'
					);
			})
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
			});
	}

	createPDF() {
		const filename: string = 'Diario_' + this.diary.clientName.replace(' ', '_') + '.pdf';
		this.diaryService
			.downloadPDF('diario.pdf', this.diary.uid)
			.then((value: boolean) => {
				if (value) this.utils.openSnackBar('Conversione in file PDF riuscita!', '📝📝');
				else
					this.utils.openSnackBar(
						'Si è verificato un errore durante la conversione del diario',
						'Riprovare, per favore 🙏'
					);
			})
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
			});
	}

	findConsultant() {
		if (this.diary && this.diary.consultantId)
			this.selectedConsultant = this.trainers.find(
				(t: Trainer) => t.uid == this.diary.consultantId
			);
		else console.warn('Consultant Id is not present');
	}
}
