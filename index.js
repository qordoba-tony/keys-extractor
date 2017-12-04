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
	// const str = String(req.body.text);
	const str = 'BLAH BLAH BLAH BLAH';
	const otherStr = req.body.text;
	let conversion = {
		keywords: [],
		keyphrases: []
	};
	// const string = JSON.parse(req.body);
	retext()
		.use(keywords)
		.process(otherStr, function(err, file) {
			// console.log('KEYWORDS:', file);
			file.data.keywords.forEach(function(keyword) {
				// console.log('KEYWORD:', keyword);
				// console.log('CONVERSION: ', conversion);
				console.log(toString(keyword.matches[0].node));
				let current = 0;
				if (keyword.matches[0]) {
					conversion.keywords.push(toString(keyword.matches[0].node));
					current += 1;
				}
			});

			// console.log('Key-phrases:');
			file.data.keyphrases.forEach(function(phrase) {
				console.log(phrase.matches[0].nodes.map(toString).join(''));
				conversion.keyphrases.push(phrase.matches[0].nodes.map(toString).join(''));
			});
		});
	// console.log('CONVERSION', conversion);

	// Iterate through oject values and make values lower case
	const objKeys = Object.keys(conversion);

	objKeys.forEach(key => {
		let newArray = [];
		conversion[key].forEach((str) => {
			// console.log(str.toLowerCase());
			newArray.push(str.toLowerCase());
		})
		conversion[key] = newArray;
	})

	let minFiveResults = {
		keywords: null,
		keyphrases: null,
	};

	console.log('CONVERSION', conversion);

	if (conversion.keywords.length > 5) {
		conversion.keywords = conversion.keywords.slice(conversion.keywords.length - 5, conversion.keywords.length);
		// console.log('MIN FIVE RESULTS', minFiveResults);
	}

	res.send(conversion);
});

const port = process.env.PORT || 8080;

app.listen(port, function() {
	console.log('Please navigate to http://localhost:8080');
});
