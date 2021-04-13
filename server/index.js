const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send(`<h1>ultra-gymnasium Node.js server on heroku</h1>`);
});

app.get('/workouts', (req, res) => {
	let workouts = [
		{
			name: 'workout1',
			date: '12/03/2021',
		},
		{
			name: 'workout2',
			date: '13/04/2021',
		},
	];
	res.send(workouts);
});

app.listen(PORT, () => {
	console.log(`ultra-gymnasium listening at http://localhost:${PORT}`);
});
