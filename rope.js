window.onload = function() {
	document.addEventListener('contextmenu', event => event.preventDefault());
	document.addEventListener("mousedown", function(e) {
		if (e.button == 1) {
			e.preventDefault();
		}
		mouse.state = e.button;
	});
	document.addEventListener("mousemove", function(e) {
		mouse.y = e.clientY;
		mouse.x = e.clientX;
	});
	let mouse = {
		y: null,
		x: null,
		state: null
	}
	function animate() {
		requestAnimationFrame(animate);
		ctx.clearRect(0,0, innerWidth, innerHeight);
		game.draw();
	}
	class Line{
		constructor(pointA, pointB){
			this.pointA = pointA;
			this.pointB = pointB;
			this.length = 0;
		}
		draw() {
			ctx.beginPath();
			ctx.moveTo(this.pointA.x, this.pointA.y);
			ctx.lineTo(this.pointB.x, this.pointB.y);
			ctx.lineWidth = '3';
			ctx.strokeStyle = 'black';
			ctx.stroke();
		}
	}
	class Point{
		constructor(x, y, fixed = false){
			this.x = x;
			this.y = y;
			this.fixed = fixed;
		}
		getCoord() {
			let coord = {
				y: this.y,
				x: this.x
			}
			return coord;
		}
		draw() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, pointR, 0, 2 * Math.PI);
			if (this.fixed) {
				ctx.fillStyle = 'red';
			}
			else {
				ctx.fillStyle = 'blue';
			}
			ctx.fill();
			ctx.stroke();
		}
	}
	class Game{
		constructor() {
			this.points = new Array;
			this.lines = new Array;
			this.points[0] = new Point(300, 300);
			//this.points[1] = new Point(300, 600);
			//this.lines[0] = new Line(this.points[0], this.points[1])
		}
		draw() {
			this.lines.forEach(line => {
				line.draw();
			});
			this.points.forEach(point => {
				point.draw();
			});
			this.actions();
		}
		actions() {
			switch (mouse.state) {
				case 0: //left
					let clickedPoint = false;
					this.points.forEach(point => {
						let distance = Math.sqrt((point.x - mouse.x) ** 2 + (point.y - mouse.y) ** 2);
						if (distance <= pointR * 2) {
							clickedPoint = true;
							if (distance <= pointR) {
								point.fixed = !point.fixed;
							}
						}
					});
					if (!clickedPoint) {
						this.addPoint();
					}
					break;
				case 2: //right
					for (let i = 0; i < this.points.length; i++) {
						let distance = Math.sqrt((this.points[i].x - mouse.x) ** 2 + (this.points[i].y - mouse.y) ** 2);
						if (distance <= pointR) {
							this.points.splice(i); //error somewhere, it delete more points
							break;
						}
					}
					break;
				case 1: //middle
					
					break;
			}
			mouse.state = null;
		}
		addPoint() {
			this.points.push(new Point(mouse.x, mouse.y))
		}
	}
	const pointR = 15;
	let game = new Game();
	let canvas = document.querySelector("canvas");
	let ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	animate();
}