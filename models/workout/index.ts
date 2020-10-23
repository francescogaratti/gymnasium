import { Exercise } from '../exercise';
export interface Workout {
	id: string;
	name: string;

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

export interface StandardWorkout extends Workout {
	filePath: string;
}

export interface WorkoutSession {
	name: string;
	exercises: Exercise[];
	notes: string;
}

export const mock: DigitalWorkout = {
	id: null,
	name: 'Primo Allenamento Test',
	clientId: null,
	clientName: null,
	trainerId: null,
	trainerName: null,
	startingDate: null,
	endingDate: null,
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
		},
	],
};
