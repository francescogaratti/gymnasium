import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '@services/auth.service';

@Component({
	selector: 'app-client-data',
	templateUrl: './client-data.component.html',
	styleUrls: ['./client-data.component.sass'],
})
export class ClientDataComponent implements OnInit {
	users: User[] = [];
	selectedUser: User = null;
	constructor(private auth: AuthService) {
		this.auth.readUsers().then(users => (this.users = users));
	}

	ngOnInit(): void {}

  onSelect(user:User){
    this.selectedUser=user;
  }

	showUser() {
		console.info(this.selectedUser);
	}
}
