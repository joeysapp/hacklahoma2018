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

	createOptions();
	cur_data = loadJSON('src/data/dummy-data.json', getCartesianCoords);

	cam = new Dw.EasyCam(this._renderer, {distance:(R*2), center:[0,0,0]});

	globe_img = loadImage('src/data/earth.jpg', function(i){ g = i; });
	// globe_img = loadImage('src/data/1024x512.png', function(i){ g = i; });
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
		line(e.x, e.y, e.z, e.x, e.y+20, e.z);
		// point(e.x, e.y, e.z);
	})

}

// This may be different depending on how we have our json serialized
function getCartesianCoords(data){
	for (var key in Object.keys(data[0].list)){
		var pos = toCartesian(data[0].list[key].lat, data[0].list[key].lng);
		cur_coords.push(createVector(pos.x, pos.y, pos.z));
	}
}

// Used when the go! button (#submit_i) is clicked
function submitOptions(event){
	var data = {
		'gender': options[0].checked(),
		'employed': options[1].checked(),
		'married': options[2].checked(),
		'income': options[3].value(),
		'location': options[4].value()
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

	var h = random(50);
	var xa = createVector(1, 0, 0);
	var angleb = xa.angleBetween(pos);
	var raxis = xa.cross(pos);

	var data = { 'x': -cx, 'y': -cz, 'z' : cy, 'rx': raxis.x, 'ry': raxis.y, 'rz': raxis.z, 'ab': angleb};

	return data
}

function createOptions(){
	var gender = createCheckbox(false);
	gender.parent('#gender_i');

	var employed = createCheckbox(false);
	employed.parent('#employed_i');

	var married = createCheckbox(false);
	married.parent('#married_i');

	var income = createSlider(0,1000,1000,5);
	income.parent('#income_i');

	var location = createInput();
	location.parent('#location_i');

	var submit = createButton('go!');
	submit.parent('#submit_i');

	options.push(gender, employed, married, income, location);
	options.forEach(function(e, idx){
		e.style('display:inline-block');

		// This would be for on-the-fly updating
		// i.e. when a single option is changed, 
		// we call our node server and hope for a response
		// e.changed(optionChange);
	});
	// Otherwise, single submit button:
	submit.mousePressed(submitOptions);
}



function windowResized(){
	globe.size(windowWidth, windowHeight);
}
