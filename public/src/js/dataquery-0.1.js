var csv = require("fast-csv");

var allData = [];
var ready = false;
var ready2 = false;
var city_LL = {};

var placenames = [];

csv
 .fromPath("public/src/data/all_places.csv", {headers:true})
 .on("data", function(row){
	 placenames.push(row[0] + ", " + row[1]);
 })
 .on("end", function(){
	 console.log("loaded placenames")
	 // DO SOMETHING WITH PLACENAMES W/ JQUERY
 });
 
csv
 .fromPath("public/src/data/data_short.csv", {headers:true})
 .on("data", function(row){
	 allData.push(row);
 })
 .on("end", function(){
	 console.log("loaded data")
	 ready = true;
 });
 
csv
 .fromPath("public/src/data/bigplaces_latlng.csv")
 .on("data", function(row){
	 var place = row[0] + "," + row[1];
	 city_LL[place] = [parseFloat(row[2]),parseFloat(row[3])];
 })
 .on("end", function(){
	 console.log("loaded place latlng");
	 //console.log(city_LL);
	 ready2 = true;
 });
 
module.exports = {
// taking conditions -> returns huge-### JSON of data stuff
	JSONwithFilter: function(cond) {
	//console.log(cond);
	var cond_married = -1;
	if(cond['married_t']) cond_married = 1;
	if(cond['married_f']) {
		if(cond['married_t'])
			cond_married = -1;
		else
			cond_married = 0;
	}
	
	var cond_sex = -1;
	if(cond['gender_m']) cond_sex = 1;
	if(cond['gender_f']) {
		if(cond['gender_m'])
			cond_sex = -1;
		else
			cond_sex = 0;
	}
	
	var cond_income_max = cond['income_high'] * 10000.0;
	var cond_income_min = cond['income_low'] * 10000.0;
	
	var cond_age_max = cond['age_high'];
	var cond_age_min = cond['age_low'];
	
	var cond_pop_min = 0.0;
	var cond_pop_max = 10.0;
	
	console.log(cond_married, cond_sex, cond_income_min, cond_income_max, cond_age_min, cond_age_max);
	
	//console.log("hello");
	var result = [];
	if(!ready || !ready2) {
		return result;
	}
	var prices = {};
	var types = {};
	for(var i = 0; i < allData.length; ++i) {
		var married_ = parseInt(allData[i]['married']);
		var sex_ = parseInt(allData[i]['sex']);
		var income_ = parseFloat(allData[i]['income']);
		var age_ = parseInt(allData[i]['age']);
		var pop_ = parseFloat(allData[i]['log_pop']);
		if((cond_married == -1 || married_ == cond_married)
			&& (cond_sex == -1 || sex_ == cond_sex)
			&& (cond_income_min <= income_)
			&& (cond_income_max >= income_)
			&& (cond_age_min <= age_)
			&& (cond_age_max >= age_)
			&& (cond_pop_min <= pop_)
			&& (cond_pop_max >= pop_)) {
			var place = allData[i]['big_city'] + "," + allData[i]['big_state'];
			var paid = parseFloat(allData[i]['paid']);
			var bsgp = [allData[i]['bronze']==allData[i]['paid'],
						allData[i]['silver']==allData[i]['paid'],
						allData[i]['gold']==allData[i]['paid'],
						allData[i]['platinum']==allData[i]['paid']];
			if (prices[place] === undefined) {
				prices[place] = [paid];
				types[place] = bsgp;
			} else {
				prices[place].push(parseFloat(allData[i]['paid']));
				types[place][0] += bsgp[0];
				types[place][1] += bsgp[1];
				types[place][2] += bsgp[2];
				types[place][3] += bsgp[3];
			}
		}
	}
	var count = {};
	var ag_price = {};
	var ag_type = {};
	for (var place in prices) {
		if (prices.hasOwnProperty(place)) {
			var total = 0;
			for (var i = 0; i < prices[place].length; ++i) {
				total += prices[place][i];
			}
			var CS = place.split(",")
			var city = CS[0];
			var state = CS[1];
			var avg_cost = total / prices[place].length;
			var count = prices[place].length;
			var bronze = types[place][0] /  prices[place].length;
			var silver = types[place][0] /  prices[place].length;
			var gold   = types[place][0] /  prices[place].length;
			var plat   = types[place][0] /  prices[place].length;
			var lat    = city_LL[place][0];
			var lng    = city_LL[place][1];
			var element = { "city" : city, "state" : state, "avg_cost": avg_cost,
							"num" : count, "gold" : gold, "silver" : silver, "bronze" : bronze,
							"platinum" : plat, "lat" : lat, "lng" : lng }
			result.push(element)
		}
	}
	//console.log(result.length);
	return result;
},

	cityHistogram(location, cond) {
	var loc = location.trim();
	var loc2 = loc.split(',');
	var city = loc2[0].toLowerCase();
	var state = loc2[1].toLowerCase();
	city.charAt(0).toUpperCase();
	state.charAt(0).toUpperCase();
	
	var result = [];
	for(var i = 0; i < 30; ++i) {
		result.push(0);
	}
	
	if(!ready || !ready2) {
		return result;
	}
	
	var cond_married = cond['married'];
	var cond_sex = cond['sex'];
	var cond_income_min = cond['min_income'];
	var cond_income_max = cond['max_income'];
	var cond_age_min = cond['min_age'];
	var cond_age_max = cond['max_age'];
	var cond_pop_min = cond['min_pop'];
	var cond_pop_max = cond['max_pop'];
	
	//console.log(cond_married,cond_sex,cond_income_min,cond_income_max);
	var filtered = [];
		for(var i = 0; i < allData.length; ++i) {
		var married_ = parseInt(allData[i]['married']);
		var sex_ = parseInt(allData[i]['sex']);
		var income_ = parseFloat(allData[i]['income']);
		var age_ = parseInt(allData[i]['age']);
		var pop_ = parseFloat(allData[i]['log_pop']);
		var city_ = allData[i]['city'];
		var state_ = allData[i]['state'];
		
		if((cond_married == -1 || married_ == cond_married)
			&& (cond_sex == -1 || sex_ == cond_sex)
			&& (cond_income_min <= income_)
			&& (cond_income_max >= income_)
			&& (cond_age_min <= age_)
			&& (cond_age_max >= age_)
			&& (cond_pop_min <= pop_)
			&& (cond_pop_max >= pop_)
			&& (city == city_) 
			&& (state == state_)) {
				filtered.push(parseFloat(allData[i]['paid']));
			}
			
		}
	for(var i = 0; i < filtered.length; ++i) {
		var ind_ = Math.round(filtered[i] / 10);
		if (ind_ > 29) 
			ind_ = 29;
		result[ind_] += 1;
	}
	return result;
}
/*
const NS_PER_SEC = 1e9;
app.get('/', function(req, res){
    res.setHeader('Content-Type', 'application/json');
	if (ready) {
		var time = process.hrtime();
		var married_ = -1;
		var sex_ = -1;
		var min_income_ = 0;
		var max_income_ = 1000000000000;
		var min_age_ = 0;
		var max_age_ = 100;
		if (req.query !== undefined) {
			if(req.query.married !== undefined)
				married_ = parseInt(req.query.married);
			if(req.query.sex !== undefined)
				sex_ = parseInt(req.query.sex);
			if(req.query.min_income !== undefined)
				min_income_ = parseFloat(req.query.min_income);
			if(req.query.max_income !== undefined)
				max_income_ = parseFloat(req.query.max_income);
			if(req.query.min_age !== undefined)
				min_age_ = parseFloat(req.query.min_age);
			if(req.query.max_age !== undefined)
				max_age_ = parseFloat(req.query.max_age);
		}
		var c = JSONwithFilter({
								"married"    : married_, 
								"sex"        : sex_, 
								"min_income" : min_income_,
								"max_income" : max_income_,
								"min_age"    : min_age_,
								"max_age"    : max_age_
								});
		var diff = process.hrtime(time);
		console.log(`query took ${(diff[0] * NS_PER_SEC + diff[1]) / NS_PER_SEC} seconds`);
		res.send(JSON.stringify({ success : true, list: c}));
	}
	else {
		res.send(JSON.stringify({ success : false, list : "Does not contain " + req.query.city}));
	}
});

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
*/