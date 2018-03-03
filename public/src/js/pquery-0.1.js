var canvas;

function setup(){
	canvas = createCanvas(windowWidth, windowHeight, WEBGL);
	canvas.parent('holder');
	console.log('hi');
}

var rx  = 0;
var ry = 0;
var rz =0 ;

function draw(){
	canvas.background(255);
	canvas.rotateX(rx += 0.01);
	canvas.rotateY(ry += 0.01);
	canvas.rotateZ(rz += 0.01);
	box(50);



}