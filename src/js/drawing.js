//Function used to paint 1 pixel on the (x,y) coordinate
//with color rgba(red, green, blue, alpha)
//red, green, blue, alpha are in range (0,255)
var drawPixel = (ctx, x, y, red, green, blue, alpha) => {
	var imageData = ctx.createImageData(1,1);
	imageData.data[0] = red;
	imageData.data[1] = green;
	imageData.data[2] = blue;
	imageData.data[3] = alpha;
	ctx.putImageData(imageData, x, y);
}

//Function that draws every pixel inside a triangle
var drawTriangle = (ctx, trg) => {
	let xmax = -1;
	let xmin = canvasWidth+1;
	let ymax = -1;
	let ymin = canvasHeight+1;
	for(let i = 0 ; i < trg.points.length ; ++i) {
		let p = trg.points[i];
		if(p.coordinates[0] > xmax)
			xmax = p.coordinates[0];
		if(p.coordinates[0] < xmin)
			xmin = p.coordinates[0];
		if(p.coordinates[1] > ymax)
			ymax = p.coordinates[1];
		if(p.coordinates[1] < ymin)
			ymin = p.coordinates[1];
	}
	for(let i = ymin ; i <= ymax ; ++i) {
		for(let j = xmin ; j <= xmax ; ++j) {
			let tempPoint = new Point2D(j,i);
			let barycentricCoords = getBarycentricCoordinates(trg, tempPoint);
			if(isInside(barycentricCoords))
				drawPixel(ctx, j, i, 255, 0, 0, 255);
		}
	}
}