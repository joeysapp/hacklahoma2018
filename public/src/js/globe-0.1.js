class Globe {
	constructor(img, detail){
		this.img = img;
		this.detail = detail;

		var d1 = this.detail+1;
		var d2 = this.detail*2 + 1;

		this.tsX = [];
		this.tsY = [];
		this.tsZ = [];
		this.tsU = [];
		this.tsV = [];

		console.log("this happened")
		var step = Math.PI/this.detail;
		// decimal needed?
		var ustep = 0.5/this.detail;
		var vstep = 1./this.detail;

		for (var i = 0; i <= this.detail; i++) { 
			var theta = step * i; 
			var y = cos(theta); 
			var sin_theta = sin(theta); 
			var v = 1.0 - vstep * i; 

			console.log(this.tsX);
			this.tsY[i].push([]);
			// this.tsZ[i] = [];

			// this.tsU[i] = [];
			// this.tsV[i] = [];

			for (var j = 0; j <= 2 * this.detail; j++) { 
				console.log(this.tsX);
				var phi = step * j; 
				var x = sin_theta * cos(phi); 
				var z = sin_theta * sin(phi); 
				var u = 1.0 - ustep * j; 

				this.tsX[i][j] = x * R; 
				this.tsY[i][j] = y * R; 
				this.tsZ[i][j] = z * R; 
				this.tsU[i][j] = u * this.img.width; 
				this.tsV[i][j] = v * this.img.height; 
			}   
		} 

	}

	

	display(){
		if (this.tsX == null){
			console.log(this.tsX, this.tsY);
			return;
		}
		console.log("trying to do this!");
    	noStroke();
    	var next_i = 1;
		for (var i = 0; i < this.detail; i += next_i) { 
			next_i = i + 1;   
			beginShape(QUAD_STRIP); 
			texture(this.img); 
			for (var j = 0; j <= this.detail*2; j++) {         
				var u1 = this.tsU[i][j]; 
				var x1 = this.tsX[i][j]; 
				var y1 = this.tsY[i][j]; 
				var z1 = this.tsZ[i][j]; 
				var v1 = this.tsV[i][j]; 

				var x2 = this.tsX[nexti][j]; 
				var y2 = this.tsY[nexti][j]; 
				var z2 = this.tsZ[nexti][j]; 
				var v2 = this.tsV[nexti][j]; 
				vertex(x1, y1, z1, u1, v1); 
				vertex(x2, y2, z2, u1, v2); 
			}   
			endShape(); 
		}
  }
};

// https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
// function createArray(length) {
//     var arr = new Array(length || 0),
//         i = length;

//     if (arguments.length > 1) {
//         var args = Array.prototype.slice.call(arguments, 1);
//         while(i--) arr[length-1 - i] = createArray.apply(this, args);
//     }

//     return arr;
// }

