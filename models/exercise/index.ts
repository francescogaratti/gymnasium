export interface Rest {
	minutes: number | null;
	seconds: number | null;
}

export interface Exercise {
	id: string | null;
	name: string | null;
	sets: number | null;
	reps: number | null;
	rest: Rest;
	notes?: string | null;
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

export enum ExerciseCategories {
	petto = 'Petto',
	schiena = 'Schiena',
	cardio = 'Cardio',
}

export interface ExerciseEntry {
	name: string;
	category: string;
}
