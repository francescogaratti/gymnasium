import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Diary } from '@models/diary';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class DiaryService {
	// all the diaries
	diaries$: Subject<Diary[]> = new Subject<Diary[]>();
	private diaries: Diary[] = null;

	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar

	constructor(private afs: AngularFirestore, private http: HttpClient) {}

	// *** READ ***
	/**
	 *
	 * @param id diary id
	 */
	public async readUserDiary(id: string): Promise<Diary> {
		console.info('📘 - read diary ' + id);
		this.asyncOperation.next(true);
		let diary: Diary = await this.afs
			.collection('diaries')
			.doc(id)
			.get()
			.toPromise()
			.then(snapshot => snapshot.data() as Diary)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return diary;
	}

	public async readDiarys(): Promise<Diary[]> {
		if (this.diaries) return this.diaries;
		console.info('📘 - read diaries');
		this.asyncOperation.next(true);
		this.diaries = await this.afs
			.collection('diaries')
			.get()
			.toPromise()
			.then(snapshot => {
				let values: Diary[] = [];
				snapshot.forEach(doc => values.push(doc.data() as Diary));
				return values;
			})
			.catch(err => {
				console.error(err);
				return [];
			});
		this.diaries$.next(this.diaries);
		this.asyncOperation.next(false);
		return this.diaries;
	}

	// *** POST ***

	async newUserDiary(diary: Diary): Promise<string> {
		this.asyncOperation.next(true);
		console.info('📗 - write');
		let res: string = await this.afs
			.collection('diaries')
			.add(diary)
			.then(async (docRef: DocumentReference) => docRef.id)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async updateUserDiary(diary: Diary, deepCopy?: boolean): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📗 - update diary');
		let res: boolean = await this.afs
			.collection('diaries')
			.doc(diary.uid)
			.set(deepCopy ? JSON.parse(JSON.stringify(diary)) : diary, { merge: true })
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	async downloadExcel(filename: string, diaryId: string): Promise<boolean> {
		this.asyncOperation.next(true);
		// some costants & params
		const generateExcelURL: string =
			'http://localhost:5001/ultra-gymnasium/us-central1/excel-diary';
		const requestOptions: Object = {
			params: { diaryId: diaryId },
			responseType: 'arrayBuffer',
		};
		// http request
		let res: boolean = await this.http
			.get<any>(generateExcelURL, requestOptions)
			.toPromise()
			.then((res: ArrayBuffer) => {
				const link = document.createElement('a');
				link.style.display = 'none';
				document.body.appendChild(link);

				const blob = new Blob([res]);
				const objectURL = URL.createObjectURL(blob);

				link.href = objectURL;
				link.href = URL.createObjectURL(blob);
				link.download = filename;
				link.click();
				return true;
			})
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	// *** DELETE ***

	async deleteDiary(id: string): Promise<boolean> {
		this.asyncOperation.next(true);
		console.info('📕 - delete');
		let res: boolean = await this.afs
			.collection('diaries')
			.doc(id)
			.delete()
			.then(() => true)
			.catch(err => {
				console.error(err);
				return false;
			});
		this.asyncOperation.next(false);
		return res;
	}

	// *** GETTER / SETTER ***
}
