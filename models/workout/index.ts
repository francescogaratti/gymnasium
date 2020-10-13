import { Client } from '@models/client';
import {Exercise} from "@models/exercise";
import { Trainer } from '@models/trainer';
export interface Workout {
	id: string;
	exercises:Exercise[];
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
