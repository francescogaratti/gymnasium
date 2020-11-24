import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// require dependencies
import { AuthService } from '@services/auth.service.js';
import { DiaryService } from '@services/diary.service';
import { UtilsService } from '@services/utils.service.js';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
	title: string = 'Gymnasium';
	constructor(
		public router: Router,
		private diaryService: DiaryService,
		private utils: UtilsService
	) {}

	async ngOnInit() {}

	createPDF() {
		this.diaryService
			.downloadPDF('diario.pdf', 'WRcrJKbtjpfe2nIQJpQWhkrwOdx2')
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
}
