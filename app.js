/*------CONFIG AND LIBRARIES------>*/

//Requiring express library
const express = require('express')
//Initialising express library
const app = express()

//Requiring body parser library
//This adds a body property to the request parameter of every app.get and app.post
const bodyParser = require('body-parser');
//Initialising body-parser li;brary
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())

//Setting PUG view engine
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

//Requiring file system library
var fs = require('fs');

/*------ROUTES-------*/

/*---HELPER FUNCTIONS---*/

fs.readFilePromise = function(path){
//return a new promise
	return new Promise (function(resolve, reject){
		fs.readFile(path, 'utf-8', function(err, contents){
		if(err){
		return reject(err);
		}
	 	//otherwise, resolve the promise with the file contents
		resolve(contents);
		});
	});
}

/*---LANDING PAGE TO SEE FORM -->*/

app.get('/', function(req,res){
	
	fs.readFilePromise('bookmarks.json')
		.then(function(fileContents){
		var olddatabase = JSON.parse(fileContents);
		console.log(olddatabase);
		res.render("index", {olddatabase: olddatabase});
		});	
});

app.post('/',function(req,res){

	//Receving new input
	var newdatabaseinput= [];

	var inputname = req.body.name;
	var inputurl = req.body.url;
	var inputtag = req.body.tags;

	var multipletags = inputtag.split(",");
	// var test = JSON.parse(multipletags);
	// console.log('--->TEST: '+test);

	newdatabaseinput.push({
		inputname,
		inputurl,
		multipletags
	})

	console.log('New database input: '+JSON.stringify(newdatabaseinput));

	//Reading existing JSON file and merging with new input data
	fs.readFilePromise('bookmarks.json')		
		.then(function(fileContents){

			var olddatabase = JSON.parse(fileContents);
			var updatedDatabase = newdatabaseinput.concat(olddatabase);
			var updatedDBString = JSON.stringify(updatedDatabase);

			fs.writeFile('bookmarks.json', updatedDBString, (err) => {
				if (err) throw err;
					console.log('Bookmaks have been saved!');
			});
		});
})

app.post('/search',function(req,res){
	
	var searchquery = req.body.searchquery;
	console.log("I see this searchquery: "+searchquery);

	fs.readFilePromise('bookmarks.json')
		.then(function(fileContents){
			
		var olddatabase = JSON.parse(fileContents);
		var results = [];

			for(var i=0; i<olddatabase.length; i++){
				
				var tags = JSON.stringify(olddatabase[i].multipletags);
				console.log('Loop sees this: '+tags);

				var pos = tags.indexOf(searchquery);
				if(pos>0){
					console.log('Position: '+pos);
					results.push(olddatabase[i]);
				} else {
					console.log('Keyword not found.');
				}		
			}
		var resultstring = 	JSON.stringify(results);
		console.log('Results: '+JSON.stringify(resultstring));

		res.render("results", {results: results});	
		})
})


//------------DEFINING PORT 8080 FOR SERVER----------------------
var server = app.listen(8080, () => {
	console.log('Yo, this http://localhost is running:' + server.address().port);
});
