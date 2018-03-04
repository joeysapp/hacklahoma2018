var globe, cam;
var options = [];
var col;
var cur_json;
var cur_coords = [];
var g;

// used for camera / lat,lng -> x,y,z
var R = 637.1;

function setup(){
	globe = createCanvas(windowWidth, windowHeight, WEBGL);
	globe.parent('view');
	globe.style("position: absolute; top: 0px;");

	createOptions();
	cur_data = loadJSON('src/data/dummy-data.json', getCartesianCoords);

	// cam = createEasyCam();
	cam = new Dw.EasyCam(this._renderer, {distance:(R*2), center:[0,0,0]});
	col = color(200, 50, 50);

	globe_img = loadImage('src/data/dummy-map.jpg', function(i){ g = i; });
}

function draw(){
	background(col);
	fill(255);

	stroke(255, 0, 0);
	strokeWeight(8);
	line(0, 0, 0, R*2, 0, 0);

	stroke(0, 255, 0);
	line(0, 0, 0, 0, R*2, 0);

	stroke(0, 0, 255);
	line(0, 0, 0, 0, 0, R*2);

	if (g){
		push();
		texture(g);
		sphere(R);
		pop();
	}
}

// This may be different depending on how
// we have our json serialized!
function getCartesianCoords(data){
	for (var key in Object.keys(data[0].list)){
		var pos = toCartesian(data[0].list[key].lat, data[0].list[key].lng);
		cur_coords.push(createVector(pos.x, pos.y, pos.z));
	}
}

function optionChange(e){
	// so e.path[0] is just input.. e.path[1] is the div
	// console.log(e.path[1]);
	if (typeof this.value() !== 'undefined'){
		console.log("Value: "+this.value());
		col = color(map(this.value(), 0, 1000, 0, 255), 50, 50);
	} else {
		console.log("Checked: "+this.checked());
	}
}

function windowResized(){
	globe.size(windowWidth, windowHeight);
}

function toCartesian(lat, lon){
	var x = R*cos(lat)*cos(lon);
	var y = R*cos(lat)*sin(lon);
	var z = R*sin(lat);
	return {x,y,z}
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

	options.push(gender, income, employed, married, location);
	options.forEach(function(e, idx){
		e.style('display:inline-block');
		e.changed(optionChange);
	});
}
