const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.send(`<h1>ultra-gymnasium Node.js server on heroku</h1>`);
});

app.listen(port, () => {
	console.log(`ultra-gymnasium listening at http://localhost:${port}`);
});
