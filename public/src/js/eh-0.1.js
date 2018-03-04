// https://github.com/CodingTrain/website/blob/master/CodingChallenges/CC_57_Earthquake_Viz/sketch.js
// Earth Helper

var correct_lat = 0;
var correct_lon = 0;

function mercX(lon) {
	lon = radians(lon);
	var a = (256 / PI) * pow(2, 1);
	var b = lon + PI;
	return a * b;
}

function mercY(lat) {
	lat = radians(lat);
	var a = (256 / PI) * pow(2, 1);
	var b = tan(PI / 4 + lat / 2);
	var c = PI - log(b);
	return a * c;
}