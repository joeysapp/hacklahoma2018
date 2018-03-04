class City {
	constructor(coords, name){
		this.coords = coords.reverse();
		this.name = name;
	}
	
	display(){
		beginShape();
		stroke(255, 0, 0);
		strokeWeight(8);
		this.coords.forEach(function(element, idx){
			vertex(element.x, element.y, element.z);
		})
		endShape(CLOSE);
	}

}