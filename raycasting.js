window.onload = function() {
	function convertAngle(angle, format) {
		if (format == 'rad') {
			angle = angle * Math.PI / 180;
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
			ctx.beginPath();
			ctx.moveTo(this.p1.x, this.p1.y);
			ctx.lineTo(this.p2.x, this.p2.y);
			ctx.stroke();
		}
	}
	class Ray {
		constructor(degr) {
			this.degr = degr;
			this.rad = convertAngle(this.degr, 'rad');
			this.endP = new Point();
		}
		calculateEnd() {
			//(this.degr > 90 && this.degr < 270)?;
			let sin = Math.sin(this.rad);
			let cos = Math.cos(this.rad);
			this.endP.x = origin.o.x + cos;
			this.endP.y = origin.o.y - sin;
			do {
				this.endP.x += cos * 0.1;
				this.endP.y -= sin * 0.1;
			} while (!(this.endP.x < -5 || this.endP.x > cvs.x + 5 || this.endP.y < -5 || this.endP.y > cvs.y + 5));
			this.length = Math.sqrt((origin.o.x - this.endP.x) ** 2 + (origin.o.y - this.y) ** 2);
			//* https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
			//* Given_two_points_on_each_line_segment
		}
		draw() {
			ctx.beginPath();
			ctx.moveTo(origin.o.x, origin.o.y);
			ctx.lineTo(this.endP.x, this.endP.y);
			ctx.stroke();
		}
	}
	class Origin {
		constructor(p) {
			this.o = p;
			this.rays = new Array();
			for (let i = 0; i < 360; i++) {
				this.rays.push(new Ray(i));
				this.rays.push(new Ray(i+0.25));
				this.rays.push(new Ray(i+0.5));
				this.rays.push(new Ray(i+0.75));
			}
		}
		draw() {
			this.rays.forEach(ray => {
				ray.draw();
			});
			ctx.beginPath();
			ctx.arc(this.o.x, this.o.y, 10, 0, 2 * Math.PI);
			ctx.fill();
		}
	}
	function animate() {
		requestAnimationFrame(animate);
		ctx.clearRect(0,0, innerWidth, innerHeight);
		//walls.forEach(wall => { wall.draw() });
		origin.draw();
	}
	let canvas = document.querySelector("canvas");
	let ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx.fillStyle = 'red';
	ctx.strokeStyle = 'gray';
	ctx.lineWidth = '3';
	let cvs = { x: canvas.width, y: canvas.height };
	let walls = new Array();
	walls.push(new Wall(new Point(400, 200), new Point(500, 300)))
	let origin = new Origin(new Point(canvas.width/2, canvas.height/2));
	origin.rays.forEach(ray => {
		ray.calculateEnd();
	});
	animate();
}