export enum Periods {
	days = 'Giorni',
	weeks = 'Settimane',
	months = 'Mesi',
	years = 'Anni',
}

export enum Frequencies {
	day = 'Giorno',
	week = 'Settimana',
	month = 'Mese',
	year = 'Anno',
}

export const TimeRanges: string[] = [
	'7:00',
	'8:00',
	'9:00',
	'10:00',
	'11:00',
	'12:00',
	'13:00',
	'14:00',
	'15:00',
	'16:00',
	'17:00',
	'18:00',
	'19:00',
	'20:00',
	'21:00',
	'22:00',
];

export interface Frequency {
	value: number;
	period: string;
}

export interface Range {
	start: string;
	finish: string;
}

export interface DiaryClientData {
	subscription: string;
	club: string;
	dateStart: string;
	trainerId: string;
	trainerName: string;

	// clientId: string; // ! this field belongs to the parent interface
	// clientName: string; // ! this field belongs to the parent interface

	jobType: string; // todo: select from enum
	alreadyAttended: boolean;

	experiences: string;
	duration: Frequency;
	frequency: Frequency;

	achieved: boolean;
	achievedNotes: string;

	goal: string;

	timeToAchieve: Frequency;
	keepGoal: boolean;

	when: string;
	trainingRange: Range;
	trainingFrequency: Frequency;
}

export interface FitCheck {
	healthStatus: string;
	height: number;
	weight: number;
	smoker: boolean;
	injuries: string;
	drugs: string;
	diet: string;
}

export interface TrainingCheck {
	date: string;
	trainingFrequency: Frequency;
	goal: string;
	test: string;

	goalConsiderations: string;
	goalFeelings: string;
	goalFavorites: string;

	nextTrainingCheckDate?: string;
	nextTrainingWorkoutDate?: string;

	motivation: number;
	satisfaction: number;
}

export interface Diary {
	uid: string;
	clientId: string;
	clientName: string;
	clientData: DiaryClientData;
	fitCheck: FitCheck;
	trainingChecks: TrainingCheck[];
	date: string;
	consultantId: string;
	consultantName: string;
	notes: string;
}

export const clientData: DiaryClientData = {
	subscription: 'Annuale',
	club: 'Test',
	dateStart: '10-10-2010',
	trainerId: '1234567890',
	trainerName: 'Trainer Test',

	jobType: 'Test job',
	alreadyAttended: false,

	experiences: 'No exp.', // ? select from list
	duration: {
		value: 3,
		period: Periods.weeks,
	},
	frequency: {
		value: 3,
		period: Periods.weeks,
	},

	achieved: false,
	achievedNotes: 'Test note',

	goal: 'Il mio obiettivo è avere obiettivi',

	timeToAchieve: {
		value: 3,
		period: Periods.weeks,
	},
	keepGoal: false,

	when: '03-03-2020',
	trainingRange: {
		start: '',
		finish: '',
	},
	trainingFrequency: {
		value: 3,
		period: Periods.weeks,
	},
};

export const fitCheck: FitCheck = {
	healthStatus: 'buona salute',
	height: 181,
	weight: 77,
	smoker: false,
	injuries: 'rotto un polso',
	drugs: 'niente',
	diet: 'mangio molte proteine e poca verdura',
};

export const trainingChecks: TrainingCheck[] = [
	{
		date: '01-01-2000',
		trainingFrequency: {
			value: 1,
			period: Periods.weeks,
		},
		goal: 'Diventare più grosso',
		test: 'Vediamo se sei grosso',

		goalConsiderations: 'considerazioni',
		goalFeelings: 'sentimenti',
		goalFavorites: 'cosa ti è piaciuto di più',

		nextTrainingCheckDate: '02-02-2002',
		nextTrainingWorkoutDate: '03-03-2003',

		motivation: 8,
		satisfaction: 7,
	},
];

export const diary: Diary = {
	uid: '',
	clientId: '',
	clientName: '',
	clientData: clientData,
	fitCheck: fitCheck,
	trainingChecks: trainingChecks,
	date: '01-01-2020',
	consultantId: '0123456789',
	consultantName: 'Andrea Meggiolaro',
	notes: 'note aggiuntive del consulente',
};
