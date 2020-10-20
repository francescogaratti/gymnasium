import { Exercise } from '../exercise';
// import { Trainer } from '../trainer';
export interface Workout {
	id: string;
	name: string;
	clientId: string;
	exercises: Exercise[];
	trainer: string;
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
