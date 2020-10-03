import { Shift } from '../shift';

export enum EmployeeType {
	Trainer = 'Trainer',
	Receptionist = 'Receptionist',
	Manager = 'Manager',
}

export interface Employee {
	id: string;
	displayName: string;
	type: string;
	shifts: Shift[];
}
