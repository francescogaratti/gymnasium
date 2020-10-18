import * as functions from 'firebase-functions';
import { Workout } from '../../../models/workout';
import 'excel4node';
import * as firebase from 'firebase/app';
const firebaseConfig = {
	apiKey: 'AIzaSyAX-eB7XUbfgRKxpq3y4nFnSkF2-iBv2Wk',
	authDomain: 'ultra-gymnasium.firebaseapp.com',
	databaseURL: 'https://ultra-gymnasium.firebaseio.com',
	projectId: 'ultra-gymnasium',
	storageBucket: 'ultra-gymnasium.appspot.com',
	messagingSenderId: '13160087679',
	appId: '1:13160087679:web:636c78361cf50f78773f4a',
	measurementId: 'G-N3YW5GFN8D',
};
firebase.initializeApp(firebaseConfig);
const mock: Workout = {
	id: 'test0',
	clientId: 'clientidtest',
	exercises: [],
	trainer: 'test',
};

export const getExcelBuffer = functions.https.onCall(
	(data: { workout: Workout }, context?: functions.https.CallableContext) => {
		const workout: Workout = data.workout ? data.workout : mock;
		const xl = require('excel4node');
		const wb = new xl.Workbook();
		const ws = wb.addWorksheet('Allenamento Id ' + workout.id);

		const headingColumnNames = ['Esercizio', 'Sets', 'Reps', 'Rest', 'Note'];

		// Write trainer name
		ws.cell(1, 1).string('Trainer');
		ws.cell(1, 2).string(workout.trainer);

		// Write date
		ws.cell(2, 1).string('Data');
		ws.cell(2, 2).date(new Date()).style({ numberFormat: 'yyyy/mm/dd' });

		//Write Column Title in Excel file
		let headingColumnIndex = 1;
		headingColumnNames.forEach(heading => {
			ws.cell(3, headingColumnIndex++)
				.string(heading)
				.style({ font: { bold: true } });
		});

		let rowIndex = 4;
		workout.exercises.forEach(exercise => {
			ws.cell(rowIndex, 1).string(exercise.name);
			ws.cell(rowIndex, 2).number(exercise.sets);
			ws.cell(rowIndex, 3).number(exercise.reps);
			if (exercise.rest && exercise.rest.seconds)
				ws.cell(rowIndex, 4).string(
					exercise.rest.minutes +
						(exercise.rest.seconds > 0 ? "' " + exercise.rest.seconds + '"' : "'")
				);
			ws.cell(rowIndex, 5).string(exercise.notes);
			rowIndex++;
		});
		return wb
			.writeToBuffer()
			.then((buffer: any) => {
				console.info(buffer);
				return buffer;
			})
			.catch((err: any) => {
				return err;
			});
	}
);
