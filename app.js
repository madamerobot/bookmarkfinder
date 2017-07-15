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

//Requiring postgres library
const pg = require('pg')

//---POSTGRES CONNECTION------

// var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bookmarkfinder';
var connectionString = 'postgres://schmetterling:schmetterling@localhost/bookmarkfinder';

/*------ROUTES-------*/

/*---LANDING PAGE TO SEE FORM -->*/

app.get('/', function(req,res){
	res.render("index");
})

app.post('/',function(req,res){

	var inputname = req.body.name;
	var inputurl = req.body.url;
	var inputtag = req.body.tags;

	console.log('I see this: '+inputname+' '+inputurl+' '+inputtag);

	pg.connect(connectionString, function (err, client, done){
		
		if(err){
			console.log(err);
		}
		
		//INSERT USER INFO
		client.query(`INSERT INTO bookmarkfinder
					(name, url, tags) 
					VALUES ($1, $2, $3)`, 
					[inputname, inputurl, inputtag], function(err, users){
					if(err){
						console.log(err);
					}
			console.log("URL info got inserted");
			done();
			pg.end();
		});
	});

})

//------------DEFINING PORT 8080 FOR SERVER----------------------
var server = app.listen(8080, () => {
	console.log('Yo, this http://localhost is running:' + server.address().port);
});
