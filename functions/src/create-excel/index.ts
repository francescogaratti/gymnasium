/** firebase */
import * as functions from 'firebase-functions';
import firebase = require('firebase');
/** extra dependencies */
// import 'excel4node';
/** models */
import { Workout } from '../../../models/workout';
import { Rest } from '../../../models/exercise';

const xl = require('excel4node');

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

		const filename = workout.name + '.xlsx';
		res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
		res.setHeader('Access-Control-Allow-Origin', '*');

		const wb = createWorkbook(workout);
		wb.write(filename, res, function (err: any, stats: any) {
			if (err) {
				console.error(err);
			} else {
				res.send();
			}
		});
	}
);

export function createWorkbook(workout: Workout) {
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
	ws.cell(2, 2).string(workout.userName);
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
				.string(exercise.notes ? exercise.notes : '')
				.style({ font: { italics: true } });
			rowIndex++;
		});
		// hop 2 lines to better spaced view
		rowIndex += 2;
	});
	return wb;
}

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

export const convertDiary = functions.https.onRequest(
	async (req: functions.https.Request, res: functions.Response<ArrayBuffer>) => {
		// const id: string = String(req.query['diaryId']);
		// if (!id) res.send(undefined);

		// const diary: Diary | null = await firebase
		// 	.firestore()
		// 	.collection('diaries')
		// 	.doc(id)
		// 	.get()
		// 	.then(snapshot => snapshot.data() as Diary)
		// 	.catch(err => {
		// 		console.error(err);
		// 		return null;
		// 	});
		// // ! if something went wrong == > exit
		// if (!diary) {
		// 	res.send(undefined);
		// 	return;
		// }
		// // ? now I have the diary to work with

		// const filename = 'diario.xlsx';
		// res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
		// res.setHeader('Access-Control-Allow-Origin', '*');

		// const wb = createDiaryWorkbook(diary);
		// wb.write(filename, res, function (err: any, stats: any) {
		// 	if (err) {
		// 		console.error(err);
		// 	} else {
		// 		res.send();
		// 	}
		// });
		res.send(undefined);
	}
);

// function createDiaryWorkbook(diary: Diary) {
// 	const wb = new xl.Workbook();
// 	// *** first worksheet for diary info + client data
// 	const ws_info = wb.addWorksheet('Info Diario');
// 	let row = 1;
// 	// -------------- basic info
// 	// date
// 	ws_info
// 		.cell(row, 1)
// 		.string('Data creazione')
// 		.style({ font: { bold: true } });
// 	ws_info.cell(row, 2).date(new Date(diary.date)).style({ numberFormat: 'dd/mm/yyyy' });
// 	row++;
// 	// client name
// 	ws_info
// 		.cell(row, 1)
// 		.string('Cliente')
// 		.style({ font: { bold: true } });
// 	ws_info.cell(row, 2).string(diary.clientName);
// 	row++;
// 	// consultant name
// 	ws_info
// 		.cell(row, 1)
// 		.string('Consulente')
// 		.style({ font: { bold: true } });
// 	ws_info.cell(row, 2).string(diary.consultantName);
// 	row++;
// 	// notes
// 	ws_info
// 		.cell(row, 1)
// 		.string('Note')
// 		.style({ font: { bold: true } });
// 	ws_info.cell(row, 2).string(diary.notes);
// 	row++;

// 	// ------------- client data
// 	row++;

// 	// subscription
// 	ws_info
// 		.cell(row, 1)
// 		.string('Abbonamento')
// 		.style({ font: { bold: true } });
// 	ws_info.cell(row, 2).string(diary.clientData.subscription);

// 	// club
// 	ws_info
// 		.cell(row, 3)
// 		.string('Club')
// 		.style({ font: { bold: true } });
// 	ws_info.cell(row, 4).string(diary.clientData.club);

// 	// dateStart
// 	ws_info
// 		.cell(row, 5)
// 		.string('Data inizio')
// 		.style({ font: { bold: true } });
// 	ws_info
// 		.cell(row, 6)
// 		.date(new Date(diary.clientData.dateStart))
// 		.style({ numberFormat: 'dd/mm/yyyy' });

// 	// trainerName
// 	ws_info
// 		.cell(row, 7)
// 		.string('Istruttore')
// 		.style({ font: { bold: true } });
// 	ws_info.cell(row, 8).string(diary.clientData.trainerName);

// 	row++;

// 	// jobType
// 	ws_info
// 		.cell(row, 1)
// 		.string('Tipo di lavoro')
// 		.style({ font: { bold: true } });
// 	ws_info.cell(row, 2).string(diary.clientData.jobType);
// 	// alreadyAttended
// 	ws_info
// 		.cell(row, 3)
// 		.string('Hai già frequentato il club')
// 		.style({ font: { bold: true } });
// 	ws_info.cell(row, 4).string(diary.clientData.alreadyAttended ? 'Sì' : 'No');

// 	row++;

// 	// experiences
// 	ws_info
// 		.cell(row, 1)
// 		.string('Esperienze sportive')
// 		.style({ font: { bold: true } });
// 	ws_info.cell(row, 2).string(diary.clientData.experiences);
// 	// duration
// 	ws_info
// 		.cell(row, 3)
// 		.string('Durata')
// 		.style({ font: { bold: true } });
// 	ws_info
// 		.cell(row, 4)
// 		.string(
// 			diary.clientData.duration
// 				? diary.clientData.duration.value + ' ' + diary.clientData.duration.period
// 				: ''
// 		);
// 	// frequency
// 	ws_info
// 		.cell(row, 5)
// 		.string('Frequenza')
// 		.style({ font: { bold: true } });
// 	ws_info
// 		.cell(row, 6)
// 		.string(
// 			diary.clientData.frequency
// 				? diary.clientData.frequency.value + '/' + diary.clientData.frequency.period
// 				: ''
// 		);

// 	row++;

// 	// achieved + achievedNotes
// 	ws_info
// 		.cell(row, 1)
// 		.string("Hai raggiunto l'obiettivo che ti eri prefissato")
// 		.style({ font: { bold: true } });
// 	ws_info
// 		.cell(row, 2)
// 		.string((diary.clientData.achieved ? 'Sì' : 'No') + ' - ' + diary.clientData.achievedNotes);

// 	row++;

// 	// goal
// 	ws_info
// 		.cell(row, 1)
// 		.string('Obiettivo attuale')
// 		.style({ font: { bold: true } });
// 	ws_info.cell(row, 2).string(diary.clientData.goal);

// 	row++;

// 	// timeToAchieve
// 	ws_info
// 		.cell(row, 1)
// 		.string("In quanto tempo pensi di raggiungere l'attuale obiettivo")
// 		.style({ font: { bold: true } });
// 	ws_info
// 		.cell(row, 2)
// 		.string(
// 			diary.clientData.timeToAchieve
// 				? diary.clientData.timeToAchieve.value + ' ' + diary.clientData.timeToAchieve.period
// 				: ''
// 		);
// 	// keepGoal
// 	ws_info
// 		.cell(row, 3)
// 		.string('Vuoi mantenerlo')
// 		.style({ font: { bold: true } });
// 	ws_info.cell(row, 4).string(diary.clientData.keepGoal ? 'Sì' : 'No');

// 	row++;

// 	// when
// 	ws_info
// 		.cell(row, 1)
// 		.string('Quando vuoi iniziare')
// 		.style({ font: { bold: true } });
// 	ws_info
// 		.cell(row, 2)
// 		.date(new Date(diary.clientData.when))
// 		.style({ numberFormat: 'dd/mm/yyyy' });
// 	// trainingRange
// 	ws_info
// 		.cell(row, 3)
// 		.string('In che orari')
// 		.style({ font: { bold: true } });
// 	ws_info
// 		.cell(row, 4)
// 		.string(
// 			diary.clientData.trainingRange
// 				? diary.clientData.trainingRange.start +
// 						' - ' +
// 						diary.clientData.trainingRange.finish
// 				: ''
// 		);
// 	// trainingFrequency
// 	ws_info
// 		.cell(row, 5)
// 		.string('Quante volte alla settimana')
// 		.style({ font: { bold: true } });
// 	ws_info
// 		.cell(row, 6)
// 		.string(diary.clientData.trainingFrequency ? diary.clientData.trainingFrequency.value : '');

// 	// *** second worksheet => fit check
// 	const ws_fit_check = wb.addWorksheet('Fit Check');
// 	row = 1;
// 	if (diary.fitCheck) {
// 		// healthStatus
// 		ws_fit_check
// 			.cell(row, 1)
// 			.string('Condizioni di salute')
// 			.style({ font: { bold: true } });
// 		ws_fit_check.cell(row, 2).string(diary.fitCheck.healthStatus);

// 		row++;

// 		// height
// 		ws_fit_check
// 			.cell(row, 1)
// 			.string('Altezza')
// 			.style({ font: { bold: true } });
// 		ws_fit_check.cell(row, 2).number(diary.fitCheck.height);
// 		// weight
// 		ws_fit_check
// 			.cell(row, 3)
// 			.string('Peso')
// 			.style({ font: { bold: true } });
// 		ws_fit_check.cell(row, 4).number(diary.fitCheck.weight);
// 		// smoker
// 		ws_fit_check
// 			.cell(row, 5)
// 			.string('Fumatore')
// 			.style({ font: { bold: true } });
// 		ws_fit_check.cell(row, 6).string(diary.fitCheck.smoker ? 'Sì' : 'No');

// 		row++;

// 		// injuries
// 		ws_fit_check
// 			.cell(row, 1)
// 			.string('Eventuali infortuni')
// 			.style({ font: { bold: true } });
// 		ws_fit_check.cell(row, 2).string(diary.fitCheck.injuries);
// 		// drugs
// 		ws_fit_check
// 			.cell(row, 3)
// 			.string('Farmaci assunti')
// 			.style({ font: { bold: true } });
// 		ws_fit_check.cell(row, 4).string(diary.fitCheck.drugs);

// 		row++;

// 		// diet
// 		ws_fit_check
// 			.cell(row, 1)
// 			.string('Dieta')
// 			.style({ font: { bold: true } });
// 		ws_fit_check.cell(row, 2).string(diary.fitCheck.diet);
// 	} // ! no fit check => print warning message
// 	else ws_fit_check.cell(row, 1).string('Non sono stati inseriti i dati del fitchek.');

// 	// *** third worksheet => training checks
// 	const ws_training_checks = wb.addWorksheet('Verifiche di Allenamento');
// 	row = 1;
// 	if (diary.trainingChecks && diary.trainingChecks.length > 0) {
// 		let i = 0; // training checks counter
// 		// ? loop over
// 		diary.trainingChecks.forEach((check: TrainingCheck) => {
// 			ws_training_checks
// 				.cell(row, 1)
// 				.string('Verifica Allenamento n° ' + (i + 1))
// 				.style({ font: { bold: true } });

// 			row++;
// 			// date
// 			ws_training_checks
// 				.cell(row, 1)
// 				.string('Data')
// 				.style({ font: { bold: true } });
// 			ws_training_checks
// 				.cell(row, 2)
// 				.date(new Date(check.date))
// 				.style({ numberFormat: 'dd/mm/yyyy' });
// 			// trainingFrequency
// 			ws_training_checks
// 				.cell(row, 3)
// 				.string('Quante volte ti alleni alla settimana')
// 				.style({ font: { bold: true } });
// 			ws_training_checks
// 				.cell(row, 4)
// 				.number(check.trainingFrequency ? check.trainingFrequency.value : '');

// 			row++;

// 			// goal
// 			ws_training_checks
// 				.cell(row, 1)
// 				.string('Obiettivo')
// 				.style({ font: { bold: true } });
// 			ws_training_checks.cell(row, 2).string(check.goal);

// 			row++;

// 			// test
// 			ws_training_checks
// 				.cell(row, 1)
// 				.string('Test')
// 				.style({ font: { bold: true } });
// 			ws_training_checks.cell(row, 2).string(check.test);

// 			row++;

// 			// goalConsiderations
// 			ws_training_checks
// 				.cell(row, 1)
// 				.string("Considerazioni rispetto all'obiettivo")
// 				.style({ font: { bold: true } });
// 			ws_training_checks.cell(row, 2).string(check.goalConsiderations);

// 			row++;

// 			// goalFeelings
// 			ws_training_checks
// 				.cell(row, 1)
// 				.string("Come ti senti rispetto all'inizio")
// 				.style({ font: { bold: true } });
// 			ws_training_checks.cell(row, 2).string(check.goalFeelings);

// 			row++;

// 			// goalFavorites
// 			ws_training_checks
// 				.cell(row, 1)
// 				.string('Cosa ti è piaciuto di più della scheda di allenamento')
// 				.style({ font: { bold: true } });
// 			ws_training_checks.cell(row, 2).string(check.goalFavorites);

// 			row++;

// 			// nextTrainingCheckDate
// 			ws_training_checks
// 				.cell(row, 1)
// 				.string('Data prossima verifica di allenamento')
// 				.style({ font: { bold: true } });
// 			ws_training_checks
// 				.cell(row, 2)
// 				.date(new Date(check.nextTrainingCheckDate ? check.nextTrainingCheckDate : ''))
// 				.style({ numberFormat: 'dd/mm/yyyy' });

// 			row++;

// 			// nextTrainingWorkoutDate
// 			ws_training_checks
// 				.cell(row, 1)
// 				.string('Programmazione nuova scheda di allenamento')
// 				.style({ font: { bold: true } });
// 			ws_training_checks
// 				.cell(row, 2)
// 				.date(new Date(check.nextTrainingWorkoutDate ? check.nextTrainingWorkoutDate : ''))
// 				.style({ numberFormat: 'dd/mm/yyyy' });

// 			row++;

// 			// motivation
// 			ws_training_checks
// 				.cell(row, 1)
// 				.string('Motivazione')
// 				.style({ font: { bold: true } });
// 			ws_training_checks.cell(row, 2).string(check.motivation + '/10');
// 			// satisfaction
// 			ws_training_checks
// 				.cell(row, 3)
// 				.string('Soddisfazione')
// 				.style({ font: { bold: true } });
// 			ws_training_checks.cell(row, 4).string(check.satisfaction + '/10');

// 			i++; // count
// 			row++;
// 			row++;
// 		});
// 	}
// 	// ! no training checks => print warning message
// 	else
// 		ws_training_checks.cell(row, 1).string('Non sono state inserite verifiche di allenamento.');
// 	return wb;
// }
