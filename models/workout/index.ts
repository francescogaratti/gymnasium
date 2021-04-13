import { Exercise, ExerciseRecord } from '../exercise';
export interface Workout {
	id: string;
	name: string;

	creationDate: string;

	userId: string;
	userName: string;

	startingDate: string;
	endingDate: string;

	sessions: WorkoutSession[];
	state?: string;
}

export enum WorkoutStates {
	started = 'started',
	paused = 'paused',
	stopped = 'stopped',
}

/**
 * @interface SessionRecord
 * @param length the duration in seconds of the workout session
 * @param date the day when the workout session is done
 * @param exercises list of exercises recorded
 * @param notes notes (optional)
 */
export interface SessionRecord {
	length: number;
	date: string;
	exercises: ExerciseRecord[];
	notes?: string;
}

export class SessionRecord implements SessionRecord {
	constructor(session: WorkoutSession) {
		this.length = 0;
		this.date = new Date().toLocaleDateString();

		this.exercises = [];
		session.exercises.forEach(exercise => this.exercises.push(new ExerciseRecord(exercise)));

		this.notes = null;
	}
}

/**
 * @interface WorkoutSession
 * @param name identifier of the workout session
 * @param exercises list of exercises for the session
 * @param history
 * @param notes notes (optional)
 */
export interface WorkoutSession {
	name: string;
	exercises: Exercise[];
	records: SessionRecord[];
	notes?: string;
}

export class WorkoutSession implements WorkoutSession {
	constructor() {
		this.name = '';
		this.exercises = [];
		this.records = [];
		this.notes = null;
	}
}

export const standard: Workout = {
	id: '',
	name: 'Primo Allenamento Test',
	creationDate: '01-01-2000',
	userId: '',
	userName: '',
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
					time: null,
					type: 'Weight',
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
					time: null,
					type: 'Weight',
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
					time: null,
					type: 'Weight',
				},
			],
			notes: 'Petto + Bicipiti',
			records: [],
		},
		{
			name: 'Allenamento B',
			exercises: [
				{
					id: null,
					name: 'Trazioni',
					type: 'Weight',
					sets: 5,
					reps: 8,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: null,
				},
				{
					id: null,
					name: 'Pulley',
					type: 'Weight',
					sets: 3,
					reps: 12,
					rest: {
						minutes: 1,
						seconds: 30,
					},
					notes: null,
					time: null,
				},
				{
					id: null,
					name: 'French press',
					type: 'Weight',
					sets: 5,
					reps: 10,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: null,
				},
			],
			notes: 'Schiena + Tricipiti',
			records: [],
		},
		{
			name: 'Allenamento C',
			exercises: [
				{
					id: null,
					name: 'Squat',
					type: 'Weight',
					sets: 5,
					reps: 8,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: null,
				},
				{
					id: null,
					name: 'Leg curl',
					type: 'Weight',
					sets: 3,
					reps: 12,
					rest: {
						minutes: 1,
						seconds: 30,
					},
					notes: null,
					time: null,
				},
				{
					id: null,
					name: 'Military',
					type: 'Weight',
					sets: 5,
					reps: 8,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: null,
				},
				{
					id: null,
					name: 'Alzate laterali',
					type: 'Weight',
					sets: 3,
					reps: 12,
					rest: {
						minutes: 1,
						seconds: 30,
					},
					notes: null,
					time: null,
				},
			],
			notes: 'Gambe + Spalle',
			records: [],
		},
	],
};

export const starterUomo: Workout = {
	id: '',
	name: 'Starter - Uomo',
	creationDate: '',
	userId: '',
	userName: '',
	startingDate: '',
	endingDate: '',
	sessions: [
		{
			name: 'Allenamento A',
			exercises: [
				{
					id: null,
					name: 'Corsa',
					type: 'Cardio',
					sets: 0,
					time: 10,
					reps: null,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Addominali',
					type: 'Weight',
					sets: 10,
					reps: 20,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: null,
				},
				{
					id: null,
					name: 'Chest press',
					type: 'Weight',
					sets: 5,
					reps: 12,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: null,
				},
				{
					id: null,
					name: 'Lat machine',
					type: 'Weight',
					sets: 5,
					reps: 12,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: null,
				},
			],
			notes: 'Cardio + parte alta',
			records: [],
		},
		{
			name: 'Allenamento B',
			exercises: [
				{
					id: null,
					name: 'Corsa',
					type: 'Cardio',
					sets: 0,
					reps: null,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: 10,
				},
				{
					id: null,
					name: 'Addominali',
					type: 'Weight',
					sets: 10,
					reps: 20,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: null,
				},
				{
					id: null,
					name: 'Leg extension',
					type: 'Weight',
					sets: 5,
					reps: 12,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: null,
				},
				{
					id: null,
					name: 'Leg curl',
					type: 'Weight',
					sets: 5,
					reps: 12,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: null,
				},
			],
			notes: 'Cardio + parte bassa',
			records: [],
		},
	],
};

export const starterDonna: Workout = {
	id: '',
	name: 'Starter - Donna',
	creationDate: '',
	userId: '',
	userName: '',
	startingDate: '',
	endingDate: '',
	sessions: [
		{
			name: 'Allenamento A',
			exercises: [
				{
					id: null,
					name: 'Corsa',
					type: 'Cardio',
					sets: 0,
					reps: null,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: 10,
				},
				{
					id: null,
					name: 'Addominali',
					type: 'Weight',
					sets: 10,
					reps: 20,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: null,
				},
				{
					id: null,
					name: 'Bag squat',
					type: 'Weight',
					sets: 5,
					reps: 12,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
					time: null,
				},
			],
			notes: 'Cardio + squat',
			records: [],
		},
		{
			name: 'Allenamento B',
			exercises: [
				{
					id: null,
					name: 'Corsa',
					type: 'Cardio',
					sets: 0,
					time: 10,
					reps: null,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
				{
					id: null,
					name: 'Addominali',
					type: 'Weight',
					sets: 10,
					time: null,
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
					type: 'Weight',
					sets: 5,
					time: null,
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
					type: 'Weight',
					sets: 5,
					time: null,
					reps: 12,
					rest: {
						minutes: 2,
						seconds: 0,
					},
					notes: null,
				},
			],
			notes: 'Cardio + parte bassa',
			records: [],
		},
	],
};
