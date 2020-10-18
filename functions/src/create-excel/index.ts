import * as functions from 'firebase-functions';
import firebase = require('firebase');

import 'excel4node';
import { Workout } from '../../../models/workout';
import { Rest } from '../../../models/exercise';

export const generateExcel = functions.https.onRequest(
	async (req: functions.https.Request, res: functions.Response<ArrayBuffer>) => {
		const id: string = String(req.query['workoutId']);
		if (!id) res.send(undefined);

		const workout: Workout | null = await firebase
			.firestore()
			.collection('workouts')
			.doc(id)
			.get()
			.then(snapshot => snapshot.data() as Workout)
			.catch(err => {
				console.error(err);
				return null;
			});
		// if something went wrong == > exit
		if (!workout) {
			res.send(undefined);
			return;
		}
		// now I have the workout to work with
		const xl = require('excel4node');
		const wb = new xl.Workbook();
		const ws = wb.addWorksheet('Allenamento');
		const headingColumnNames = ['Esercizio', 'Sets', 'Reps', 'Rest', 'Note'];
		// Write trainer name
		ws.cell(1, 1).string('Trainer');
		ws.cell(1, 2).string(workout.trainer);
		// Write date
		ws.cell(2, 1).string('Data');
		ws.cell(2, 2).date(new Date()).style({ numberFormat: 'dd/mm/yyyy' });
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
			// rest
			ws.cell(rowIndex, 4).string(restToString(exercise.rest));
			ws.cell(rowIndex, 5).string(exercise.notes);
			rowIndex++;
		});

		const filename = 'workout.xlsx';
		res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
		res.setHeader('Access-Control-Allow-Origin', '*');
		wb.write(filename, res, function (err: any, stats: any) {
			if (err) {
				console.error(err);
			} else {
				res.send();
			}
		});
	}
);

function restToString(rest: Rest): string {
	if (!rest || (!rest.minutes && !rest.seconds)) return '-';
	else {
		let res = '';
		// add the minutes
		res += rest.minutes ? rest.minutes + "' " : '';
		// add the seconds
		res += rest.seconds ? rest.seconds + '"' : '';
		return res;
	}
}
