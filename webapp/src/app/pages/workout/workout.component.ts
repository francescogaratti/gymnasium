import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from '@models/client';
import { Workout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';
import * as XLSX from 'xlsx';

import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
@Component({
	selector: 'app-workout',
	templateUrl: './workout.component.html',
	styleUrls: ['./workout.component.sass'],
})
export class WorkoutComponent implements OnInit {
	id: string;
	workout: Workout = null;
	client: Client = null;
	constructor(
		private activatedRoute: ActivatedRoute,
		private auth: AuthService,
		private utils: UtilsService,
		private http: HttpClient
	) {
		this.id = this.activatedRoute.snapshot.queryParams['id'];
	}

	ngOnInit(): void {
		if (this.id) this.getWorkout(this.id);
	}

	getWorkout(id: string) {
		this.auth
			.getWorkout(id)
			.then((workout: Workout) => {
				this.workout = workout;
				this.getClient(this.workout.clientId);
			})
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
			});
	}

	getClient(id: string) {
		this.auth
			.readClient(id)
			.then((client: Client) => (this.client = client))
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar('Ops! Qualcosa è andato storto!', '💀💀💀');
			});
	}

	createExcel() {
		/* generate a worksheet */
		let ws = XLSX.utils.json_to_sheet([]);
		let col = 'A';
		let row = 1;
		if (!ws[col + row]) {
			ws[col + row] = { v: 'Yeah' };
		}

		let wb = XLSX.utils.book_new();
		/* add to workbook */
		wb.Props = {
			Title: this.workout.clientId + ' Workout - ' + this.workout.id,
			Author: this.workout.trainer,
			CreatedDate: new Date(),
		};
		XLSX.utils.book_append_sheet(wb, ws, 'Exercises');

		/* write workbook and force a download */
		XLSX.writeFile(wb, 'workout-' + this.workout.id + '.xlsx');
	}

	getExcelBuffer() {
		this.auth.getExcelBuffer(this.workout).then((res: any) => {
			// var sampleArr = this.base64ToArrayBuffer(res);
			this.saveByteArray('workout-' + this.workout.id + '.xlsx', this.toArrayBuffer(res));
		});
	}
	toArrayBuffer(buf) {
		var ab = new ArrayBuffer(buf.length);
		var view = new Uint8Array(ab);
		for (var i = 0; i < buf.length; ++i) {
			view[i] = buf[i];
		}
		return ab;
	}

	base64ToArrayBuffer(base64) {
		var binaryString = window.atob(base64);
		var binaryLen = binaryString.length;
		var bytes = new Uint8Array(binaryLen);
		for (var i = 0; i < binaryLen; i++) {
			var ascii = binaryString.charCodeAt(i);
			bytes[i] = ascii;
		}
		return bytes;
	}

	saveByteArray(reportName, byte) {
		var blob = new Blob([byte], { type: 'application/octet-stream' });
		var link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		var fileName = reportName;
		link.download = fileName;
		link.click();
	}

	excelURL: string = 'http://localhost:5001/ultra-gymnasium/us-central1/excel-createExcel';

	requestOptions: Object = {
		params: { workoutId: '001' },
		// headers: new HttpHeaders().append('Authorization', 'Bearer <yourtokenhere>'),
		responseType: 'arrayBuffer',
	};

	getExcel() {
		// this.excelURL += '?workoutId=' + this.workout.id;
		this.http
			.get<any>(this.excelURL, this.requestOptions)
			.toPromise()
			.then((res: ArrayBuffer) => {
				const link = document.createElement('a');
				link.style.display = 'none';
				document.body.appendChild(link);

				const blob = new Blob([res]);
				const objectURL = URL.createObjectURL(blob);

				link.href = objectURL;
				link.href = URL.createObjectURL(blob);
				link.download = 'workout-' + this.workout.id + '.xlsx';
				link.click();
			})
			.catch(err => {
				console.info('errore');
				console.error(err);
			});
	}
}
