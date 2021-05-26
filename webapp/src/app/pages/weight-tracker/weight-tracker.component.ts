import { Component, OnInit } from '@angular/core';
import { User, WeigthRecord } from '@models/user';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

@Component({
	selector: 'app-weight-tracker',
	templateUrl: './weight-tracker.component.html',
	styleUrls: ['./weight-tracker.component.sass'],
})
export class WeightTrackerComponent implements OnInit {
	user: User = null;
	dateFormControl: FormControl = new FormControl('', [Validators.required]);
	weigthFormControl: FormControl = new FormControl('', [Validators.required]);

	formsControl: FormControl[] = [this.dateFormControl, this.weigthFormControl];

	constructor(private auth: AuthService, private utils: UtilsService) {}

	ngOnInit(): void {}
	reset() {
		this.formsControl.forEach((f: FormControl) => f.setValue(null));
	}

	addRecord() {
		let date = this.dateFormControl.value.toLocaleDateString();
		let weigth = this.weigthFormControl.value;

		let newWeigthRecord = new WeigthRecord(date, weigth);
		let uid = this.auth.user.uid;
		console.log(uid, newWeigthRecord);

		// auth service function
		this.auth
			.newWeightRecord(uid, newWeigthRecord)
			.then((value: boolean) => {
				if (value) this.utils.openSnackBar('Peso salvato correttamente', '💪😉');
				else
					this.utils.openSnackBar(
						'Si è verificato un errore durante il salvataggio del record del peso',
						'Riprovare, per favore 🙏'
					);
			})
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
			});
	}
}
