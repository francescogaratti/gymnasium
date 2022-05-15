import { Component, Input, OnInit } from '@angular/core';
import { SessionRecord } from '@models/workout';

interface HistoryEntry {
	exercise: string;
	sets: number;
	set1: number;
	set2: number;
	set3: number;
	set4: number;
	set5: number;
}

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.sass'],
})
export class HistoryComponent implements OnInit {
	@Input() sessionRecords: SessionRecord[];
	displayedColumns: string[] = ['exercise', 'set1', 'set2', 'set3', 'set4', 'set5'];
	history: HistoryEntry[] = [];
	history_index: number = 0;

	MAX_NUMBER_OF_SETS = 5;

	constructor() {}

	ngOnInit(): void {
		this.selectHistory();
	}

	nextHistory() {
		this.history_index += 1;
		this.selectHistory();
	}

	prevHistory() {
		this.history_index -= 1;
		this.selectHistory();
	}

	selectHistory() {
		this.history = [];
		this.sessionRecords[this.history_index].exercises.forEach(exercise => {
			let weights = [];
			let sets = exercise.weights.length;
			for (let i = 0; i < sets; i++) weights.push(exercise.weights[i]);
			// fill up if missing
			for (let i = sets; i < this.MAX_NUMBER_OF_SETS; i++) weights.push(null);

			this.history.push({
				exercise: exercise.name,
				sets: exercise.sets,
				set1: weights[0],
				set2: weights[1],
				set3: weights[2],
				set4: weights[3],
				set5: weights[4],
			});
		});
	}
}
