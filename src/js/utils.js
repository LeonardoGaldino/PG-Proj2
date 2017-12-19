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
//Uses Heron's formula to calculate triangle's area.
var getBarycentricCoefficients = (trg, point) => {
	let origArea = trg.getArea();
	let t1 = new Triangle2D(trg.points[0], trg.points[1], point);
	let t2 = new Triangle2D(trg.points[0], trg.points[2], point);
	let t3 = new Triangle2D(trg.points[1], trg.points[2], point);
	let alpha = (t3.getArea()/origArea);
	let beta = (t2.getArea()/origArea);
	let gama = (t1.getArea()/origArea);
	return [alpha, beta, gama];
}

function getBarycentricCoordinates (trg, point, obj){
	let coefs = getBarycentricCoefficients(trg, point);
	let p1_3D = obj.points3D[trg.points[0].id];
	let p2_3D = obj.points3D[trg.points[1].id];
	let p3_3D = obj.points3D[trg.points[2].id];
	let endPoint = PointOperations.barycentricSum([p1_3D,p2_3D,p3_3D], coefs);
}
// calculates N = alpha*n1 + beta*n2 + gama*n3
function getNVector(trg, point, obj){
	let coefs = getBarycentricCoefficients(trg, point);
	let barcoord = getBarycentricCoordinates (trg, point, obj);
	let normal = [];
	for(let i = 0; i < 3; ++i){
		var temp = obj.points3D[trg.points[i].id].normalVector; 
		normal.push(VectorOperations.scalarMultiplication(temp, coefs[i]));
	}
	let n = VectorOperations.add(VectorOperations.add(n[0], n[1]), n[2]);
	n = n.getNormalizedVector();
}