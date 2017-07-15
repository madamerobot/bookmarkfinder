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

/*--HELPER FUNCTION--*/

var readFile = function(){

	fs.readFile('bookmarks.json', 'utf-8', function(err, data){
			if (err){
				console.log(err);
			} else {
				console.log('Read file successfully.');
			}
	});
}

/*------ROUTES-------*/

/*---LANDING PAGE TO SEE FORM -->*/

app.get('/', function(req,res){

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

	newdatabaseinput.push({
		inputname,
		inputurl,
		multipletags
	})

	console.log('New database input: '+JSON.stringify(newdatabaseinput));

	//Reading JSON file content
	var olddatabase = [];
	var updatedDatabase = [];
	var updatedDBString = [];

	fs.readFile('bookmarks.json', 'utf-8', function(err, data){
		if (err){
			throw err;
		} else {
			olddatabase = JSON.parse(data);
			console.log('Old database: '+JSON.stringify(olddatabase));
			updatedDatabase = olddatabase.concat(newdatabaseinput);

			updatedDBString = JSON.stringify(updatedDatabase);
			console.log('Updated Database: '+updatedDBString);

			fs.writeFile('bookmarks.json', updatedDBString, (err) => {
				if (err) throw err;
				console.log('Bookmaks have been saved!');
			});
		}
	}); //End of fs.readFile
})


//------------DEFINING PORT 8080 FOR SERVER----------------------
var server = app.listen(8080, () => {
	console.log('Yo, this http://localhost is running:' + server.address().port);
});
