import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from '@models/user';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-user-select',
	templateUrl: './user-select.component.html',
	styleUrls: ['./user-select.component.sass'],
})
export class UserSelectComponent implements OnInit {
	@Input() name: string = 'Utente';
	@Input() users: User[] = [];
	@Input() center: boolean = false;

	userFormControl: FormControl = new FormControl('', [Validators.required]);
	filteredUsers: Observable<User[]>;
	selectedUser: User = null;
	@Output() onSelectUser: EventEmitter<User> = new EventEmitter<User>();

	constructor() {
		this.filteredUsers = this.userFormControl.valueChanges.pipe(
			startWith(''),
			map(name => (name ? this._filterUsersByName(name) : this.users.slice()))
		);
	}

	ngOnInit(): void {}

	private _filterUsersByName(name: string): User[] {
		return this.users.filter(
			(u: User) => u.displayName.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) !== -1
		);
	}

	changeUser(): void {
		this.selectedUser = null;
		this.userFormControl.setValue(null);
		this.onSelectUser.emit(this.selectedUser);
	}

	selectedValueChange(user: User): void {
		this.selectedUser = user;
		this.onSelectUser.emit(this.selectedUser);
	}
}
