import { Component, OnInit } from '@angular/core';
import { User, WeightRecord } from '@models/user';
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

	weight_records: WeightRecord[] = [];

	constructor(private auth: AuthService, private utils: UtilsService) {
		this.getUserWeightRecords();
	}

	getUserWeightRecords() {
		this.auth
			.getUserWeightRecords(this.auth.user)
			.then(weights => (this.weight_records = weights))
			.catch(err => console.error(err));
	}

	ngOnInit(): void {}
	reset() {
		this.formsControl.forEach((f: FormControl) => f.setValue(null));
	}

	addRecord() {
		let date = this.dateFormControl.value.toLocaleDateString();
		let weight = this.weigthFormControl.value;

		let newWeigthRecord = new WeightRecord(date, weight);
		let uid = this.auth.user.uid;
		console.log(uid, newWeigthRecord);

		// auth service function
		this.auth
			.newWeightRecord(uid, newWeigthRecord)
			.then((value: boolean) => {
				if (value) {
					this.utils.openSnackBar('Peso salvato correttamente', '💪😉');
					this.getUserWeightRecords(); // ? this is called whenever we write a new weight record
				} else
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
