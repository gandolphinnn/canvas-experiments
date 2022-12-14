let corns = new Array(3);
const length = 1050;
corns[0] = new Coord(500, 920);
corns[1] = new Coord(corns[0].x + length/2, corns[0].y-Math.sqrt(3)/2*length);
corns[2] = new Coord(corns[0].x + length, corns[0].y);
ctx.fillStyle = 'red';
corns.forEach(corn => {
	drawF.circle(corn, 0.1, 'fill');
});
ctx.fillStyle = 'black';
let points = new Array();
let x = mathF.rand(corns[0].x, corns[0].x + length);
let y = [corns[0].y,corns[0].y-1.7320508075688767*(Math.abs(x-(corns[0].x+length/2))*-1+(corns[0].x+ length/2)-corns[0].x)][mathF.rand(0, 1)];
point = new Coord(x, y);
drawF.circle(point, 0.1, 'fill');
/* for (let i = 1; i < 1000000; i++) {
	let c = corns[mathF.rand(0, 2)]
	point = new Coord((c.x+point.x)/2, (c.y+point.y)/2);
	drawF.circle(point, 0.1, 'fill');
} */
setInterval(() => {
	for (let i = 0; i < 50; i++) {		
		let c = corns[mathF.rand(0, 2)]
		point = new Coord((c.x+point.x)/2, (c.y+point.y)/2);
		drawF.circle(point, 0.1, 'fill');
	}
}, 0.1);