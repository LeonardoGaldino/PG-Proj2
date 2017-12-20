/**
 * @requires ./types/*
 * @requires ./exceptions.js
 * @requires ./utils.js
 */
var defaultColor = {
	red: 60,
	green: 16,
	blue: 218,
	alpha: 255
};

var canvasColor = {
	red: 213,
	green: 213,
	blue: 213,
	alpha: 255
};

var zBuffer;

//Function used to initialize the Z-Buffer array
// with max distance and the equivalent color
function initializeZBuffer(){
	zBuffer = [];
	for(var i = 0; i < canvasWidth ; ++i) {
		zBuffer.push([]);
		for(var j = 0; j < canvasHeight ; ++j) {
			zBuffer[i].push(new ZBufferData(Number.MAX_VALUE, canvasColor));
		}
	}	
}

//Function used to paint 1 pixel on the (x,y) coordinate
//with color rgba(red, green, blue, alpha)
//red, green, blue, alpha are in range (0,255)
function drawPixel (ctx, x, y, red, green, blue, alpha) {
	var imageData = ctx.createImageData(1,1);
	imageData.data[0] = red;
	imageData.data[1] = green;
	imageData.data[2] = blue;
	imageData.data[3] = alpha;
	ctx.putImageData(imageData, x, y);
}

//Function that draws every pixel inside a triangle
//Uses Barycentric algorithm to do it (not as efficient as ScanLine)
function drawTriangleBarycentricAlgorithm (ctx, trg) {
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
				drawPixel(ctx, j, i, defaultColor.red, defaultColor.green, 
									defaultColor.blue, defaultColor.alpha);
		}
	}
}

//Basically draw a horizontal line of pixels
function drawLine (ctx, x1, x2, y, trg, obj) {
	x1 = parseInt(x1);
	x2 = parseInt(x2);
	let startX = Math.min(x1, x2);
	let endX = Math.max(x1, x2);
	for(let j = startX ; j <= endX ; ++j){
		let curPixel = new Point2D(j, y);
		let curZ = getZCoordinate(trg, curPixel, obj);
		if(j < canvasWidth && j >= 0 && y >= 0
			&& y < zBuffer[j].length) {
			if(curZ < zBuffer[j][y].distance) {
				zBuffer[j][y].distance = curZ;
				zBuffer[j][y].color = defaultColor;
				//Make all illumination calculations here
			}
		}
	}
}

//Draw triangle with two points with equals Y on the bottom of the third point
function drawFlatBottomTriangle (ctx, trg, origTrg, obj) {
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
		//*DrawLine Function is a custom function implemented above*
		drawLine(ctx, curX1, curX2, curY, origTrg, obj);
		curX1 += alpha1;
		curX2 += alpha2;
	}
}

//Draw triangle with two points with equals Y on the top of the third point
function drawFlatTopTriangle (ctx, trg, origTrg, obj) {
	let ps = trg.points;
	let deltaX = (ps[2].coordinates[0] - ps[0].coordinates[0]);
	let deltaY = (ps[2].coordinates[1] - ps[0].coordinates[1]);
	let alpha1 = parseFloat(deltaX/deltaY);
	deltaX = (ps[2].coordinates[0] - ps[1].coordinates[0]);
	deltaY = (ps[2].coordinates[1] - ps[1].coordinates[1]);
	let alpha2 = parseFloat(deltaX/deltaY);
	let curX1 = parseFloat(ps[2].coordinates[0]);
	let curX2 = parseFloat(ps[2].coordinates[0]);
	for(let curY = ps[2].coordinates[1] ; curY >= ps[0].coordinates[1] ; --curY) {
		//*DrawLine Function is a custom function implemented above*
		drawLine(ctx, curX1, curX2, curY, origTrg, obj);
		curX1 -= alpha1;
		curX2 -= alpha2;
	}
}

//Draw triangle using ScanLine algorithm (main rasterization algorithm)
function drawTriangleScanLine (ctx, trg, obj) {
	trg.sortPointsByYX();
	let points = trg.points;
	//Flat top triangle
	if(points[0].coordinates[1] == points[1].coordinates[1])
		drawFlatTopTriangle(ctx, trg, trg, obj);
	//Flat bottom triangle
	else if(points[1].coordinates[1] == points[2].coordinates[1])
		drawFlatBottomTriangle(ctx, trg, trg, obj);
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
		drawFlatBottomTriangle(ctx, flatBottomTriangle, trg, obj);
		drawFlatTopTriangle(ctx, flatTopTriangle, trg, obj);
	}
}

function drawZBuffer(ctx) {
	for(var i = 0; i < canvasWidth; ++i) {
		for(var j = 0; j < canvasHeight; ++j) {
			let cur = zBuffer[i][j].color;
			drawPixel(ctx, i, j, cur.red, cur.green, cur.blue, cur.alpha);
		}
	}	
}