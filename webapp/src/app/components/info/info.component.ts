import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Client, User, UserTypes } from '@models/user';
import { DigitalWorkout } from '@models/workout';
import { AuthService } from '@services/auth.service';

@Component({
	selector: 'app-info',
	templateUrl: './info.component.html',
	styleUrls: ['./info.component.sass'],
})
export class InfoComponent implements OnInit {
	UserTypes = UserTypes;
	@Input() user: User = null;
	@Input() client: Client = null;
	@Output() workouts: EventEmitter<DigitalWorkout[]> = new EventEmitter();

	originalUser: User = null;
	originalClient: Client = null;
	pendingChanges: boolean = false;

	/** form controls */
	photoFC: FormControl = new FormControl('', [Validators.required]);
	nameFC: FormControl = new FormControl('', [Validators.required]);
	surnameFC: FormControl = new FormControl('', [Validators.required]);
	sexFC: FormControl = new FormControl('', [Validators.required]);
	birthdayFC: FormControl = new FormControl('', [Validators.required]);

	/** workouts */
	// workouts: DigitalWorkout[] = [];

	constructor(private auth: AuthService) {}

	ngOnInit(): void {
		delete this.client.workouts;
		if (this.client) this.originalClient = JSON.parse(JSON.stringify(this.client));
		// set the form controls
		this.nameFC.setValue(this.client.displayName.split(' ')[0]);
		this.surnameFC.setValue(this.client.displayName.split(' ')[1]);
		// client attributes
		this.sexFC.setValue(this.client.sex ? 'man' : 'woman');
		this.birthdayFC.setValue(new Date(this.client.birthday));
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

	getClientWorkouts() {
		this.auth
			.readClientWorkouts(this.client)
			.then((workouts: DigitalWorkout[]) => {
				this.workouts.emit(workouts);
			})
			.catch(err => console.error(err));
	}
}
