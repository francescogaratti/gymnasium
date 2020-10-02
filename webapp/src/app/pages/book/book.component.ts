import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-book',
	templateUrl: './book.component.html',
	styleUrls: ['./book.component.sass'],
})
export class BookComponent implements OnInit {
	id: string = null;
	companyId: string = null; // single company
	local: string = null; // single shop
	reservation_number = null; // single table
	constructor(private router: ActivatedRoute) {
		const url = this.router.snapshot.url;
		this.companyId = url.length > 1 && url[1].path.length > 0 ? url[1].path : null;
		if (this.companyId) {
			const queryParamMap = this.router.snapshot.queryParamMap;
			this.id = queryParamMap.get('id') ? queryParamMap.get('id') : null;
			if (this.id) {
				[this.local, this.reservation_number] = this.id.split('/');
			} else {
				console.info('only company');
			}
		}
	}

	ngOnInit(): void {}

	loadCompanyDetails(companyId: string) {
		// ? download info of the company
		// read from db using companyId
	}

	loadCompanyMenu(companyId: string) {
		// ? download menù of the company + display the items
	}
}
