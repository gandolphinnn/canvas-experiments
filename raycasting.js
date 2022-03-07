window.onload = function() {
	document.addEventListener('mousedown', function(e) {
		if (e.button == 0) {
			mouse.state = true;
		}
	});
	document.addEventListener('mouseup', function(e) {
		mouse.state = false;
	});
	document.addEventListener('mousemove', function(e) {
		mouse.pos.y = e.clientY;
		mouse.pos.x = e.clientX;
	});
	class Point {
		constructor(x, y) {
			this.x = x;
			this.y = y;
		}
	}
	let mouse = {
		pos: new Point(null, null),
		state: false
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
			this.rad = this.degr * Math.PI / 180;
			this.endP = new Point();
		}
		calculateEnd() {
			let sin = Math.sin(this.rad);
			let cos = Math.cos(this.rad);
			let O = origin.o;
			this.endP.x = O.x + cos;
			this.endP.y = O.y - sin;
			do {
				this.endP.x += cos * 0.1;
				this.endP.y -= sin * 0.1;
			} while (!(this.endP.x < -5 || this.endP.x > cvs.x + 5 || this.endP.y < -5 || this.endP.y > cvs.y + 5));
			this.length = Math.sqrt((O.x - this.endP.x) ** 2 + (O.y - this.y) ** 2);
			//* https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
			//* Given_two_points_on_each_line_segment
			walls.forEach(wall => {
				let x1 = O.x, x2 = this.endP.x, x3 = wall.p1.x, x4 = wall.p2.x;
				let y1 = O.y, y2 = this.endP.y, y3 = wall.p1.y, y4 = wall.p2.y;
				let denom = (x1-x2)*(y3-y4) - (x3-x4)*(y1-y2);
				let t = ((x1-x3)*(y3-y4) - (x3-x4)*(y1-y3)) / denom;
				let u = ((x1-x3)*(y1-y2) - (x1-x2)*(y1-y3)) / denom;
				if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
					this.endP.x = x1 + t * (x2 - x1);
					this.endP.y = y1 + t * (y2 - y1);
				}
			});

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
				//this.rays.push(new Ray(i+0.25));
				//this.rays.push(new Ray(i+0.5));
				//this.rays.push(new Ray(i+0.75));
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
		move() {
			console.log(mouse.state); // !bug
			if (mouse.state) {
				this.o = mouse.pos;
			}
		}
	}
	function animate() {
		requestAnimationFrame(animate);
		ctx.clearRect(0,0, innerWidth, innerHeight);
		walls.forEach(wall => { wall.draw() });
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
	//walls.push(new Wall(new Point(400, 200), new Point(200, 400)))
	walls.push(new Wall(new Point(800, 200), new Point(200, 600)))
	let origin = new Origin(new Point(canvas.width/2, canvas.height/2));
	origin.rays.forEach(ray => {
		ray.calculateEnd();
	});
	animate();
}