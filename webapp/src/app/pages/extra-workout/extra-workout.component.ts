import { FIRST_MEDIA } from '@angular/cdk/keycodes';
import { FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
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
import { Workout } from '@models/workout';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { first } from 'rxjs/operators';

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
	esercizi = mockExWeights;
	selected_exercise = null;
	maxPercentage: number = null;
	massimale: number = null;

	// ! valoriCalcolati: questo se messo a "null" dà problemi nell'html,
	// ! assicurarsi di mettere un controllino in modo che non vada in errore
	valoriCalcolati: number[] = [];

	esercizioFormControl: FormControl = new FormControl('', [Validators.required]);

	displayedColumns: string[] = [
		'Max',
		'2 reps',
		'4 reps',
		'6 reps',
		'8 reps',
		'10 reps',
		'12 reps',
		'15 reps',
	];
	dataSource = [];

	last_workout: Workout = null;

	constructor(private auth: AuthService, private userService: UserService) {
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

						/**
						 * * *** INSERT MAGIC CODE HERE ***
						 */
						// this.last_workout.sessions.forEach(session => {
						// 	session.records.forEach(record => {
						// 		record.exercises.forEach(exercise => {
						// 			console.info(exercise);
						// 		});
						// 	});
						// });

						let lastWorkExs = [];

						let allStime = [];
						let allExIds = [];

						function calcolaStima() {
							for (let i = 0; i < lastWorkExs.length; i++) {
								let lastWorkWeights = lastWorkExs[i].weights;
								let wSum = 0;
								for (let i = 0; i < lastWorkWeights.length; i++)
									wSum += lastWorkWeights[i];
								let exStima = { id: null, wStima: null, name: null };
								exStima.wStima = Math.round(wSum / lastWorkWeights.length);
								exStima.id = lastWorkExs[i].id;
								exStima.name = lastWorkExs[i].name;
								allStime.push(exStima);
								allExIds.push(lastWorkExs[i].id);
							}
						}
						this.last_workout.sessions[1].records.forEach(record => {
							for (let i = 0; i < record.exercises.length; i++) {
								lastWorkExs.push(record.exercises[i]);
							}
						});

						calcolaStima();

						let uniqueIds = [...new Set(allExIds)];
						let firstEx = [];
						let secondEx = [];
						let thirdEx = [];

						allStime.forEach(st => {
							if (st.id == uniqueIds[0]) {
								firstEx.push(st);
							}
							if (st.id == uniqueIds[1]) {
								secondEx.push(st);
							}
							if (st.id == uniqueIds[2]) {
								thirdEx.push(st);
							}
						});

						let firstMedia = null;
						let sum = null;

						for (let i = 0; i < firstEx.length; i++) {
							sum += firstEx[i].wStima;
							firstMedia = sum / firstEx.length;
						}

						console.info(firstMedia);
					}
				})

				.catch(err => console.error(err));
		});
	}

	ngOnInit(): void {}

	selectExercise(exercise) {
		this.selected_exercise = exercise;
		this.dataSource = mockExWeights;
		this.calculateMassimale(exercise.weight, exercise.reps);
	}

	// ? ho cambiato nome a questa funzione per renderla più "parlante", cioè con un nome più evocativo
	resetExercise() {
		this.selected_exercise = null;
		this.dataSource = [];
		this.esercizioFormControl.setValue(null);
	}

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

	calculateMassimale(weight: number, reps: number) {
		let perc = this.repsToPerc(reps);
		let max = Math.round((weight * 100) / perc);
		let percentuali = [60, 65, 70, 75, 80, 85, 90];
		let percResult = [];

		percentuali.forEach(p => {
			let v = (weight * p) / perc;
			percResult.push(Math.round(v));
		});

		this.massimale = max;
		this.valoriCalcolati = percResult;

		console.info(this.valoriCalcolati);
		console.info(this.massimale);
	}
}
