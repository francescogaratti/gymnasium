enum Periods {
	days = 'Giorni',
	weeks = 'Settimane',
	months = 'Mesi',
	years = 'Anni',
}
interface Frequency {
	value: number;
	period: string;
}

interface Range {
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

	experiences: string[]; // ? select from list
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
