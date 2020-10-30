export interface Client {
	id: string;
	displayName: string;
	birthday?: string;
	photoUrl?: string;
	fiscalCode: string;
	address?: string;
	city: string;
	postalCode: string;
	tokenId?: string;
	workouts?: any[];
}

export class Client {
	constructor() {
		this.id = null;
		this.displayName = null;
		this.fiscalCode = null;
		this.address = null;
		this.city = null;
		this.postalCode = null;
	}
}

export const mocks: Client[] = [
	{
		id: '001',
		displayName: 'Francesco Pangallo',
		photoUrl:
			'https://scontent-fco1-1.cdninstagram.com/v/t51.2885-19/s320x320/89391598_232823661234227_7842121025591443456_n.jpg?_nc_ht=scontent-fco1-1.cdninstagram.com&_nc_ohc=uRXEoTb5oo0AX_drNr0&oh=73fea4b622699945556c263ed9ae3d4f&oe=5FB237AF',
		fiscalCode: 'PNGFRN97F22A459B',
		address: null,
		city: null,
		postalCode: null,
	},
	{
		id: '002',
		displayName: 'Nicola Paiusco',
		photoUrl:
			'https://scontent-fco1-1.cdninstagram.com/v/t51.2885-19/s320x320/13696906_1756026761305564_101286471_a.jpg?_nc_ht=scontent-fco1-1.cdninstagram.com&_nc_ohc=zlRGjRmKGowAX8nlKwG&oh=772d76417483b6378514e63beaf1ae1f&oe=5FB208E8',
		fiscalCode: 'PSCNCL97C11A459N',
		address: null,
		city: null,
		postalCode: null,
	},
	{
		id: '003',
		displayName: 'Davide Ghiotto',
		photoUrl:
			'https://lh3.googleusercontent.com/ogw/ADGmqu_py72EDdesUILhFoB5a8-xzr_3SnaKEpdAQqAk=s83-c-mo',
		fiscalCode: 'GHTDVD97E15A459I',
		address: null,
		city: null,
		postalCode: null,
	},
];
