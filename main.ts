import express from 'express'

const app = express();

app.use(express.static('public'))

var server = app.listen(3000, function () {

	console.log(`Example app listening at http://localhost:3000`);
});
