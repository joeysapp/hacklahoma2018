var globe, cam;
var options = [];
var col;

function setup(){
	globe = createCanvas(windowWidth, windowHeight, WEBGL);
	// out = createDiv(windowWidth/8, windowHeight);
	globe.parent('view');
	globe.style("position: absolute; top: 0px;");

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


	cam = createEasyCam();
	col = color(200, 50, 50);
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

function draw(){
	background(col);
	fill(255);
	torus(50, 25);
	// out.html(String(frameRate()));
}

function windowResized(){
	globe.size(windowWidth, windowHeight);
}

function toCartesian(lat, lon){
	var r = 6.371;
	var x = r*cos(lat)*cos(lon);
	var y = r*cos(lat)*sin(lon);
	var z = r*sin(lat);
	return {x,y,z}
}
