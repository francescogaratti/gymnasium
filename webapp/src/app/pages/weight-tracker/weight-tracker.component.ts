import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, WeightRecord } from '@models/user';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// const wRecs: WeightRecord [] = [ //mm/dd/yyyy;
// 	{date: "5/5/2021", weight: 50},
// 	{date: "11/8/2022", weight: 70},
// 	{date: "10/7/2021", weight: 180},
// 	{date: "6/3/2021", weight: 25},
// 	{date: "2/3/2023", weight: 23},
// 	{date: "12/29/2022", weight: 99},
// ]

let wRecs: WeightRecord[] = [
	//mm/dd/yyyy;
	{ date: '5/5/2021', weight: 50 },
	{ date: '11/8/2022', weight: 70 },
	{ date: '10/7/2021', weight: 180 },
	{ date: '6/3/2021', weight: 25 },
	{ date: '2/3/2023', weight: 23 },
	{ date: '12/29/2022', weight: 99 },
];

@Component({
	selector: 'app-weight-tracker',
	templateUrl: './weight-tracker.component.html',
	styleUrls: ['./weight-tracker.component.sass'],
})
export class WeightTrackerComponent implements AfterViewInit {
	user: User = null;
	dateFormControl: FormControl = new FormControl('', [Validators.required]);
	editDateFormControl: FormControl = new FormControl('');
	weigthFormControl: FormControl = new FormControl('', [Validators.required]);

	formsControl: FormControl[] = [this.dateFormControl, this.weigthFormControl];
	displayedColumns: string[] = ['date', 'weight', 'delete', 'edit'];
	dataSource = wRecs;
	dataSourceSort = new MatTableDataSource(wRecs);
	myChart: Chart = null;

	@ViewChild(MatSort) sort: MatSort;
	before_changes_element: any;

	constructor(private auth: AuthService, private utils: UtilsService) {}

	ngAfterViewInit() {
		this.sortDatabase();
		const xlabels = [];
		const ylabels = [];
		for (let i = 0; i < wRecs.length; i++) {
			const xDate = wRecs[i].date;
			const yWeight = wRecs[i].weight;
			xlabels.push(xDate);
			ylabels.push(yWeight);
		}

		this.myChart = new Chart('weightChart', {
			type: 'line',
			data: {
				labels: xlabels,
				datasets: [
					{
						tension: 0.2,
						label: 'Kg',
						data: ylabels,
						backgroundColor: 'rgba(255, 0, 0, 1)',
						borderColor: 'rgba(20, 20, 255, 0.5)',
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: false,
					},
				},
			},
		});
	}

	ngOnInit(): void {
		this.auth.getUserWeightRecords(this.auth.user).then(records => {
			wRecs = records;
			this.dataSourceSort = new MatTableDataSource(wRecs);
			this.update();
		});
	}

	reset() {
		this.formsControl.forEach((f: FormControl) => f.setValue(null));
	}

	update() {
		this.dataSourceSort.sort = this.sort;
		this.sortDatabase();
		const xlabels = [];
		const ylabels = [];

		for (let i = 0; i < wRecs.length; i++) {
			const xDate = wRecs[i].date;
			const yWeight = wRecs[i].weight;
			xlabels.push(new Date(xDate).toLocaleDateString());
			ylabels.push(yWeight);
		}
		console.log(xlabels, ylabels);

		this.myChart.data.labels = xlabels;
		this.myChart.data.datasets[0].data = ylabels;
		this.myChart.update();
		console.info(this.myChart.data.datasets[0].data);
	}
	addRecord() {
		//let date = this.dateFormControl.value.toLocaleDateString();
		let date = new Date(this.dateFormControl.value).toString();
		let weight = this.weigthFormControl.value;

		let newWeigthRecord = new WeightRecord(date, weight);
		let uid = this.auth.user.uid;
		console.log(uid, newWeigthRecord);
		wRecs.push({ date, weight });
		console.log(wRecs);
		this.update();
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
		this.update();
		//this.ngAfterViewInit();
	}

	editRecord(element: WeightRecord) {
		console.info('editing');
		element['isEdit'] = true;
	}

	saveRecord(element: WeightRecord) {
		console.info('saving');
		let i = wRecs.indexOf(element);
		wRecs[i].date = element.date;
		wRecs[i].weight = element.weight;
		element['isEdit'] = false;
		console.info(wRecs);
		this.update();
	}

	sortDatabase() {
		wRecs.sort(function (a, b) {
			if (new Date(a.date) > new Date(b.date)) return 1;
			if (new Date(a.date) < new Date(b.date)) return -1;
			return 0;
		});
	}
}
