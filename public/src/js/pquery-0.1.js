var globe, cam;
var options = [];
var cur_json;
var cur_coords = [];
var g;
var socket;

// used for camera / lat,lng -> x,y,z
var R = 600;

function setup(){
	socket = io.connect(window.location.origin);
	// socket.on('message', function(data){
	// 	console.log(data.msg);
	// });

	globe = createCanvas(windowWidth, windowHeight, WEBGL);
	globe.parent('view');
	globe.style("position: absolute; top: 0px;");

	createOptions(foo);
	cur_data = loadJSON('src/data/dummy-data.json', getCartesianCoords);

	cam = new Dw.EasyCam(this._renderer, {distance:(R*2), center:[0,0,0]});

	// globe_img = loadImage('src/data/earth.jpg', function(i){ g = i; });
	globe_img = loadImage('src/data/1024x512.png', function(i){ g = i; });
}

function foo(){
	// console.log(selectAll('income_id'));
}

function draw(){
	background(255);

	if (g){
		push();
		rotateY(PI/2);
		texture(g);
		sphere(R);
		pop();
	}

	strokeWeight(2);
	stroke(0, 255, 0);
	fill(0, 255, 0);
	cur_coords.forEach(function(e,idx){
		e.display();
		// line(e.x, e.y, e.z, e.x, e.y+20, e.z);
		// point(e.x, e.y, e.z);
	})

}

// This may be different depending on how we have our json serialized
function getCartesianCoords(data){
	for (var key in Object.keys(data[0].list)){
		var lat = data[0].list[key].lat;
		var lon = data[0].list[key].lng;
		var new_dp = toCartesian(lat,lon);
		cur_coords.push(new_dp);
		// cur_coords.push(createVector(pos.x, pos.y, pos.z));

	}
}

// Used when the go! button (#submit_i) is clicked
function submitOptions(event){
	console.log()
	var data = {
		'gender': options[0].checked(),
		'employed': options[1].checked(),
		'married': options[2].checked(),
		'income_high': $('#income_id.multirange.original')[0].valueHigh,
		'income_low': $('#income_id.multirange.original')[0].valueLow,
		'age_high': $('#age_id.multirange.original')[0].valueHigh,
		'age_low': $('#age_id.multirange.original')[0].valueLow,
		'location': options[5].value()
	}
	socket.emit('submitOptions', data);
}

function toCartesian(lat, lon){
	var alt = R;

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
	tmp.mult(random(1,1.05));
	// raxis.mult(h);
	raxis.add(tmp);

	// var data = { 'x': -cx, 'y': -cz, 'z' : cy, 'rx': raxis.x, 'ry': raxis.y, 'rz': raxis.z, 'ab': angleb};

	var tmp = new DataPoint(pos.x, pos.y, pos.z,raxis.x,raxis.y,raxis.z,angleb);
	return tmp
}

function createOptions(verifyGhostSlider){
	var gender = createCheckbox(false);
	gender.parent('#gender_i');

	var employed = createCheckbox(false);
	employed.parent('#employed_i');

	var married = createCheckbox(false);
	married.parent('#married_i');

	var multirange_sliders = selectAll('.multirange ghost');
	var income = multirange_sliders[0];
	income.id('income_id');

	var age = multirange_sliders[1];
	age.id('age_id');

	var location = createInput();
	location.parent('#location_i');

	var submit = createButton('go!');
	submit.parent('#submit_i');

	options.push(gender, employed, married, location);
	
	// Rework this if we want the below feature, otherwise whatever
	options.forEach(function(e, idx){
		e.style('display:inline-block');

		// This would be for on-the-fly updating
		// i.e. when a single option is changed, 
		// we call our node server and hope for a response
		// e.changed(optionChange);
	});
	options.splice(3, 0, income);
	options.splice(4, 0, age);
	// Otherwise, single submit button:
	submit.mousePressed(submitOptions);
	// verifyGhostSlider();


}

class DataPoint {
	constructor(x,y,z,rx,ry,rz,ab){
		this.x = x;
		this.y = y;
		this.z = z;
		this.rx = rx;
		this.ry = ry;
		this.rz = rz;
		this.ab = ab;
	}

	display(){
		line(this.x,this.y,this.z,this.rx,this.ry,this.rz);
	}
}

function windowResized(){
	globe.size(windowWidth, windowHeight);
}
