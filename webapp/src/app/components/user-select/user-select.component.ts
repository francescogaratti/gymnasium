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
	@Input() selected: User = null;
	@Input() users: User[] = [];
	@Input() center: boolean = false;

	userFormControl: FormControl = new FormControl('', [Validators.required]);
	filteredUsers: Observable<User[]>;
	@Output() onSelectUser: EventEmitter<User> = new EventEmitter<User>();

	constructor() {
		this.filteredUsers = this.userFormControl.valueChanges.pipe(
			startWith(''),
			map(typing => (typing ? this._filterUsersByName(typing) : this.users.slice()))
		);
	}

	ngOnInit(): void {
		if (this.selected) this.userFormControl.setValue(this.selected.displayName);
		console.info(this.selected);
	}

	private _filterUsersByName(typing: string): User[] {
		return this.users.filter(
			(u: User) =>
				u.displayName?.toLocaleLowerCase().indexOf(typing.toLocaleLowerCase()) !== -1 ||
				u.email.toLocaleLowerCase().indexOf(typing.toLocaleLowerCase()) !== -1
		);
	}

	changeUser(): void {
		this.selected = null;
		this.userFormControl.setValue(null);
		this.onSelectUser.emit(this.selected);
	}

	selectedValueChange(user: User): void {
		this.selected = user;
		this.onSelectUser.emit(this.selected);
	}
}
