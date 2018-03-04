var express = require('express');
var app = express();

// Web sockets!
var server = require('http').Server(app);  
var io = require('socket.io')(server);

// Fluff
var path = require('path');
var csv = require('fast-csv');

var csv_query = require('./public/src/js/dataquery-0.1');

server.listen(process.env.PORT || 8000);
app.use(express.static('public'));

io.on('connection', function(socket){
	socket.on('submitOptions', function(data){
		if (data.location == ''){
			console.log("well this is odd!");
			csv_query.JSONwithFilter(data);
			socket.emit('updatePoints', csv_query.returning_data);
		} else {
			console.log("wew emissions");
			console.log(csv_query.cityHistogram(data));
			socket.emit('createHistogram', csv_query.returning_data);
		}
	});
	// socket.on('listPopulation', function(data){
	// 	csv_query.JSONwithFilter(data);
	// 	socket.emit('updateList', csv_query.placenames);
	// });
});

// This is how we provide all the needed files under this directory
// as in they are "static" and never change
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));
});