import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface InfoData {
	title: string;
	messages: string[];
}

@Component({
	selector: 'app-dialog-info',
	templateUrl: './dialog-info.component.html',
	styleUrls: ['./dialog-info.component.sass'],
})
export class DialogInfoComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<DialogInfoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: InfoData
	) {}

	ngOnInit(): void {}
}
