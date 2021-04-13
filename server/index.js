const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send(`<h1>ultra-gymnasium Node.js server on heroku</h1>`);
});

app.listen(PORT, () => {
	console.log(`ultra-gymnasium listening at http://localhost:${PORT}`);
});
