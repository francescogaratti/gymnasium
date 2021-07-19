import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { SessionRecord } from '@models/workout';
import Chart from 'chart.js/auto';
import { data } from 'jquery';

@Component({
	selector: 'app-session-stats',
	templateUrl: './session-stats.component.html',
	styleUrls: ['./session-stats.component.sass'],
})
export class SessionStatsComponent implements OnInit {
	exChart: Chart = null;
	@Input() sessionRecords: SessionRecord[];
	constructor() {}

	ngOnInit(): void {}

	selIndex: number = null;

	//let selIndex = this.sessionRecords.length - 1

	computeVolume(sessionRecord: SessionRecord): number {
		let volume = 0;
		// todo: distinguish between Cardio and Weight
		sessionRecord.exercises.forEach(exercise => {
			exercise.weights.forEach(w => (volume += w));
		});
		return volume;
	}

	// createProgressiveLine() {
	// 	const data = [];
	// 	console.info(this.sessionRecords);
	// 	this.sessionRecords.forEach(session => data.push(this.computeVolume(session)));

	// 	const totalDuration = 10000;
	// 	const delayBetweenPoints = totalDuration / data.length;
	// 	const previousY = ctx =>
	// 		ctx.index === 0
	// 			? ctx.chart.scales.y.getPixelForValue(100)
	// 			: ctx.chart
	// 					.getDatasetMeta(ctx.datasetIndex)
	// 					.data[ctx.index - 1].getProps(['y'], true).y;
	// 	const animation = {
	// 		x: {
	// 			type: 'number',
	// 			easing: 'linear',
	// 			duration: delayBetweenPoints,
	// 			from: NaN, // the point is initially skipped
	// 			delay(ctx) {
	// 				if (ctx.type !== 'data' || ctx.xStarted) {
	// 					return 0;
	// 				}
	// 				ctx.xStarted = true;
	// 				return ctx.index * delayBetweenPoints;
	// 			},
	// 		},
	// 		y: {
	// 			type: 'number',
	// 			easing: 'linear',
	// 			duration: delayBetweenPoints,
	// 			from: previousY,
	// 			delay(ctx) {
	// 				if (ctx.type !== 'data' || ctx.yStarted) {
	// 					return 0;
	// 				}
	// 				ctx.yStarted = true;
	// 				return ctx.index * delayBetweenPoints;
	// 			},
	// 		},
	// 	};

	// 	const config = {
	// 		type: 'line',
	// 		data: {
	// 			datasets: [
	// 				{
	// 					borderColor: 'red',
	// 					borderWidth: 1,
	// 					radius: 0,
	// 					data: data,
	// 				},
	// 			],
	// 		},
	// 		options: {
	// 			animation: animation,
	// 			interaction: {
	// 				intersect: false,
	// 			},
	// 			plugins: {
	// 				legend: false,
	// 			},
	// 			scales: {
	// 				x: {
	// 					type: 'linear',
	// 				},
	// 			},
	// 		},
	// 	};

	// 	let chart = new Chart(
	// 		(document.getElementById('progressive-line') as HTMLCanvasElement).getContext('2d'),
	// 		config
	// 	);
	// }

	createRadarBodyParts() {
		const labels = this.sessionRecords.map(session => session.date + ' - ' + session.length);
		const volumes = [];
		this.sessionRecords.forEach(session => volumes.push(this.computeVolume(session)));

		// const labels = ['A', 'B', 'C', 'D', 'E'];
		const data = {
			labels: labels,
			datasets: [
				{
					label: 'Dataset 1',
					data: volumes,
					borderColor: 'red',
				},
			],
		};
		const config = {
			type: 'radar',
			data: data,
			options: {
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: 'Chart.js Radar Chart',
					},
				},
			},
		};

		let chart = new Chart(
			(document.getElementById('radar-body-parts') as HTMLCanvasElement).getContext('2d'),
			config
		);
	}

	// BUONINA

	createLineChart() {
		// !!! dividere create da update chart

		this.selIndex = this.sessionRecords.length - 1;

		let datasets = [];

		const datasetsColors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange'];
		for (let i = 0; i < this.sessionRecords[this.selIndex].exercises.length; i++) {
			datasets.push({
				tension: 0.2,
				label: this.sessionRecords[this.selIndex].exercises[i].name,
				data: this.sessionRecords[this.selIndex].exercises[i].weights,
				backgroundColor: 'rgba(100,0,0,0.5)',
				borderColor: datasetsColors[i % datasetsColors.length],
			});
		}

		// this.sessionRecords[this.selIndex].exercises.forEach(exercise => {
		// 	datasets.push({
		// 		tension: 0.2,
		// 		label: exercise.name,
		// 		data: exercise.weights,
		// 		backgroundColor: 'rgba(100,0,0,0.5)',
		// 		borderColor: datasetsColors[Math.floor(Math.random() * 6)],
		// 	});
		// });

		this.exChart = new Chart('workoutChart', {
			type: 'line',
			data: {
				labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				datasets: datasets,
			},
			options: {
				scales: {
					y: {
						beginAtZero: false,
					},
				},
			},
		});
		console.info(this.sessionRecords[this.selIndex]);
		console.info(this.selIndex);
	}

	updateChart() {
		let datasets = [];
		const datasetsColors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange'];

		for (let i = 0; i < this.sessionRecords[this.selIndex].exercises.length; i++) {
			datasets.push({
				tension: 0.2,
				label: this.sessionRecords[this.selIndex].exercises[i].name,
				data: this.sessionRecords[this.selIndex].exercises[i].weights,
				backgroundColor: 'rgba(100,0,0,0.5)',
				borderColor: datasetsColors[i % datasetsColors.length],
			});
		}

		// this.sessionRecords[this.selIndex].exercises.forEach(exercise => {
		// 	datasets.push({
		// 		tension: 0.2,
		// 		label: exercise.name,
		// 		data: exercise.weights,
		// 		backgroundColor: 'rgba(100,0,0,0.5)',
		// 		borderColor: datasetsColors[Math.floor(Math.random() * 6)],
		// 	});
		// });

		this.exChart.data.datasets = datasets;

		//this.exChart.data.datasets[this.selIndex].data = datasets;

		this.exChart.update();
		console.log(this.selIndex);
		console.log('updateee');
		console.info(this.exChart.data.datasets[0].data);
	}

	addSelIndex() {
		this.selIndex = this.selIndex + 1;
		this.updateChart();
	}
	subtrSelIndex() {
		this.selIndex = this.selIndex - 1;
		this.updateChart();
	}
}
