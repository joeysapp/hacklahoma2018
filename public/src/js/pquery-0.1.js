var globe, cam;
var out;

function setup(){
	globe = createCanvas(windowWidth, windowHeight, WEBGL);
	out = createDiv(windowWidth/8, windowHeight);
	globe.parent('holder');
	globe.style("position: absolute; top: 0px;");
	out.parent('holder');
	out.style("position: absolute; top: 0px;");

	cam = createEasyCam();
}

function draw(){
	background(255);
	fill(255);
	torus(50, 25);
	out.html(String(frameRate()));
}

function windowResized(){
	globe.size(windowWidth, windowHeight);
}
