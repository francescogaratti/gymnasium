import { Client } from '@models/client';
import { Trainer } from '@models/trainer';
export interface Workout {
	id: string;
	startingDate: string;
	endingDate: string;
	trainer: Trainer;
}

export interface WorkoutOld {
	id: string;
	startingDate: string;
	endingDate: string;
	trainerId: string;
	clientId: string;
	fileId: string;
}

export class WorkoutOld implements WorkoutOld{}
