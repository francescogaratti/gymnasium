import { Trainer } from '../trainer';
export interface Workout {
	id: string;
	startDate: Date;
	trainer: Trainer;
}
