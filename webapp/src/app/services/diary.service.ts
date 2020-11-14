import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Diary } from '@models/diary';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class DiaryService {
	// actual diary
	diary$: Subject<Diary> = new Subject<Diary>(); // future diary
	private diary: Diary = null;
	// all the diaries
	diaries$: Subject<Diary[]> = new Subject<Diary[]>();
	private diaries: Diary[] = null;

	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar

  constructor(private afs: AngularFirestore) {}
  
  // *** READ ***
  /**
	 *
	 * @param id diary id
	 */
	public async readDiary(id: string): Promise<Diary> {
		if (this.diary) return this.diary;
		console.info('📘 - read diary ' + id);
		this.asyncOperation.next(true);
		this.diary = await this.afs
			.collection('diaries')
			.doc(id)
			.get()
			.toPromise()
			.then(snapshot => snapshot.data() as Diary)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.diary$.next(this.diary);
		this.asyncOperation.next(false);
		return this.diary;
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

	async newDiary(diary: Diary): Promise<string> {
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

	async updateDiary(diary: Diary, deepCopy?: boolean): Promise<boolean> {
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

	public getDiary(): Diary {
		return this.diary ? this.diary : null;
	}

	public isDiary(): boolean {
		return this.diary ? true : false;
	}

	public getDiarys(): Diary[] {
		return this.diaries ? this.diaries : [];
	}
}
