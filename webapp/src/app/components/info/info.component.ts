import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from '@models/user';
import { DigitalWorkout } from '@models/workout';
import { AuthService } from '@services/auth.service';

@Component({
	selector: 'app-info',
	templateUrl: './info.component.html',
	styleUrls: ['./info.component.sass'],
})
export class InfoComponent implements OnInit {
	@Input() user: User = null;
	@Output() workouts: EventEmitter<DigitalWorkout[]> = new EventEmitter();

	originalUser: User = null;
	pendingChanges: boolean = false;

	/** form controls */
	photoFC: FormControl = new FormControl('', [Validators.required]);
	nameFC: FormControl = new FormControl('', [Validators.required]);
	surnameFC: FormControl = new FormControl('', [Validators.required]);
	sexFC: FormControl = new FormControl('', [Validators.required]);
	birthdayFC: FormControl = new FormControl('', [Validators.required]);

	constructor(private auth: AuthService) {}

	ngOnInit(): void {
		delete this.user.workouts;
		if (this.user) this.originalUser = JSON.parse(JSON.stringify(this.user));
		// set the form controls
		this.nameFC.setValue(this.user.displayName.split(' ')[0]);
		this.surnameFC.setValue(this.user.displayName.split(' ')[1]);
	}

	backup(): void {
		this.user = JSON.parse(JSON.stringify(this.originalUser));
	}
	cancel(): void {
		this.pendingChanges = false;
		this.user = JSON.parse(JSON.stringify(this.originalUser));
	}
	save(): void {
		this.pendingChanges = false;
		this.originalUser = JSON.parse(JSON.stringify(this.user));
	}
	modify(): void {
		this.pendingChanges = true;
	}

	getUserWorkouts() {
		this.auth
			.readUserWorkouts(this.user)
			.then((workouts: DigitalWorkout[]) => {
				this.workouts.emit(workouts);
			})
			.catch(err => console.error(err));
	}
}
