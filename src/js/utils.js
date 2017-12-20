/**
 * @requires ./types/*
 */
//Capitalizes first letter of a string
function capitalize(inputString) {
    return inputString[0].toUpperCase() + inputString.slice(1);
}

//Extracts the FileName without the extension part
//And returns FileName capitalized
function getObjectName(fileName) {
    fileName = fileName.split('.')[0]; // Separates the filename from extension
    return capitalize(fileName); // Returns capitalized first letter
}

//Get Distance between 2 points
//Points can be from plane or space.
function getDistance(point1, point2) {
    let diff = point1.coordinates.map( (coord, idx) => {
        return (coord - point2.coordinates[idx]);
    });
    let squareSum = diff.reduce( (prev, cur) => {
        return (prev + cur*cur);
    }, 0);
    return Math.sqrt(squareSum);
}

//Function to determine if a point is inside a triangle
//Check if all barycentric coordinates are within [0,1]
var isInside = (barycentricCoordinates) => {
	for(let i = 0 ; i < barycentricCoordinates.length ; ++i) {
		let coord = barycentricCoordinates[i];
		if(coord < 0 || coord > 1){
			return false;
		}
	}
	return true;
}

//Gets barycentric coordinates of a point
//Uses area method to calculate barycentric coordinates
var getBarycentricCoordinates = (trg, point) => {
	let origArea = trg.getArea();
	//Degenerated triangle
	if(origArea == 0) {
		//Degenerated to ONE POINT
		if(PointOperations.areSamePoint(trg.points[0], trg.points[1]) && 
		PointOperations.areSamePoint(trg.points[1], trg.points[2])) {
			return [1,0,0];
		}
		//Below the triangle was degenerated to a segment
		if(!PointOperations.areSamePoint(trg.points[0], trg.points[1])) {
			if(trg.points[0].coordinates[0] != trg.points[1].coordinates[0]) {
				let temp = point.coordinates[0] - trg.points[1].coordinates[0];
				let temp2 = trg.points[0].coordinates[0] - trg.points[1].coordinates[0];
				let alpha = temp/temp2;
				let beta = (1-alpha);
				return [alpha, beta, 0];
			}
			let temp = point.coordinates[1] - trg.points[1].coordinates[1];
			let temp2 = trg.points[0].coordinates[1] - trg.points[1].coordinates[1];
			let alpha = temp/temp2;
			let beta = (1-alpha);
			return [alpha, beta, 0];
		}
		else if(!PointOperations.areSamePoint(trg.points[1], trg.points[2])) {
			if(trg.points[1].coordinates[0] != trg.points[2].coordinates[0]) {
				let temp = point.coordinates[0] - trg.points[2].coordinates[0];
				let temp2 = trg.points[1].coordinates[0] - trg.points[2].coordinates[0];
				let beta = temp/temp2;
				let gama = (1-beta);
				return [0, beta, gama];
			}
			let temp = point.coordinates[1] - trg.points[2].coordinates[1];
			let temp2 = trg.points[1].coordinates[1] - trg.points[2].coordinates[1];
			let alpha = temp/temp2;
			let beta = (1-alpha);
			return [alpha, beta, 0];
		}
	}
	let t2 = new Triangle2D(trg.points[0], trg.points[2], point);
	let t3 = new Triangle2D(trg.points[1], trg.points[2], point);
	let alpha = (t3.getArea()/origArea);
	let beta = (t2.getArea()/origArea);
	let gama = (1 - alpha - beta);
	return [alpha, beta, gama];
}

function convert2Dto3D(trg, point, obj) {
	let coefs = getBarycentricCoordinates(trg, point);
	let p1_3D = obj.points3D[trg.points[0].id];
	let p2_3D = obj.points3D[trg.points[1].id];
	let p3_3D = obj.points3D[trg.points[2].id];

	let endPoint = PointOperations.barycentricSum([p1_3D, p2_3D, p3_3D], coefs, true);
	return endPoint;
}

function computePhongVectorN(curPixel, trg, obj) {
	let coefs = getBarycentricCoordinates(trg, curPixel);
	let v1 = obj.triangles3D[trg.points[0].id].normalVector;
	let v2 = obj.triangles3D[trg.points[1].id].normalVector;
	let v3 = obj.triangles3D[trg.points[2].id].normalVector;
	let newVec = coefs.map((coef, idx) => {
		return (v1.coordinates[idx]*coefs[0] +
				v2.coordinates[idx]*coefs[1] +
				v3.coordinates[idx]*coefs[2]
		);
	});
	return new Vector(newVec[0], newVec[1], newVec[2]);
}

function getPhongColor(curPixel, p3D, trg, obj) {
	let vectorN = computePhongVectorN(curPixel, trg, obj)
	vectorN = vectorN.getNormalizedVector();
	let vectorV = PointOperations.subtract(new Point(0,0,0), p3D);
	vectorV = vectorV.getNormalizedVector();
	let vectorL = PointOperations.subtract(scenarioLight.focus, p3D);
	vectorL = vectorL.getNormalizedVector();
	let _VxN = VectorOperations.scalarProduct(vectorN, vectorV);
	if(_VxN < 0) {
		//reverse normal
		vectorN.multiply(-1);
	}
	let _NxL = VectorOperations.scalarProduct(vectorN, vectorL);
	let vectorR = VectorOperations.scalarMultiplication(vectorN, 2*_NxL);
	vectorR = VectorOperations.subtract(vectorR, vectorL);
	vectorR = vectorR.getNormalizedVector();
}