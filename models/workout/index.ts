import { Exercise, LiveExercise } from '../exercise';
export interface Workout {
	id: string;
	name: string;

	creationDate: string;

	clientId: string;
	clientName: string;

	trainerId: string;
	trainerName: string;

	startingDate: string;
	endingDate: string;
}

export interface DigitalWorkout extends Workout {
	sessions: WorkoutSession[];
}

export enum WorkoutStates {
	started = 'started',
	paused = 'paused',
	stopped = 'stopped',
}
export interface LiveWorkout extends DigitalWorkout {
	sessions: WorkoutSession[];
	state: string;
}

export interface StandardWorkout extends Workout {
	filePath: string;
}

export interface History {
	length: number;
	date: string;
	notes: string;
	exercises: LiveExercise[];
}

export interface WorkoutSession {
	name: string;
	exercises: Exercise[];
	notes: string;
	history: History[];
}

export const standard: DigitalWorkout = {
	id: '',
	name: 'Primo Allenamento Test',
	creationDate: '01-01-2000',
	clientId: '',
	clientName: '',
	trainerId: '',
	trainerName: '',
	startingDate: '01-01-2000',
	endingDate: '01-01-2000',
	sessions: [
		{
			name: 'Allenamento A',
			exercises: [
				{
					id: null,
					name: 'Panca piana',
					sets: 5,
					reps: 8,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Croci cavi alti',
					sets: 3,
					reps: 12,
					rest: {
						minutes: 1,
						seconds: 30,
					},
					notes: 'controlla negative',
				},
				{
					id: null,
					name: 'Curl bicipiti',
					sets: 5,
					reps: 10,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
			],
			notes: 'Petto + Bicipiti',
			history: [],
		},
		{
			name: 'Allenamento B',
			exercises: [
				{
					id: null,
					name: 'Trazioni',
					sets: 5,
					reps: 8,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Pulley',
					sets: 3,
					reps: 12,
					rest: {
						minutes: 1,
						seconds: 30,
					},
					notes: null,
				},
				{
					id: null,
					name: 'French press',
					sets: 5,
					reps: 10,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
			],
			notes: 'Schiena + Tricipiti',
			history: [],
		},
		{
			name: 'Allenamento C',
			exercises: [
				{
					id: null,
					name: 'Squat',
					sets: 5,
					reps: 8,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Leg curl',
					sets: 3,
					reps: 12,
					rest: {
						minutes: 1,
						seconds: 30,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Military',
					sets: 5,
					reps: 8,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Alzate laterali',
					sets: 3,
					reps: 12,
					rest: {
						minutes: 1,
						seconds: 30,
					},
					notes: null,
				},
			],
			notes: 'Gambe + Spalle',
			history: [],
		},
	],
};

export const starterUomo: DigitalWorkout = {
	id: '',
	name: 'Starter - Uomo',
	creationDate: '',
	clientId: '',
	clientName: '',
	trainerId: '',
	trainerName: '',
	startingDate: '',
	endingDate: '',
	sessions: [
		{
			name: 'Allenamento A',
			exercises: [
				{
					id: null,
					name: 'Corsa',
					sets: 0,
					reps: 0,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Addominali',
					sets: 10,
					reps: 20,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Chest press',
					sets: 5,
					reps: 12,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Lat machine',
					sets: 5,
					reps: 12,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
			],
			notes: 'Cardio + parte alta',
			history: [],
		},
		{
			name: 'Allenamento B',
			exercises: [
				{
					id: null,
					name: 'Corsa',
					sets: 0,
					reps: 0,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Addominali',
					sets: 10,
					reps: 20,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Leg extension',
					sets: 5,
					reps: 12,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Leg curl',
					sets: 5,
					reps: 12,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
			],
			notes: 'Cardio + parte bassa',
			history: [],
		},
	],
};

export const starterDonna: DigitalWorkout = {
	id: '',
	name: 'Starter - Donna',
	creationDate: '',
	clientId: '',
	clientName: '',
	trainerId: '',
	trainerName: '',
	startingDate: '',
	endingDate: '',
	sessions: [
		{
			name: 'Allenamento A',
			exercises: [
				{
					id: null,
					name: 'Corsa',
					sets: 0,
					reps: 0,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Addominali',
					sets: 10,
					reps: 20,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Bag squat',
					sets: 5,
					reps: 12,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
			],
			notes: 'Cardio + squat',
			history: [],
		},
		{
			name: 'Allenamento B',
			exercises: [
				{
					id: null,
					name: 'Corsa',
					sets: 0,
					reps: 0,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Addominali',
					sets: 10,
					reps: 20,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Leg extension',
					sets: 5,
					reps: 12,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Leg curl',
					sets: 5,
					reps: 12,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
			],
			notes: 'Cardio + parte bassa',
			history: [],
		},
	],
};
