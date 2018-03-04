var globe, cam;
var cur_json;
var options = [];
var cur_coords = [];
var globe_img;
var socket;
var town_names = [];
var asc_names = [];
var histograms = []
var height_button;

var town_id = {};
var id_fresh = {};

// used for camera / lat,lng -> x,y,z
var R = 600;

function setup(){
	socket = io.connect(window.location.origin);
	socket.on('updatePoints', function(data){
		getCartesianCoords(data);
	});
	socket.on('createHistogram', function(data){
		createHistogramDiv(data);
	});

	height_button = createButton('Height toggle');
	height_button.id('height_button');
	height_button.parent('bruces_nice_button');
	height_button.style('position:absolute; right:0px; z-index:4; top:0px');
	height_button.mousePressed(function(e){
		console.log('hi');
		bruces_handy_global_height_variable = !bruces_handy_global_height_variable;
	});

	town_names = loadTable('src/data/all_places.csv', autocompletePopulate);

	// Main p5 canvas and population options div
	globe = createCanvas(windowWidth, windowHeight, WEBGL);
	globe.parent('view');
	globe.style("position: absolute; top: 0px;");
	createOptions();

	// PeasyCam port
	cam = new Dw.EasyCam(this._renderer, {distance:(R*2), center:[0,0,0], rotation:[1,0,0,0]});

	// Globe image last
	// globe_img = loadImage('src/data/1024x512.jpg', function(i){ globe_img = i; });
	globe_img = loadImage('src/data/earth.jpg', function(i){ globe_img = i; });
}



function autocompletePopulate(d){
	for (var i = 0; i < d.getRowCount(); i++){
		var name = d.getString(i,0)+", "+d.getString(i,1);
		// console.log(d.getString(i,0));
		// places.push(d.get)
		asc_names.push(name);
	}

	var input = document.getElementById("location_id");
	var asc = new Awesomplete(input);
	asc.list = asc_names;
}

function draw(){
	background(0,153,204);
	rotateY(PI + PI/16);
	rotateX(PI/5);

	if (globe_img){
		push();
		rotateY(PI/2);
		texture(globe_img);
		sphere(R);
		pop();
	}

	strokeWeight(2);
	stroke(0, 255, 0);
	fill(0, 255, 0);
	cur_coords.forEach(function(e,idx){
		e.display();
	})
}

// Used when the go! button (#submit_i) is clicked
function submitOptions(event){
	var data = {
		'gender_m': $('#gender_m').prop("checked"),
		'gender_f': $('#gender_f').prop("checked"),

		'employed_t': $('#employed_t').prop("checked"),
		'employed_f': $('#employed_f').prop("checked"),

		'married_t': $('#married_t').prop("checked"),
		'married_f': $('#married_f').prop("checked"),

		'income_high': $('#income_id.multirange.original')[0].valueHigh,
		'income_low': $('#income_id.multirange.original')[0].valueLow,
		
		'age_high': $('#age_id.multirange.original')[0].valueHigh,
		'age_low': $('#age_id.multirange.original')[0].valueLow,

		// We could do some verification on the node side to check
		// for stuff
		'location': $('#location_id').val()
		// 'income': options[0].value()
	}
	console.log(data);
	$('#location_id').val('');
	socket.emit('submitOptions', data);
	// cur_coords = [];

}

function elminateCoords() {
	for(var i = 0; i < cur_coords.length; ++i) {
		if(id_fresh[i] === undefined) {
			eliminate(i);
		}
	}
	id_fresh = {};
}

function eliminate(index) {
	var new_raxis = cur_coords[index].r.copy().normalize();
	new_raxis.mult(0.01);
	cur_coords[index].r = new_raxis;
}

function getCartesianCoords(data){
	for (var key in data){
		var lat = data[key].lat;
		var lon = data[key].lng;
		var attr = { price : data[key].avg_cost, num : data[key].num };
		var new_dp = toCartesian(lat,lon,attr);
		
		var place = data[key].city + "," + data[key].state;
		if(town_id[place] === undefined) {
			town_id[place] = cur_coords.length;
			cur_coords.push(new_dp);
		} else {
			updatePoint(town_id[place],attr);
		}
		id_fresh[town_id[place]] = 1;
	}
	elminateCoords();
}

function cartesianHelper(lat, lon){
	var alt = R;

	var rlat = radians(lat);
	var rlon = radians(lon);

	var cx = alt * cos(rlat) * cos(rlon);
	var cy = alt * cos(rlat) * sin(rlon);
	var cz = alt * sin(rlat);

	return createVector(-cx, -cz, cy);
}

function calcHeight(attr) {
	//return map(attr.num, 0, 50, 1.025, 1.5);
	return map(attr.price, 0, 750, 0.96, 1.5);
}

function updatePoint(index, attr) {
	var new_height = calcHeight(attr);
	
	var new_raxis = cur_coords[index].r.copy().normalize();
	var tmp = cur_coords[index].pos.copy();
	tmp.mult(new_height);
	new_raxis.add(tmp);
	
	cur_coords[index].r = new_raxis;
	cur_coords[index].h = new_height;
}

function toCartesian(lat, lon, attr){
	var alt = R-10;

	var rlat = radians(lat);
	var rlon = radians(lon);

	var cx = alt * cos(rlat) * cos(rlon);
	var cy = alt * cos(rlat) * sin(rlon);
	var cz = alt * sin(rlat);

	var pos = createVector(-cx, -cz, cy);

	var xa = createVector(1, 0, 0);
	var angleb = xa.angleBetween(pos);
	var raxis = xa.cross(pos);
	raxis = raxis.normalize();
	var tmp = pos.copy();

	//var new_height = map(price, 0, 300, 0.9, 1.4);
	var new_height = calcHeight(attr);
	tmp.mult(new_height);
	// raxis.mult(h);
	raxis.add(tmp);
	// var data = { 'x': -cx, 'y': -cz, 'z' : cy, 'rx': raxis.x, 'ry': raxis.y, 'rz': raxis.z, 'ab': angleb};

	var tmp = new DataPoint(pos,raxis,angleb,new_height);
	return tmp;
}

function createOptions(){ 
	// var location = createInput();
	// location.id('#location');
	// location.parent('#location_i');
	// options.push(location);

	var submit = createButton('go!');
	submit.parent('#submit_i');
	submit.mousePressed(submitOptions);

	var clear = createButton('clear');
	clear.parent('#submit_i');
	clear.mousePressed(clearPoints);
}

function clearPoints(){
	cur_coords = [];
	town_id = {};
	id_fresh = {};
}

class DataPoint {
	constructor(pos,r,ab,new_height) {
		this.online = true;
		this.pos = pos;
		this.r = r;
		this.ab = ab;
		this.h = new_height;
	}

	display(){
		var c = map(this.h,0.95,1.20,0,255);
		stroke(color(255-c,255,c));
		line(this.pos.x,this.pos.y,this.pos.z,this.r.x,this.r.y,this.r.z);
	}
}



function windowResized(){
	globe.size(windowWidth, windowHeight);
}

// Testing out geojson city data!
// us_cities = loadJSON('src/data/all_cities.json', function(data){
// 	var i = 0;
// 	data["features"].some(function(element,idx){
// 		i += 1;
// 		if (i > 5000){ return; }
// 		var coords = [];
// 		var name = element.properties.NAME;

// 		element.geometry.coordinates[0].forEach(function(coord){
// 			coords.push(cartesianHelper(coord[1], coord[0]));
// 		})

// 		i += 1;
// 		// console.log(element);
		
// 		us_cities_objs.push(new City(coords, name));
// 	});
// 	console.log(us_cities_objs.length);
// });

// function createHistogramDiv(data){
// 	var name = "h-"+String(histograms.length);
// 	var tmp = createDiv(200, 500);
// 	tmp.parent('h_holder');
// 	tmp.class('histogram');
// 	tmp.position(windowWidth/2, windowHeight/2);


// 	var bucket_size = 10;
// 	var min = data[0];
// 	var max = data[1];
// 	data.forEach(function(item,idx){
// 		if (item > max){
// 			max = item;
// 		} else if (item < min){
// 			min = item;
// 		}
// 	})
// 	for (var i = 0; i < windowWidth; i += 2){
// 		var which = floor(map(i, 0, tmp.width, 0, data.length));
// 		var y = floor(map(data[which], 0, max, tmp.height, 0));
// 		stroke(0);
// 		strokeWeight(8);
// 		line(i, this.height, i, y);
// 	}


// 	// tmp.class("histogram");
// 	// histograms.push(tmp);

// }

