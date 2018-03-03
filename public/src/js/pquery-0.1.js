var canvas, cam;

function setup(){
	canvas = createCanvas(windowWidth, windowHeight, WEBGL);
	canvas.parent('holder');

	cam = createEasyCam();
}

function draw(){
	background(255);
	torus(50, 25);
}

function windowResized(){
	canvas.size(windowWidth, windowHeight);
}
