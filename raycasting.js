window.onload = function() {
	function convertAngle(angle, format) {
		if (format == 'rad') {
			//todo convert to radiant
		}
		else if (format == 'degr') {
			//todo convert to degree
		}
		return angle;
	}
	class Point {
		constructor(x, y) {
			this.x = x;
			this.y = y;
		}
	}
	class Wall {
		constructor(p1, p2) {
			this.p1 = p1;
			this.p2 = p2;
		}
		draw() {
			ctx.moveTo(this.p1.x, this.p1.y);
			ctx.lineTo(this.p2.x, this.p2.y);
			ctx.stroke();
		}
	}
	class Ray {
		constructor(degr) {
			this.degr = degr;
			this.endP = new Point();
			this.length = 0;
		}
		calculateEnd() {
			let rad = convertAngle(this.degr, 'rad');
			this.endP.x = 100;
			this.endP.y = 200;
			return this.endP;
		}
	}
	class Origin {
		constructor(p) {
			this.o = p;
			this.rays = new Array();
			for (let i = 0; i < 1; i++) {
				this.rays.push(new Ray(i));
			}
		}
		draw() {
			ctx.beginPath();
			ctx.arc(this.o.x, this.o.y, 10, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			this.rays.forEach(ray => {
				let endP = ray.calculateEnd();
				ctx.moveTo(this.o.x, this.o.y);
				ctx.lineTo(endP.x, endP.y);
				ctx.stroke();
			});
		}
	}
	function animate() {
		requestAnimationFrame(animate);
		ctx.clearRect(0,0, innerWidth, innerHeight);
		origin.draw();
	}
	let canvas = document.querySelector("canvas");
	let ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'white';
	let origin = new Origin(new Point(canvas.width/2, canvas.height/2));
	animate();
}