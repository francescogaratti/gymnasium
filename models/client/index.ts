export interface Client {
	id: string;
	displayName: string;
	fiscalCode: string;
	address?: string;
	address2?: string;
}

export const mocks: Client[] = [
	{ id: '001', displayName: 'Francesco Pangallo', fiscalCode: 'PNGFRN97F22A459B' },
	{ id: '002', displayName: 'Nicola Paiusco', fiscalCode: 'PSCNCL97C11A459N' },
	{ id: '003', displayName: 'Davide Ghiotto', fiscalCode: 'GHTDVD97E15A459I' },
];
