import { Component, Input, OnInit } from '@angular/core';
import { Client, User } from '@models/user';

@Component({
	selector: 'app-info',
	templateUrl: './info.component.html',
	styleUrls: ['./info.component.sass'],
})
export class InfoComponent implements OnInit {
	@Input() user: User = null;
	@Input() client: Client = null;

	originalUser: User = null;
	originalClient: Client = null;
	pendingChanges: boolean = false;

	constructor() {}

	ngOnInit(): void {
		delete this.client.workouts;
		if (this.client) this.originalClient = JSON.parse(JSON.stringify(this.client));
	}

	backup(): void {
		this.client = JSON.parse(JSON.stringify(this.originalClient));
	}
	cancel(): void {
    this.pendingChanges = false;
		this.client = JSON.parse(JSON.stringify(this.originalClient));
	}
	save(): void {
		this.pendingChanges = false;
		this.originalClient = JSON.parse(JSON.stringify(this.client));
	}
	modify(): void {
		this.pendingChanges = true;
	}
}
