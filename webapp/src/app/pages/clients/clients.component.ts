import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '@models/user';
import { ClientService } from '@services/client.service';
import { UtilsService } from '@services/utils.service';

@Component({
	selector: 'app-clients',
	templateUrl: './clients.component.html',
	styleUrls: ['./clients.component.sass'],
})
export class ClientsComponent implements OnInit {
	displayedColumns: string[] = ['name', 'fiscalCode', 'delete', 'detail'];
	clients: Client[] = [];
	constructor(
		private utils: UtilsService,
		public router: Router,
		private clientService: ClientService
	) {
		this.clientService.clients$.subscribe((clients: Client[]) => {
			this.clients = clients;
			if (!this.clients || this.clients.length == 0)
				this.utils.openSnackBar(
					'Nessun cliente presente.',
					'Per inserirne uno cliccare su "Nuovo Cliente"',
					10000
				);
		});
	}

	ngOnInit(): void {}

	showClients() {
		this.clientService.readClients();
	}

	remove(client: Client) {
		this.clientService
			.deleteClient(client.uid)
			.then(res => {
				if (res) {
					this.utils.openSnackBar(
						'Il cliente ' + client.displayName + ' è stato correttamente rimosso',
						'👋👋'
					);
					this.showClients();
				}
			})
			.catch(err => {
				console.error(err);
				this.utils.openSnackBar(
					"Si è verificato un errore durante l'eliminazione del cliente " +
						client.displayName,
					'Si prega di riprovare.'
				);
			});
	}

	detail(client: Client) {
		this.router.navigateByUrl('client?id=' + client.uid);
	}
}
