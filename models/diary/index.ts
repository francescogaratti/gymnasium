export enum Periods {
	days = 'Giorni',
	weeks = 'Settimane',
	months = 'Mesi',
	years = 'Anni',
}
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

	clientId: string;
	clientName: string;
	// birthDay: string;
	// source:string; // ! no idea what this is

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
	injuries: string[];
	drugs: string[];
	diet: string;
	notes: string;
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
	clientData: DiaryClientData;
	fitCheck: FitCheck;
	trainingChecks: TrainingCheck[];
	date: string;
	consultantId: string;
	consultantName: string;
}

export const clientData: DiaryClientData = {
	subscription: '',
	club: '',
	dateStart: '',
	trainerId: '',
	trainerName: '',

	clientId: '',
	clientName: '',

	jobType: '',
	alreadyAttended: false,

	experiences: '', // ? select from list
	duration: {
		value: 3,
		period: Periods.weeks,
	},
	frequency: {
		value: 3,
		period: Periods.weeks,
	},

	achieved: false,
	achievedNotes: '',

	goal: '',

	timeToAchieve: {
		value: 3,
		period: Periods.weeks,
	},
	keepGoal: false,

	when: '',
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
	injuries: [],
	drugs: [],
	diet: 'mangio molte proteine e poca verdura',
	notes: 'note aggiuntive del trainer',
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

		nextTrainingCheckDate: '',
		nextTrainingWorkoutDate: '',

		motivation: 8,
		satisfaction: 7,
	},
];

export const diary: Diary = {
	clientData: clientData,
	fitCheck: fitCheck,
	trainingChecks: trainingChecks,
	date: '01-01-2020',
	consultantId: '0123456789',
	consultantName: 'Andrea Meggiolaro',
};
