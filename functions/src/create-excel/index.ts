import * as functions from 'firebase-functions';
// import { Exercise } from '../../../models/exercise';
import { Workout } from '../../../models/workout';
import 'excel4node';

// export const createExcel = functions.https.onRequest((request, response) => {
// 	const id = '0001';
// 	const clientId = '012345';
// 	const trainer = 'Davide Ghiotto';
// 	const mock: Exercise[] = [
// 		{
// 			id: '0',
// 			name: 'Panca piana',
// 			sets: 5,
// 			reps: 10,
// 			rest: {
// 				minutes: 2,
// 				seconds: 0,
// 			},
// 			notes: '',
// 		},
// 		{
// 			id: '1',
// 			name: 'Spinte panca 30°',
// 			sets: 3,
// 			reps: 12,
// 			rest: {
// 				minutes: 1,
// 				seconds: 30,
// 			},
// 			notes: '',
// 		},
// 		{
// 			id: '2',
// 			name: 'Croci cavi alti',
// 			sets: 3,
// 			reps: 15,
// 			rest: {
// 				minutes: 1,
// 				seconds: 30,
// 			},
// 			notes: 'Concentrati sulla parte negativa del movimento',
// 		},
// 	];

// 	const workout: Workout = {
// 		id: id,
// 		clientId: clientId,
// 		trainer: trainer,
// 		exercises: mock,
// 	};

// 	// console.info(workout);

// 	const xl = require('excel4node');
// 	const wb = new xl.Workbook();
// 	const ws = wb.addWorksheet('Allenamento Id ' + workout.id);

// 	const headingColumnNames = ['Esercizio', 'Sets', 'Reps', 'Rest', 'Note'];

// 	// Write trainer name
// 	ws.cell(1, 1).string('Trainer');
// 	ws.cell(1, 2).string(workout.trainer);

// 	// Write date
// 	ws.cell(2, 1).string('Data');
// 	ws.cell(2, 2).date(new Date()).style({ numberFormat: 'yyyy/mm/dd' });

// 	//Write Column Title in Excel file
// 	let headingColumnIndex = 1;
// 	headingColumnNames.forEach(heading => {
// 		ws.cell(3, headingColumnIndex++)
// 			.string(heading)
// 			.style({ font: { bold: true } });
// 	});

// 	//Write Data in Excel file
// 	// let rowIndex = 2;
// 	// data.forEach( record => {
// 	//     let columnIndex = 1;
// 	//     Object.keys(record).forEach(columnName =>{
// 	//         ws.cell(rowIndex,columnIndex++)
// 	//             .string(String(record[columnName]))
// 	//     });
// 	//     rowIndex++;
// 	// });
// 	let rowIndex = 4;
// 	workout.exercises.forEach(exercise => {
// 		ws.cell(rowIndex, 1).string(exercise.name);
// 		ws.cell(rowIndex, 2).number(exercise.sets);
// 		ws.cell(rowIndex, 3).number(exercise.reps);
// 		ws.cell(rowIndex, 4).string(
// 			exercise.rest.minutes +
// 				(exercise.rest.seconds > 0 ? "' " + exercise.rest.seconds + '"' : "'")
// 		);
// 		ws.cell(rowIndex, 5).string(exercise.notes);
// 		rowIndex++;
// 	});
// 	wb.write('workout.xlsx');

// 	response.send();
// });

export const createExcel = functions.https.onCall(
	(data: { workout: Workout }, context?: functions.https.CallableContext) => {
		const workout: Workout = data.workout;
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
		let res: any = {};
		wb.write('workout.xlsx', res);

		return { data: res };
	}
);
