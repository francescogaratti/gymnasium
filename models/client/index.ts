export interface Client {
	id: string;
	displayName: string;
	fiscalCode: string;
	address?: string;
	address2?: string;
	city: string;
	postalCode: string;
	workouts?: any[];
}

export class Client {
	constructor() {
		this.id = null;
		this.displayName = null;
		this.fiscalCode = null;
		this.address = null;
		this.address2 = null;
		this.city = null;
		this.postalCode = null;
	}
}

export const mocks: Client[] = [
	{
		id: '001',
		displayName: 'Francesco Pangallo',
		fiscalCode: 'PNGFRN97F22A459B',
		address: null,
		city: null,
		postalCode: null,
	},
	{
		id: '002',
		displayName: 'Nicola Paiusco',
		fiscalCode: 'PSCNCL97C11A459N',
		address: null,
		city: null,
		postalCode: null,
	},
	{
		id: '003',
		displayName: 'Davide Ghiotto',
		fiscalCode: 'GHTDVD97E15A459I',
		address: null,
		city: null,
		postalCode: null,
	},
];
