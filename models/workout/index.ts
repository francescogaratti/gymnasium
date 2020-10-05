import { Client } from '@models/client';
import { Trainer } from '@models/trainer';
export interface Workout {
	id: string;
	startingDate: string;
	endingDate: string;
	trainer: Trainer;
	client: Client;
}