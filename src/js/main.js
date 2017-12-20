/**
 * @requires ./types/*
 * @requires ./drawing.js
 * @requires ./exceptions.js
 * @requires ./utils.js
 */
var canvas = document.getElementById('main-canvas');
var ctx = canvas.getContext('2d');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
//Array of Object3D objects to be rendered
var scenarioObjects;
//Application Camera
var scenarioCamera;
//Application light source
var scenarioLight;

function drawObject(object) {
	let triangles = object.triangles2D;
	for(let i = 0 ; i < triangles.length ; ++i) {
		drawTriangleScanLine(ctx, triangles[i], object);
	}
}

//Parses object file content into objects
function storeObjectFileContent(fileContent, fileName) {
	let objectName = getObjectName(fileName);
	let newObject = new Object3D(objectName);
	let lines = fileContent.split('\n');
	let limits = lines[0].split(' ');
	let numPoints = parseInt(limits[0]);
	let numTriangles = parseInt(limits[1]);
	let idx;

	createPoints(numPoints, lines, fileName, newObject);
	createTriangles(numTriangles, lines, fileName, newObject);

	//Normalize Points normal Vector
	for(let idx = 0 ; idx < newObject.points3D.length ; ++idx) {
		let point = newObject.points3D[idx];
		point.normalVector = point.normalVector.getNormalizedVector();
	}

	//Saves new Object3D
	scenarioObjects.push(newObject);

	drawObject(newObject);
}

function createPoints(numPoints, lines, fileName, newObject){
	for(idx = 1 ; idx <= numPoints ; ++idx) {
		let coords = lines[idx].split(' ');
		let x = parseFloat(coords[0]);
		let y = parseFloat(coords[1]);
		let z = parseFloat(coords[2]);

		if(isNaN(x) || isNaN(y) || isNaN(z)) {
			let exceptionMessage = `Arquivo ${fileName}: Ponto ${idx} com coordenada inválida. Revise o arquivo enviado.`
			throw new PointCoordinateParseException(exceptionMessage);
		}
		let newPoint = new Point(x,y,z);
		//Changes newPoint to camera's point origin
		newPoint = toCameraPointOrigin(newPoint);

		//Changes base of newPoint to camera's base system
		newPoint = newPoint.baseChange(scenarioCamera.transformMatrix);
		newPoint.id = (idx-1); //Adds Point's identifier
		newPoint.normalVector = new Vector(0,0,0); //Adds the Normal Vector
		newObject.points3D.push(newPoint);
		let px = ((scenarioCamera.dist/scenarioCamera.hx)*
					(newPoint.coordinates[0]/newPoint.coordinates[2]));
		let py = ((scenarioCamera.dist/scenarioCamera.hy)*
					(newPoint.coordinates[1]/newPoint.coordinates[2]));
		px = Math.floor((px+1)*(canvasWidth/2));
		py = Math.floor((1-py)*(canvasHeight/2));
		let newPoint2D = new Point2D(px, py);
		newPoint2D.id = (idx-1);
		newObject.points2D.push(newPoint2D);
	}
}

function toCameraPointOrigin (point) {
	let originChangeVector = new Vector(-scenarioCamera.focus.coordinates[0],
		-scenarioCamera.focus.coordinates[1],
		-scenarioCamera.focus.coordinates[2]);
	return PointOperations.addVector(point, originChangeVector);
}

function createTriangles(numTriangles, lines, fileName, newObject){
	for(; idx < lines.length ; ++idx) {
		let points = lines[idx].split(' ');
		if(points.length < 3) { // Avoid blank lines that separates the input
			++numTriangles;
			continue;
		}
		let p1 = parseInt(points[0]);
		let p2 = parseInt(points[1]);
		let p3 = parseInt(points[2]);

		if(isNaN(p1) || isNaN(p2) || isNaN(p3) ||
			p1 < 1 || p1 > newObject.points3D.length || p2 < 1 || p2 > newObject.points3D.length
			|| p3 < 1 || p2 > newObject.points3D.length) {
			let exceptionMessage = `Arquivo ${fileName}: Triângulo ${idx} com referência para ponto inválida. Revise o arquivo enviado.`
			throw new PointReferenceException(exceptionMessage);	
		}
		let newTriangle3D = new Triangle3D(newObject.points3D[p1-1], 
								newObject.points3D[p2-1], newObject.points3D[p3-1]);
		newObject.triangles3D.push(newTriangle3D);
		let tNormalVector = newTriangle3D.normalVector;
		newObject.points3D[p1-1].normalVector = 
				VectorOperations.add(newObject.points3D[p1-1].normalVector, tNormalVector);
		newObject.points3D[p2-1].normalVector = 
				VectorOperations.add(newObject.points3D[p2-1].normalVector, tNormalVector);
		newObject.points3D[p3-1].normalVector = 
				VectorOperations.add(newObject.points3D[p3-1].normalVector, tNormalVector);
		let newTriangle2D = new Triangle2D(newObject.points2D[p1-1],
					newObject.points2D[p2-1], newObject.points2D[p3-1]);
		newObject.triangles2D.push(newTriangle2D);
	}
}

//Parses camera file content into objects
function storeCameraFileContent(fileContent, fileName) {
	let lines = fileContent.split('\n');
	let inputs = [];
	for(let idx = 0 ; idx < 4 ; ++idx) {
		let parsedLine = lines[idx].split(' ').map( (coord) => {
			let newCoord = parseFloat(coord);
			if(isNaN(newCoord)) {
				let exceptionMessage = `Arquivo ${fileName}: Ponto ${idx} com coordenada inválida. Revise o arquivo enviado.`
				throw new PointCoordinateParseException(exceptionMessage);
			}
			return newCoord;
		});
		inputs.push(parsedLine);
	}

	let focusPoint = new Point(inputs[0][0], inputs[0][1], inputs[0][2]);
	let directionVector = new Vector(inputs[1][0], inputs[1][1], inputs[1][2]);
	let upVector = new Vector(inputs[2][0], inputs[2][1], inputs[2][2]);
	let dist = inputs[3][0];
	let hx = inputs[3][1];
	let hy = inputs[3][2];

	scenarioCamera = new Camera(focusPoint, directionVector, upVector, dist, hx, hy);
}

//Parses light file content into scenarioLight
function storeLightFileContent(fileContent, fileName) {
	let lines = fileContent.split('\n');
	let inputs = [];
	for(let idx = 0 ; idx < 8 ; ++idx) {
		let lineElements = lines[idx].split(' ');
		inputs.push(lineElements);
	}

	let focus = new Point(parseFloat(inputs[0][0]),
						parseFloat(inputs[0][1]), parseFloat(inputs[0][2]));
	//Changes focus to camera's point origin
	focus = toCameraPointOrigin(focus);
	//Changes base of focus to camera's base system
	focus = focus.baseChange(scenarioCamera.transformMatrix);
	let ambRefl = parseFloat(inputs[1][0]);
	let ambColor = [parseInt(inputs[2][0]), parseInt(inputs[2][1]), 
							parseInt(inputs[2][2])];
	let difConstant = parseFloat(inputs[3][0]);
	let difVector = [parseFloat(inputs[4][0]), parseFloat(inputs[4][1]),
							parseFloat(inputs[4][2])];
	let spec = parseFloat(inputs[5][0]);
	let sourceColor = [parseInt(inputs[6][0]), parseInt(inputs[6][1]), parseInt(inputs[6][2])];
	let rugosity = parseFloat(inputs[7][0]);

	scenarioLight = new Illumination(focus, ambRefl, ambColor, difConstant, 
										difVector, spec, sourceColor, rugosity);
}

//Generic function to load files
function loadFiles(fieldId, callbackFunction) {
	let inputNode = document.getElementById(fieldId);
	let inputFiles = inputNode.files;

	for(let i = 0 ; i < inputFiles.length ; ++i) {
		let file = inputFiles[i];
		let fileParser = new FileReader();

		fileParser.onload = function(loadEvent) { //Callback for file loaded
			let parser = loadEvent.target;
			let result = parser.result; //holds the file content
			callbackFunction(result, file.name);
		};

		fileParser.onerror = function(errorEvent) { //Handle error while loading file
			throw new FileReadException(`Erro ao carregar arquivo ${file.name}. Selecione arquivos de texto!`);
		}

		fileParser.readAsText(file); //This is an async function
	}

}

//Validates if user selected one or more object files
//Validates if user selected exactly one camera file
function validateFilesInputs() {
	let fileInputNode = document.getElementById('file-input-field'); //File DOM node
	let cameraInputNode = document.getElementById('camera-input-field'); //Camera DOM node
	let lightInputNode = document.getElementById('light-input-field'); //Illumination DOM node
	let numObjectFiles = fileInputNode.files.length; //Number of selected objects files
	let numCameraFiles = cameraInputNode.files.length; //Number of selected camera files
	let numLightFiles = lightInputNode.files.length // Number of selected light files
	return ( (numCameraFiles == 1) && (numObjectFiles > 0) && (numLightFiles > 0) );
}

function eraseCanvas() {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	initializeZBuffer();
}

//Load all the selected files and parses it into objects
function runApp() {
	//Validates if files are correctly submitted
	if(!validateFilesInputs()) {
		Materialize.toast('Selecione uma câmera, uma iluminação e um ou mais objetos!', 4000);
		return;
	}

	//Erases all scenarios objects
	eraseCanvas();
	scenarioObjects = [];

	//Reads Camera into scenarioCamera
	loadFiles('camera-input-field', storeCameraFileContent);

	//Loads all objects into scenarioObjects
	loadFiles('file-input-field', storeObjectFileContent);

	//Load illumination files into scenarioLight
	loadFiles('light-input-field', storeLightFileContent);

}