import { NullTemplateVisitor } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
	ExerciseEntry,
	Exercise,
	ExerciseCategories,
	ExerciseType,
	mock,
	ExerciseRecord,
} from '@models/exercise';
import { User } from '@models/user';
import { Workout, WorkoutSession } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const mockExWeights = [
	{
		name: 'panca',
		id: '000',
		weight: 50,
		reps: 6,
	},
	{
		name: 'leg curl',
		id: '001',
		weight: 80,
		reps: 8,
	},
	{
		name: 'tricipiti',
		id: '002',
		weight: 35,
		reps: 10,
	},
];

@Component({
	selector: 'app-extra-workout',
	templateUrl: './extra-workout.component.html',
	styleUrls: ['./extra-workout.component.sass'],
})
export class ExtraWorkoutComponent implements OnInit {
	user: User = null;

	// ! valoriCalcolati: questo se messo a "null" dà problemi nell'html,
	// ! assicurarsi di mettere un controllino in modo che non vada in errore
	valoriCalcolati: number[] = [];
	listResults: any[] = [];

	displayedColumns: string[] = [
		'Exercise',
		'15 reps',
		'12 reps',
		'10 reps',
		'8 reps',
		'6 reps',
		'4 reps',
		'2 reps',
		'Max',
	];
	dataSource = [];

	last_workout: Workout = null;

	constructor(
		private auth: AuthService,
		private userService: UserService,
		private utils: UtilsService
	) {
		this.userService.readUser(this.auth.getUser().uid).then(user => {
			this.user = user;
			this.auth
				.readUserWorkouts(this.user)
				.then((workouts: Workout[]) => {
					if (workouts && workouts.length > 0) {
						workouts.sort((w1, w2) =>
							new Date(w1.endingDate) >= new Date(w2.endingDate) ? 1 : -1
						);
						this.last_workout = workouts[workouts.length - 1]; // questo prende l'ultimo
						this.computePredictions(this.last_workout);
						// TODO ***********************************
						// TODO qui ora hai l'ultimo workout (quello che ci interessa per dire, poi magari sarà diversa la logica)
						/**
						 * la cosa da fare è ottenere lo storico di tutte le sessioni di allenamento per poter
						 * calcolare quello che adesso è mockExWeights
						 * Per farlo avrai bisogno di andare a prenderti, per ogni sessione, i relativi storici (session records)
						 * e per ogni session record prendere gli esercizi e organizzarli in una lista nuova
						 * come mockExWeights. La difficoltà sta appunto nel creare questa lista e anche capire come
						 * calcolare il peso medio delle ultime serie fatte in queste stesse session records per quello specifico esercizio
						 * Per esempio:
						 * - workout con 3 sessioni
						 * - ogni sessione con 5 session records
						 * - ogni session con 3 esercizi
						 * Praticamente devi stimare i pesi per 3x3 esercizi utilizzando però 5 serie temporali distinte
						 * Ancora più pratico:
						 * Ex: Session A
						 * - Data 1
						 * 	- esercizio 1 / 5 serie / 5 colpi --> pesi: [1,2,3,4,5] x5 colpi --> stima data1/esercizio1 = (1+2+3+4+5)/5 = 2.5 x5 colpi
						 *  - esercizio 2 / 3 serie / 6 colpi --> pesi: [2,2,3] x6 colpi --> stima data1/esercizio2 = (2+2+3)/3 = 2.33 x6 colpi
						 *  - esercizio 3 / 4 serie / 10 colpi --> pesi: [1,1,5,5] x10 colpi --> stima data1/esercizio3 = (1+1+5+5)/4 = 3 x10 colpi
						 * - Data 2
						 * 	- esercizio 1 / 5 serie / 5 colpi  --> pesi: [2,2,2,2,2] x5 colpi --> stima data2/esercizio1 = (2+2+2+2+2)/5 = 2 x5 colpi
						 *  - esercizio 2 / 3 serie / 6 colpi --> pesi: [2,2,5] x6 colpi --> stima data2/esercizio2 = (2+2+5)/3 = 3 x6 colpi
						 *  - esercizio 3 / 4 serie / 10 colpi --> pesi: [5,5,5,5] x10 colpi --> stima data2/esercizio3 = (5+5+5+5)/4 = 5 x10 colpi
						 * - Data 3
						 * 	- esercizio 1 / 5 serie / 5 colpi  --> pesi: [4,4,3,4,5] x5 colpi --> ecc...
						 *  - esercizio 2 / 3 serie / 6 colpi --> pesi: [2,4,3] x6 colpi --> ecc..
						 *  - esercizio 3 / 4 serie / 10 colpi --> pesi: [3,4,5,6] x10 colpi --> ecc..
						 * - Data 4
						 * ... ecc
						 * - Data 5
						 * ... ecc
						 *
						 * Una volta calcolate, per ogni esercizio, tutte le stime per ogni session records (per ogni data che ha fatto quell'esercizio)
						 * Allora potrai fare una "media delle medie" di questo tipo:
						 * - stima esercizio1 = ( data1/esercizio1 + data2/esercizio1 + data3/esercizio1 + ... + dataN/esercizio1) / N ==> peso medio / x5 colpi
						 * - stima esercizio2 = ( data1/esercizio2 + data2/esercizio2 + data3/esercizio2 + ... + dataN/esercizio2) / N ==> peso medio / x6 colpi
						 * - ecc...
						 *
						 * E quando hai le stime di tutti gli esercizi hai finito perchè ti basta ricreare
						 * la stessa struttura che stai utilizzando adesso per mockExWeights dove al posto
						 * di "weight" e "reps" ci metti quelle vere che hai appena calcolato per ogni esercizio
						 *
						 */
					}
				})
				.catch(err => {
					console.error(err);
					this.utils.openSnackBar(
						'Something went wrong!😵',
						'Better check the console 👉',
						5000
					);
				});
		});
	}

	// todo: estendi questa funzione in modo che utilizzi tutti i workout, da sempre (poi mettiamo il filtro data)
	computePredictions(workout: Workout) {
		let allStime = {};
		let results = {};
		workout.sessions.forEach(session => {
			session.records.forEach(session_record => {
				session_record.exercises.forEach(exercise => {
					let reps = session.exercises.find(ex => ex.id == exercise.id).reps; // todo: change later
					// abbiamo già sia le reps che l'id dell'esercizio
					results[exercise.id] = {
						name: exercise.name,
						weight: 0,
						reps: reps,
					};
					// ? creiamo le serie di medie degli esercizi per ogni sessione
					let wSum = 0;
					exercise.weights.forEach(weight => (wSum += weight));

					if (!allStime[exercise.id]) allStime[exercise.id] = [];
					allStime[exercise.id].push(Math.round(wSum / exercise.weights.length));
				});
			});
		});

		// ? questo non cambia se uso uno o più workout

		Object.keys(allStime).forEach(id => {
			let sum = 0;
			allStime[id].forEach(el => (sum += el));
			results[id].weight = Math.round(sum / allStime[id].length);
			results[id].percentages = this.calculateMassimale(results[id].weight, results[id].reps);
		});

		this.listResults = [];
		Object.keys(results).forEach(id => {
			let entry = results[id];
			entry.id = id;
			this.listResults.push(entry);
		});

		console.info(results);
		console.info(this.listResults);
	}

	ngOnInit(): void {}

	// *** queste due funzioni non sono niente male! Bravo!
	// ? l'unica cosa è che quando le adatterai ai veri esercizi del database
	// ? ci saranno un po' di modifiche ma è normale
	// ? perchè praticamente dovrai prendere i dati non solo dagli esercizi prototipi
	// ? ma proprio dalle sessioni dei workout dell'utente attuale
	// ? per farlo ti preparo già il codice apposta che scarica le sessioni utenti dell'ultimo workout

	repsToPerc(reps: number) {
		let maxPercentage = null;
		if (reps == 2 || reps == 3) {
			maxPercentage = 90;
		} else if (reps == 4 || reps == 5) {
			maxPercentage = 85;
		} else if (reps == 6 || reps == 7) {
			maxPercentage = 80;
		} else if (reps == 8 || reps == 9) {
			maxPercentage = 75;
		} else if (reps == 10 || reps == 11) {
			maxPercentage = 70;
		} else if (reps == 12) {
			maxPercentage = 65;
		} else if (reps == 15) {
			maxPercentage = 60;
		} else {
			maxPercentage = 100;
		}
		return maxPercentage;
	}

	calculateMassimale(weight: number, reps: number): number[] {
		let perc = this.repsToPerc(reps);
		// let max = Math.round((weight * 100) / perc);
		let percentuali = [60, 65, 70, 75, 80, 85, 90, 100];
		let percResult = [];

		percentuali.forEach(p => {
			let v = (weight * p) / perc;
			percResult.push(Math.round(v));
		});

		// this.massimale = max;
		this.valoriCalcolati = percResult;

		// console.info(this.valoriCalcolati);
		// console.info(this.massimale);
		return this.valoriCalcolati;
	}
}
