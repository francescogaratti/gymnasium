export interface Rest {
	minutes: number | null;
	seconds: number | null;
}

export enum ExerciseType {
	cardio = 'Cardio',
	weight = 'Weight',
}

export enum ExerciseCategories {
	abs = 'Abs',
	biceps = 'Biceps',
	cardio = 'Cardio',
	legs = 'Legs',
	chest = 'Chest',
	back = 'Back',
	shoulders = 'Shoulders',
	triceps = 'Triceps',
}

export interface ExerciseEntry {
	id: string | null;
	name: string;
	type: string;
	description?: string;
	category?: string;
	authorId?: string;
}

export class ExerciseEntry implements ExerciseEntry {
	constructor(
		id: string,
		name: string,
		type: string,
		description?: string,
		category?: string,
		authorId?: string
	) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.description = description || null;
		this.category = category || null;
		this.authorId = authorId || null;
	}
}

export interface Exercise extends ExerciseEntry {
	sets: number | null;
	rest: Rest;
	sets_max?: boolean;
	notes?: string | null;
	// cardio
	time: number | null;
	time_max?: boolean | null;
	// weight
	reps: number | null;
	reps_max?: boolean | null;
}

export interface ExerciseRecord {
	id: string | null; // unique id shared with "Exercise"
	name: string | null; // description
	type: string; // cardio / weight
	sets: number | null; // number of sets
	rest: Rest;
	currentSet: number | null; // keeps track of the current set
	weights: number[] | null; // one value for each set
	durations: number[] | null; // one value for each set
	notes?: string | null;
}

export class ExerciseRecord implements ExerciseRecord {
	constructor(exercise: Exercise) {
		this.id = exercise.id;
		this.name = exercise.name;
		this.type = exercise.type;
		this.sets = exercise.sets;
		this.rest = exercise.rest;
		this.currentSet = 0;
		this.weights = null;
		this.durations = null;
		if (this.type == ExerciseType.cardio) this.durations = [];
		else this.weights = [];

		this.notes = null;
	}
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
		this.time = null;
		this.reps = null;
	}
}

export const mock: Exercise[] = [
	{
		id: '0',
		name: 'Panca piana',
		type: 'Weight',
		sets: 5,
		reps: 10,
		rest: {
			minutes: 2,
			seconds: 0,
		},
		notes: '',
		time: null,
	},
	{
		id: '1',
		name: 'Spinte panca 30°',
		type: 'Weight',
		sets: 3,
		reps: 12,
		rest: {
			minutes: 1,
			seconds: 30,
		},
		notes: '',
		time: null,
	},
	{
		id: '2',
		name: 'Croci cavi alti',
		type: 'Weight',
		sets: 3,
		reps: 15,
		rest: {
			minutes: 1,
			seconds: 30,
		},
		notes: 'Concentrati sulla parte negativa del movimento',
		time: null,
	},
];
