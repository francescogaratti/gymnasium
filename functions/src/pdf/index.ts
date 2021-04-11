/** firebase */
import * as functions from 'firebase-functions';
// import firebase = require('firebase');
/** models */
// import { Diary } from '../../../models/diary';
/** extra dependencies */
// import getStream = require('get-stream');
// import pdfkit = require('pdfkit');

/** models */
export const generatePDF = functions.https.onRequest(
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
		// ! if something went wrong == > exit
		// if (!diary) {
		// 	res.send(undefined);
		// 	return;
		// }
		// now I have the diary to work with
		// const doc: PDFKit.PDFDocument = new pdfkit();

		// Embed a font, set the font size, and render some text
		// doc.font('assets/fonts/FiraCode-Light.ttf')
		// 	.fontSize(20)
		// 	.text('Diario di ' + diary.clientName, 75, 100)
		// 	.fontSize(12)
		// 	.text('Questo è il tuo diario di allenamento in formato PDF', 75, 200)
		// 	.text('Si posso aggiungere molte righe facilmente tenendo un margine fisso', 75, 220);

		// doc.end();

		// res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
		// res.setHeader('Access-Control-Allow-Origin', '*');
		// res.send(await getStream.buffer(doc));

		// ! for compatibility
		res.send(undefined);
	}
);
