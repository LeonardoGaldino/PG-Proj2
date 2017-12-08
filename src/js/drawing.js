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

var paintFlatBottomTriangle = (ctx, trg) => {
	let ps = trg.points;
	let deltaX = (ps[1].coordinates[0] - ps[0].coordinates[0]);
	let deltaY = (ps[1].coordinates[1] - ps[0].coordinates[1]);
	let alpha1 = parseFloat(deltaX/deltaY);
	deltaX = (ps[2].coordinates[0] - ps[0].coordinates[0]);
	deltaY = (ps[2].coordinates[1] - ps[0].coordinates[1]);
	let alpha2 = parseFloat(deltaX/deltaY);
	let curX1 = parseFloat(ps[0].coordinates[0]);
	let curX2 = parseFloat(ps[0].coordinates[0]);
	for(let curY = ps[0].coordinates[1] ; curY <= ps[1].coordinates[1] ; ++curY) {
		for(let j = curX1 ; j <= curX2 ; ++j)
			drawPixel(ctx, j, curY, 255, 0, 0, 255);
		curX1 += alpha1;
		curX2 += alpha2;
	}
}

var paintFlatTopTriangle = (ctx, trg) => {
	let ps = trg.points;
	let deltaX = (ps[2].coordinates[0] - ps[0].coordinates[0]);
	let deltaY = (ps[2].coordinates[1] - ps[0].coordinates[1]);
	let alpha1 = parseFloat(deltaX/deltaY);
	deltaX = (ps[2].coordinates[0] - ps[1].coordinates[0]);
	deltaY = (ps[2].coordinates[1] - ps[1].coordinates[1]);
	let alpha2 = parseFloat(deltaX/deltaY);
	let curX1 = parseFloat(ps[2].coordinates[0]);
	let curX2 = parseFloat(ps[2].coordinates[0]);
	for(let curY = ps[2].coordinates[1] ; curY > ps[0].coordinates[1] ; --curY) {
		for(let j = curX1 ; j <= curX2 ; ++j)
			drawPixel(ctx, j, curY, 255, 0, 0, 255);
		curX1 -= alpha1;
		curX2 -= alpha2;
	}
}

var drawTriangleScanLine = (ctx, trg) => {
	trg.sortPointsByY();
	let points = trg.points;
	//Flat top triangle
	if(points[0].coordinates[1] == points[1].coordinates[1])
		paintFlatTopTriangle(ctx, trg);
	//Flat bottom triangle
	else if(points[1].coordinates[1] == points[2].coordinates[1])
		paintFlatBottomTriangle(ctx, trg);
	//split into 2 triangles
	else {
		let deltaY12 = (points[1].coordinates[1] - points[0].coordinates[1]);
		let deltaY13 = (points[2].coordinates[1] - points[0].coordinates[1]);
		let temp = parseFloat(deltaY12/deltaY13);
		let deltaX13 = (points[2].coordinates[0] - points[0].coordinates[0]);
		temp *= deltaX13;
		let newX = (parseInt(points[0].coordinates[0] + temp));
		let newY = points[1].coordinates[1];
		let midPoint = new Point2D(newX, newY);
		let flatBottomTriangle = new Triangle2D(points[0], points[1], midPoint);
		let flatTopTriangle = new Triangle2D(points[1], midPoint, points[2]);
		paintFlatBottomTriangle(ctx, flatBottomTriangle);
		paintFlatTopTriangle(ctx, flatTopTriangle);
	}
}