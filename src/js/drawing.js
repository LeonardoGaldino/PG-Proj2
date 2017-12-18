var defaultColor = {
	red: 60,
	green: 16,
	blue: 218,
	alpha: 255
};

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
function drawLine(ctx, x1, x2, y) {
	let startX = Math.min(x1, x2);
	let endX = Math.max(x1, x2);
	for(let j = startX ; j <= endX ; ++j)
		drawPixel(ctx, j, y, defaultColor.red, defaultColor.green, 
						defaultColor.blue, defaultColor.alpha);
}

//Draw triangle with two points with equals Y on the bottom of the third point
function drawFlatBottomTriangle (ctx, trg) {
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
		drawLine(ctx, curX1, curX2, curY);
		curX1 += alpha1;
		curX2 += alpha2;
	}
}

//Draw triangle with two points with equals Y on the top of the third point
function drawFlatTopTriangle (ctx, trg) {
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
		drawLine(ctx, curX1, curX2, curY);
		curX1 -= alpha1;
		curX2 -= alpha2;
	}
}

//Draw triangle using ScanLine algorithm (main rasterization algorithm)
function drawTriangleScanLine (ctx, trg) {
	trg.sortPointsByYX();
	let points = trg.points;
	//Flat top triangle
	if(points[0].coordinates[1] == points[1].coordinates[1])
		drawFlatTopTriangle(ctx, trg);
	//Flat bottom triangle
	else if(points[1].coordinates[1] == points[2].coordinates[1])
		drawFlatBottomTriangle(ctx, trg);
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
		drawFlatBottomTriangle(ctx, flatBottomTriangle);
		drawFlatTopTriangle(ctx, flatTopTriangle);
	}
}

function phong (point) { //usa scenarioCamera e scenarioLight do main, recebe so o pixel sendo analisado
	    /*
	    Calcular e normalizar vetores:
	    L, vetor formado pelo ponto aproximado P e o ponto da fonte de luz
	    V, vetor formado pelo ponto aproximado P e pelo foco da câmera C
	    N, normal aproximada do ponto P, pode ser calculado aplicando as coordenadas baricentricas de P às normais dos vértices 
		R, vetor de reflexão 
		*/
	    let P = new Vector(-point.coordinates[0], -point.coordinates[1], -point.coordinates[2]);
	    let L = PointOperations.addVector(scenarioLight.focus, P).getNormalizedVector();
	    let V = PointOperations.addVector(scenarioCamera.focus, P).getNormalizedVector();
		let N = ;
		let R = VectorOperations.addVector(2*(VectorOperations.scalarMultiplication(N, VectorOperations.scalarProduct(N, L))), VectorOperations.scalarMultiplication(L, -1));
		let Ip;
		/*
		Checar os seguintes produtos internos
		Se V. N < 0 : a normal está invertida, fazer N = -N
		Se N. L < 0 : não existe reflexão difusa nem especular 
		Se R. V < 0 : não existe reflexão especular. 
		*/
		//formula: KaIa + Kd(LN)Od*Il + Ks(RV)^n Il
		if(VectorOperations.scalarProduct(V, N) < 0) { N = VectorOperations.scalarMultiplication(N, -1)};
		if(VectorOperations.scalarProduct(N, L) < 0) {
			Ip = VectorOperations.scalarMultiplication(scenarioLight.ambColor, scenarioLight.ambRefl);
		} 
		if(VectorOperations.scalarProduct(R, V) < 0) {
			Ip = VectorOperations.scalarMultiplication(scenarioLight.ambColor, scenarioLight.ambRefl) +
			VectorOperations.componentProduct(VectorOperations.scalarMultiplication(scenarioLight.difVector, VectorOperations.scalarProduct(L, N)*scenarioLight.difConstant), scenarioLight.sourceColor);
		} else {
			Ip = VectorOperations.scalarMultiplication(scenarioLight.ambColor, scenarioLight.ambRefl) +
				VectorOperations.componentProduct(VectorOperations.scalarMultiplication(scenarioLight.difVector, VectorOperations.scalarProduct(L, N)*scenarioLight.difConstant), scenarioLight.sourceColor) +
				VectorOperations.scalarMultiplication(scenarioLight.sourceColor, spec*(Math.pow(VectorOperations.scalarProduct(R, V), scenarioLight.rugosity)));
		}
	
	
	}
	