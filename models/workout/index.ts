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
	exercises: Exercise[];
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

export interface WorkoutOld {
	id: string;
	startingDate: string;
	endingDate: string;
	trainerId: string;
	clientId: string;
	fileId: string;
}

export class WorkoutOld implements WorkoutOld {}
