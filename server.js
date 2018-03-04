var express = require('express');
var app = express();

// Web sockets!
var server = require('http').Server(app);  
var io = require('socket.io')(server);

// Fluff
var path = require('path');
var csv = require('fast-csv');

var csv_query = require('./csv_query');

server.listen(process.env.PORT || 8000);
app.use(express.static('public'));

io.on('connection', function(socket){
	// socket.emit('Connected', {msg: "You're connected!"});
	socket.on('submitOptions', function(data){
		console.log(data);
		csv_query.JSONwithFilter(data);
		// Send the data to Bruce's SQL stuff!

		// I think this is only needed 
		// socket.broadcast.emit('message', data);
	});
});


// var server = app.listen(8000, function(){
// 	console.log('Hacklahoma2018: ' + server.address().address + ':' + server.address().port);
// });

// This is how we provide all the needed files under this directory
// as in they are "static" and never change

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));
});

