import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-personal-area',
	templateUrl: './personal-area.component.html',
	styleUrls: ['./personal-area.component.sass'],
})
export class PersonalAreaComponent implements OnInit {
	last: boolean = false;
	constructor(private activatedRoute: ActivatedRoute) {
		let last = this.activatedRoute.snapshot.queryParams['last'];
		this.last = last && last == 'true' ? true : false;
	}

	ngOnInit(): void {}
}
