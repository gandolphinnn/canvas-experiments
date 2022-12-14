let canvas = document.querySelector("canvas");
canvas.width = typeof cnvWidth === 'undefined'? window.innerWidth : cnvWidth;
canvas.height = typeof cnvHeight === 'undefined'? window.innerHeight : cnvHeight;
document.querySelector('body').style.overflow = 'hidden';
document.querySelector('body').style.margin = '0px';
ctx = canvas.getContext("2d");
class Coord {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	set(newX, newY) {
		this.x = newX;
		this.y = newY;
	}
	add(addX, addY) {
		this.x += addX;
		this.y += addY;
	}
	dist(coord) {
		return Math.sqrt((this.x - coord.x) ** 2 + (this.y - coord.y )** 2);
	}
};
const cnv = {
	body: canvas,
	width: canvas.width,
	height: canvas.height,
	center: new Coord(canvas.width/2, canvas.height/2)
};
class Line {
	constructor(coord1, coord2) {
		this.coord1 = coord1;
		this.coord2 = coord2;
	}
	hitL(line) {
		//todo(?) add exception: overlayered lines
		let hitPoint = false;
		let x1 = this.coord1.x, x2 = this.coord2.x, x3 = line.coord1.x, x4 = line.coord2.x;
		let y1 = this.coord1.y, y2 = this.coord2.y, y3 = line.coord1.y, y4 = line.coord2.y;
		let denom = (x1-x2)*(y3-y4) - (x3-x4)*(y1-y2);
		let t = ((x1-x3)*(y3-y4) - (x3-x4)*(y1-y3)) / denom;
		let u = ((x1-x3)*(y1-y2) - (x1-x2)*(y1-y3)) / denom;
		if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
			hitPoint = new Coord(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
		}
		return hitPoint;
	}
};
const coordF = {
	sum2: (coord1, coord2) => {
		return new Coord(coord1.x + coord2.x, coord1.y + coord2.y);
	},
	sumVal: (coord1, x, y) => {
		return new Coord(coord1.x + x, coord1.y + y);
	},
	dist: (coord1, coord2) => {
		return Math.sqrt(((coord1.x - coord2.x) ** 2) + ((coord1.y - coord2.y) ** 2));
	},
};
const drawF = {
	circle: (coord, radius, action = '') => {
		ctx.beginPath();
		ctx.arc(coord.x, coord.y, radius, 0, Math.PI * 2);
		if (action == '' || action == 'fill' || action == 'f') {
			ctx.fill();
		}
		if (action == '' || action == 'stroke' || action == 's') {
			ctx.stroke();
		}
	},
	rectV: (coord, width, length, action = '') => { //? rect with lines parallel to screen
		ctx.beginPath();
		ctx.rect(coord.x, coord.y, width, length);
		if (action == '' || action == 'fill' || action == 'f') {
			ctx.fill();
		}
		if (action == '' || action == 'stroke' || action == 's') {
			ctx.stroke();
		}
	},
	rectC: (coord1, coord2, action = '') => { //? rect with lines parallel to screen
		ctx.beginPath();
		let x = (coord2.x < coord1.x)? coord2.x : coord1.x;
		let y = (coord2.y < coord1.y)? coord2.y : coord1.y;
		let w = Math.abs(coord1.x-coord2.x);
		let h = Math.abs(coord1.y-coord2.y);		
		ctx.rect(x, y, w, h);
		if (action == '' || action == 'fill' || action == 'f') {
			ctx.fill();
		}
		if (action == '' || action == 'stroke' || action == 's') {
			ctx.stroke();
		}
	},
	/**
	 * Draw a line between 2 points
	 * @param {Coord} coord1 The starting point.
	 * @param {Coord} coord1 The ending point:
	 */
	line: (coord1, coord2) => {
		ctx.beginPath();
		ctx.moveTo(coord1.x, coord1.y);
		ctx.lineTo(coord2.x, coord2.y);
		ctx.stroke();
	},
	/**
	 * Show a variety of lengths for debug purpuses
	 * @param {number} unit custom length to show, default 0
	 */
	units: (unit = 0) => {
		ctx.clearRect(0,0, innerWidth, innerHeight);
		let lineL = [1, 5, 10, 50, 100, 250, 500, 1000];
		if (unit > 0 && unit < cnv.width && !lineL.includes(unit)) {
			lineL.push(unit);
			lineL.sort(function(a, b) {
				return a - b;
			});
		}
		let coord = new Coord(cnv.center.x-500, cnv.center.y-(20*lineL.length/2));
		ctx.lineWidth = 4;
		lineL.forEach(l => {
			if (l == unit) {
				ctx.strokeStyle = 'red';
			}
			else {
				ctx.strokeStyle = 'black';
			}
			ctx.fillText(l, coord.x - 30, coord.y+3)
			drawF.line(coord, coordF.sumVal(coord, l, 0));
			coord.add(0, 20);
		});
	}
};
animate = (game) => {
	ctx.clearRect(0,0, innerWidth, innerHeight);
	game.backend();
	game.frontend();
	requestAnimationFrame(() => {animate(game)});
}