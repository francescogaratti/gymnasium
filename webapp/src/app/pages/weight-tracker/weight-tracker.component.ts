import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, WeightRecord } from '@models/user';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


const wRecs: WeightRecord [] = [
	{date: "5/5/2021", weight: 50},
	{date: "5/3/2021", weight: 25},
	{date: "10/7/2021", weight: 180},
	{date: "12/8/2022", weight: 70},
]

const REC_SCHEMA = {
	"date": "date",
	"weight": "number",
  }

@Component({
	selector: 'app-weight-tracker',
	templateUrl: './weight-tracker.component.html',
	styleUrls: ['./weight-tracker.component.sass'],	
})

export class WeightTrackerComponent implements AfterViewInit{
	user: User = null;
	dateFormControl: FormControl = new FormControl('', [Validators.required]);
	weigthFormControl: FormControl = new FormControl('', [Validators.required]);

	formsControl: FormControl[] = [this.dateFormControl, this.weigthFormControl];
	displayedColumns: string[] = ['date', 'weight', 'delete', 'edit'];
    dataSource = wRecs;
	dataSourceSort = new MatTableDataSource(wRecs);
	dataSchema = REC_SCHEMA;

	@ViewChild(MatSort) sort: MatSort;
	before_changes_element: any;
  
    constructor(private auth: AuthService, private utils: UtilsService) {}
    
	ngAfterViewInit() {
		this.dataSourceSort.sort = this.sort;
	  }

	ngOnInit(): void {}
	reset() {
		this.formsControl.forEach((f: FormControl) => f.setValue(null));
	}

	addRecord() {
		let date = this.dateFormControl.value.toLocaleDateString();
		let weigth = this.weigthFormControl.value;

		let newWeigthRecord = new WeightRecord(date, weigth);
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

	deleteRecord(element: WeightRecord) {
        let i = wRecs.indexOf(element);
		wRecs.splice(i, 1);
		console.info(wRecs);
		this.ngAfterViewInit();
		
	}

	editRecord(element: WeightRecord) {
        let i = wRecs.indexOf(element);
		wRecs[i].date = element.date;
		wRecs[i].weight = element.weight;
		//this.before_changes_element = JSON.parse(JSON.stringify(element));
		console.info(wRecs);
		//element['edit'] = true;
		
	}

	
}



