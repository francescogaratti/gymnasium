import * as functions from 'firebase-functions';
import firebase = require('firebase');

import 'excel4node';
import { DigitalWorkout } from '../../../models/workout';
import { Rest } from '../../../models/exercise';

export const generateExcel = functions.https.onRequest(
	async (req: functions.https.Request, res: functions.Response<ArrayBuffer>) => {
		const id: string = String(req.query['workoutId']);
		if (!id) res.send(undefined);

		const workout: DigitalWorkout | null = await firebase
			.firestore()
			.collection('workouts')
			.doc(id)
			.get()
			.then(snapshot => snapshot.data() as DigitalWorkout)
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
		const ws = wb.addWorksheet('Scheda di Allenamento');
		const exerciseColumnNames = ['Esercizio', 'Sets', 'Reps', 'Rest', 'Note'];
		// workout name
		ws.cell(1, 1)
			.string('Allenamento')
			.style({ font: { bold: true } });
		ws.cell(1, 2).string(workout.name);
		// client name
		ws.cell(2, 1)
			.string('Cliente')
			.style({ font: { bold: true } });
		ws.cell(2, 2).string(workout.clientName);
		// trainer name
		ws.cell(3, 1)
			.string('Istruttore')
			.style({ font: { bold: true } });
		ws.cell(3, 2).string(workout.trainerName);
		// Write date start + end
		ws.cell(1, 6)
			.string('Data Inizio')
			.style({ font: { bold: true } });
		ws.cell(1, 7).date(new Date(workout.startingDate)).style({ numberFormat: 'dd/mm/yyyy' });
		ws.cell(2, 6)
			.string('Data Fine')
			.style({ font: { bold: true } });
		ws.cell(2, 7).date(new Date(workout.endingDate)).style({ numberFormat: 'dd/mm/yyyy' });

		let rowIndex = 5;
		workout.sessions.forEach(session => {
			// write session info
			ws.cell(rowIndex, 1)
				.string(session.name)
				.style({ font: { bold: true } });
			ws.cell(rowIndex, 2).string(session.notes);
			// next row
			rowIndex++;
			// write exercises columns
			let headingColumnIndex = 1;
			exerciseColumnNames.forEach(heading => {
				ws.cell(rowIndex, headingColumnIndex++)
					.string(heading)
					.style({ font: { bold: true } });
			});
			// next row
			rowIndex++;
			// write list of exercises
			session.exercises.forEach(exercise => {
				ws.cell(rowIndex, 1).string(exercise.name);
				ws.cell(rowIndex, 2).number(exercise.sets);
				ws.cell(rowIndex, 3).number(exercise.reps);
				ws.cell(rowIndex, 4).string(restToString(exercise.rest));
				ws.cell(rowIndex, 5)
					.string(exercise.notes)
					.style({ font: { italics: true } });
				rowIndex++;
			});
			// hop 2 lines to better spaced view
			rowIndex += 2;
		});

		const filename = workout.name + '.xlsx';
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
