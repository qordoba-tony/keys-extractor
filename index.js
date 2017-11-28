var express = require('express');
const retext = require('retext');
const keywords = require('retext-keywords');
const bodyParser = require('body-parser');
const toString = require('nlcst-to-string');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/convert', function(req, res) {
	console.log('REQUEST.BODY', req.body.text);
	const str = req.body.text;
	// const string = JSON.parse(req.body);
	retext()
		.use(keywords)
		.process(str, function(err, file) {
			console.log('KEYWORDS:');
			file.data.keywords.forEach(function(keyword) {
				console.log(toString(keyword.matches[0].node));
			});

			console.log();
			console.log('Key-phrases:');
			file.data.keyphrases.forEach(function(phrase) {
				console.log(phrase.matches[0].nodes.map(toString).join(''));
			});
		});

	res.send(str);
});

app.listen(3000, function() {
	console.log('Listening on port 3000');
});
