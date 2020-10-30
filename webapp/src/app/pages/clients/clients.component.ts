import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '@models/user';
// import { Client } from '@models/client';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';

@Component({
	selector: 'app-clients',
	templateUrl: './clients.component.html',
	styleUrls: ['./clients.component.sass'],
})
export class ClientsComponent implements OnInit {
	displayedColumns: string[] = ['name', 'fiscalCode', 'delete', 'detail'];
	clients: Client[] = [];
	constructor(private auth: AuthService, private utils: UtilsService, public router: Router) {}

	ngOnInit(): void {
		this.auth.clients$.subscribe((clients: Client[]) => (this.clients = clients));
	}

	showClients() {
		this.auth.readClients();
	}

	remove(client: Client) {
		console.info('remove', client);
		this.auth.deleteClient(client).then(res => {
			if (res) {
				console.info('removed');
				this.utils.openSnackBar(
					'Il cliente ' + client.displayName + ' è stato correttamente rimosso',
					'👋👋'
				);
				this.auth.readClients();
			}
		});
	}

	detail(client: Client) {
		this.router.navigateByUrl('client?id=' + client.uid);
	}
}
