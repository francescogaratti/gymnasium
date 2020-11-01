import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Trainer } from '@models/user';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TrainerService {
	// actual trainer
	trainer$: Observable<Trainer> = new Observable<Trainer>(); // future trainer
	private trainer: Trainer;
	// all the clients
	trainers$: Observable<Trainer[]> = new Observable<Trainer[]>();
	private trainers: Trainer[] = [];

	asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar

	constructor(private afs: AngularFirestore) {
		// store the trainer here
		this.trainer$.subscribe((trainer: Trainer) => (this.trainer = trainer));
		// store all the clients here
		this.trainers$.subscribe((trainers: Trainer[]) => (this.trainers = trainers));
	}

	public async readTrainer(id: string) {
		this.asyncOperation.next(true);
		console.info('📘 - read trainer ' + id);
		this.trainer$ = await this.afs
			.collection('trainers')
			.doc(id)
			.get()
			.toPromise()
			.then(snapshot => of(snapshot.data() as Trainer))
			.catch(err => {
				console.error(err);
				return of(null);
			});
		this.asyncOperation.next(false);
	}
}
