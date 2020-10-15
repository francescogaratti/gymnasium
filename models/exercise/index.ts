export interface Exercise {
	id: string;
	name: string;
	sets: number;
	reps: number;
	rest: {
		minutes: number;
		seconds: number;
	};
	notes?: string;
}

export class Exercise implements Exercise {
	constructor() {
		this.id = null;
		this.name = null;
		this.sets = null;
		this.reps = null;
		this.rest = {
			minutes: null,
			seconds: null,
		};
		this.notes = null;
	}
}

export const mock: Exercise[] = [
	{
		id: '0',
		name: 'Panca piana',
		sets: 5,
		reps: 10,
		rest: {
			minutes: 2,
			seconds: 0,
		},
		notes: '',
	},
	{
		id: '1',
		name: 'Spinte panca 30°',
		sets: 3,
		reps: 12,
		rest: {
			minutes: 1,
			seconds: 30,
		},
		notes: '',
	},
	{
		id: '2',
		name: 'Croci cavi alti',
		sets: 3,
		reps: 15,
		rest: {
			minutes: 1,
			seconds: 30,
		},
		notes: 'Concentrati sulla parte negativa del movimento',
	},
];
