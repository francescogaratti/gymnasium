import { Component, OnInit } from '@angular/core';
import { diary, Diary, DiaryClientData, FitCheck, TrainingCheck } from '@models/diary';
import { Client } from '@models/user';
import { ClientService } from '@services/client.service';
import { DiaryService } from '@services/diary.service';
import { UtilsService } from '@services/utils.service';
@Component({
	selector: 'app-diary',
	templateUrl: './diary.component.html',
	styleUrls: ['./diary.component.sass'],
})
export class DiaryComponent implements OnInit {
	diary: Diary = null;
	clients: Client[] = [];
	selectedClient: Client = null;
	constructor(
		private clientService: ClientService,
		private diaryService: DiaryService,
		private utils: UtilsService
	) {
		this.clientService.readClients().then(clients => (this.clients = clients));
	}

	ngOnInit(): void {}

	async onSelectClient(client: Client) {
		await this.diaryService
			.readUserDiary(client.uid)
			.then((d: Diary) => (this.diary = d))
			.catch(err => console.error(err));
		// ? set the client right here => avoid to show fallback message while querying the DB
		this.selectedClient = client;
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
		// this.diary = diary;
		this.diary = {
			uid: this.selectedClient.uid,
			clientId: this.selectedClient.uid,
			clientName: this.selectedClient.displayName,
			clientData: null,
			fitCheck: null,
			trainingChecks: [],
			date: '',
			consultantId: '',
			consultantName: '',
			notes: null,
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
}
