import { Component, OnInit } from '@angular/core';
import { diary, Diary, DiaryClientData } from '@models/diary';
@Component({
	selector: 'app-diary',
	templateUrl: './diary.component.html',
	styleUrls: ['./diary.component.sass'],
})
export class DiaryComponent implements OnInit {
	diary: Diary = null;
	clientData: DiaryClientData = null;
	constructor() {}

	ngOnInit(): void {
		// get diary
		// if found assign to variable
		// else create brand new diary
		this.diary = diary;
	}
}
