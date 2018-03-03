var express = require('express');
var app = express();
var path = require('path');

var server = app.listen(8000, function(){
	console.log('Hacklahoma2018: ' + server.address().address + ':' + server.address().port);
});

// This is how we provide all the needed files under this directory
// as in they are "static" and never change
app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));
});

