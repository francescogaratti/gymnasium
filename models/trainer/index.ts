import { User } from '@models/user';
import { Employee } from '../employee';
import { Client } from '../client';
export interface Trainer extends Employee {
	trainees: Client[];
}
