import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Trainer } from '@models/user';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TrainerService {
	// actual trainer
	trainer$: Subject<Trainer> = new Subject<Trainer>(); // future trainer
	private trainer: Trainer;
	// all the trainers
	trainers$: Subject<Trainer[]> = new Subject<Trainer[]>();
	private trainers: Trainer[] = [];

	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar

	constructor(private afs: AngularFirestore) {
		// store the trainer here
		this.trainer$.subscribe((trainer: Trainer) => (this.trainer = trainer));
		// store all the trainers here
		this.trainers$.subscribe((trainers: Trainer[]) => (this.trainers = trainers));
	}

	public async readTrainer(id: string): Promise<Trainer> {
		this.asyncOperation.next(true);
		console.info('📘 - read trainer ' + id);
		this.trainer = await this.afs
			.collection('trainers')
			.doc(id)
			.get()
			.toPromise()
			.then(snapshot => snapshot.data() as Trainer)
			.catch(err => {
				console.error(err);
				return null;
			});
		this.trainer$.next(this.trainer);
		this.asyncOperation.next(false);
		return this.trainer;
	}

	public async readTrainers(): Promise<Trainer[]> {
		if (this.trainers) return this.trainers;
		console.info('📘 - read trainers');
		this.asyncOperation.next(true);
		this.trainers = await this.afs
			.collection('trainers')
			.get()
			.toPromise()
			.then(snapshot => {
				let values: Trainer[] = [];
				snapshot.forEach(doc => values.push(doc.data() as Trainer));
				return values;
			})
			.catch(err => {
				console.error(err);
				return [];
			});
		this.trainers$.next(this.trainers);
		this.asyncOperation.next(false);
		return this.trainers;
	}
}
