window.onload = function() {
	document.addEventListener('contextmenu', event => event.preventDefault());
	document.addEventListener('mousedown', function(e) {
		if (e.button == 1) {
			e.preventDefault();
		}
		mouse.state = e.button;
	});
	document.addEventListener('mouseup', function(e) {
		mouse.state = null;
	});
	document.addEventListener('mousemove', function(e) {
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
		constructor(pA, pB){
			this.pA = pA;
			this.pB = pB;
			this.pM = new Point(Math.abs(this.pA.x + this.pB.x) / 2, Math.abs(this.pA.y + this.pB.y) / 2);
			this.length = Math.sqrt((this.pA.x - this.pB.x) ** 2 + (this.pA.y - mouse.y) ** 2);
		}
		draw() {
			ctx.beginPath();
			ctx.moveTo(this.pA.x, this.pA.y);
			ctx.lineTo(this.pB.x, this.pB.y);
			ctx.lineWidth = lWidth;
			ctx.strokeStyle = 'black';
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(this.pM.x, this.pM.y, pointR/1.5, 0, 2 * Math.PI);
			ctx.lineWidth = '1';
			ctx.fillStyle = 'black';
			ctx.fill();
			ctx.stroke();
		}
	}
	class Point{
		constructor(x, y, fixed = false){
			this.x = x;
			this.y = y;
			this.fixed = fixed;
			this.inUse = false;
		}
		draw() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, pointR, 0, 2 * Math.PI);
			ctx.lineWidth = '3';
			if (this.fixed) {
				ctx.fillStyle = 'red';
			}
			else if(this.inUse) {
				ctx.fillStyle = 'green';
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
			this.pFirst = null;
		}
		pointClicked(factor = 1) {
			let distance;
			for (let i = 0; i < this.points.length; i++) {
				distance = Math.sqrt((this.points[i].x - mouse.x) ** 2 + (this.points[i].y - mouse.y) ** 2);
				if (distance <= pointR * factor) {
					return i;
				}
			}
			return null;
		}
		lineClicked() {
			let line, dpM;
			for (let i = 0; i < this.lines.length; i++) {
				line = this.lines[i];
				dpM = Math.sqrt((line.pM.x - mouse.x) ** 2 + (line.pM.y - mouse.y) ** 2);
				if (dpM <= pointR/2) {
					return i;
				}
			}
			return null;
		}
		newLine(pIndex) {
			let existing = false;
			this.lines.forEach(line => {
				if ((line.pA == this.points[this.pFirst] && line.pB == this.points[pIndex])
				|| (line.pA == this.points[pIndex] && line.pB == this.points[this.pFirst])) {
					existing = true;
				}
			});
			if (!existing) {
				this.lines.push(new Line(this.points[this.pFirst], this.points[pIndex]));
			}
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

				// !!!!! find a way to move a point

				case 0: // left
					mouse.state = null;
					let pClicked = this.pointClicked(2);
					if (pClicked != null) {
						let pIndex = this.pointClicked();
						if (pIndex != null)
							this.points[pIndex].fixed = !this.points[pIndex].fixed; // toggle point
					}
					else
						this.points.push(new Point(mouse.x, mouse.y)) // create point
					break;
				case 2: // right
					mouse.state = null;
					let pIndex = this.pointClicked();
					if (pIndex != null) {
						for (let i = 0; i < this.lines.length; i++) {
							if (this.lines[i].pA == this.points[pIndex]
							|| this.lines[i].pB == this.points[pIndex]) {
								this.lines.splice(i, 1); // delete point's lines
								i--;
							}
						}
						this.points.splice(pIndex, 1); // delete point
					}
					else {
						let lIndex = this.lineClicked();
						if (lIndex != null)
							this.lines.splice(lIndex, 1);
					}
					break;
				case 1: // middle
					mouse.state = null;
					if (this.pFirst == null) {
						let delline = false;
						if (delline) { // delete line
							
						}
						else { // first line point
							let pIndex = this.pointClicked();
							if (pIndex != null) {
								this.pFirst = pIndex;
								this.points[pIndex].inUse = true;
							}
						}
					}
					else {
						let pIndex = this.pointClicked(1.5);
						if (pIndex != null && pIndex != this.pFirst) {
							this.newLine(pIndex);
						}
						else if(pIndex == null) {
							this.points[this.pFirst].inUse = false;
							this.pFirst = null;
						}
					}
					break;
			}
		}
	}
	const pointR = 15;
	const lWidth = 10;
	let game = new Game();
	let canvas = document.querySelector("canvas");
	let ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	animate();
}