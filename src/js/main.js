//Parses object file content into objects
var storeObjectFileContent = (fileContent, fileName) => {
	let objectName = getObjectName(fileName);
	let newObject = new Object3D(objectName);
	let lines = fileContent.split('\n');
	let limits = lines[0].split(' ');
	let numPoints = parseInt(limits[0]);
	let numTriangles = parseInt(limits[1]);
	let idx;

	//Creates Points
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
		newPoint.id = (idx-1); //Adds Point's identifier
		newPoint.normalVector = new Vector(0,0,0); //Adds the Normal Vector
		newObject.points.push(newPoint);
	}

	//Creates triangles
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
			p1 < 1 || p1 > newObject.points.length || p2 < 1 || p2 > newObject.points.length
			|| p3 < 1 || p2 > newObject.points.length) {
			let exceptionMessage = `Arquivo ${fileName}: Triângulo ${idx} com referência para ponto inválida. Revise o arquivo enviado.`
			throw new PointReferenceException(exceptionMessage);	
		}
		let newTriangle = new Triangle(newObject.points[p1-1], 
								newObject.points[p2-1], newObject.points[p3-1]);
		newObject.triangles.push(newTriangle);
		let tNormalVector = newTriangle.normalVector;
		newObject.points[p1-1].normalVector = 
				VectorOperations.add(newObject.points[p1-1].normalVector, tNormalVector);
		newObject.points[p2-1].normalVector = 
				VectorOperations.add(newObject.points[p2-1].normalVector, tNormalVector);
		newObject.points[p3-1].normalVector = 
				VectorOperations.add(newObject.points[p3-1].normalVector, tNormalVector);
	}

	//Normalize Points normal Vector
	for(let idx = 0 ; idx < newObject.points.length ; ++idx) {
		let point = newObject.points[idx];
		point.normalVector = point.normalVector.getNormalizedVector();
	}

	//Saves new Object3D
	scenarioObjects.push(newObject);
}

//Parses camera file content into objects
var storeCameraFileContent = (fileContent, fileName) => {
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
	let normalVector = new Vector(inputs[2][0], inputs[2][1], inputs[2][2]);
	let dist = inputs[3][0];
	let hx = inputs[3][1];
	let hy = inputs[3][2];

	scenarioCamera = new Camera(focusPoint, directionVector, normalVector, dist, hx, hy);
}

//Loads objects files and store them into objects
var loadObjects = () => {
	let fileInputNode = document.getElementById('file-input-field'); //File Input DOM node
	let objectInputFiles = fileInputNode.files; //Array of selected objects

	//Reads Objects
	for(let idx = 0; idx < objectInputFiles.length ; ++idx) { //For each file, parse it and load its content
		let file = objectInputFiles[idx];
		let fileParser = new FileReader();

		fileParser.onload = function(loadEvent) { //Callback for file loaded
			let parser = loadEvent.target;
			let result = parser.result; //holds the file content
			storeObjectFileContent(result, file.name);
		};

		fileParser.onerror = function(errorEvent) { //Handle error while loading file
			throw new FileReadException('Erro ao carregar arquivo. Selecione arquivos de texto!');
		}

		fileParser.readAsText(file); //This is an async function
	}
}

//Loads camera file and store it into camera object
var loadCamera = () => {
	let cameraInputNode = document.getElementById('camera-input-field'); //File Input DOM node
	let cameraInputFile = cameraInputNode.files[0]; //Camera file is always at index 0

	let fileParser = new FileReader();

	fileParser.onload = function(loadEvent) { //Callback for file loaded
		let parser = loadEvent.target;
		let result = parser.result; //holds the file content
		storeCameraFileContent(result, cameraInputFile.name);
	};

	fileParser.onerror = function(errorEvent) { //Handle error while loading file
		throw new FileReadException('Erro ao carregar arquivo. Selecione arquivos de texto!');
	}

	fileParser.readAsText(cameraInputFile); //This is an async function
}

//Validates if user selected one or more object files
//Validates if user selected exactly one camera file
var validateFilesInputs = () => {
	let fileInputNode = document.getElementById('file-input-field'); //File Input DOM node
	let cameraInputNode = document.getElementById('camera-input-field'); //Camera Input DOM node
	let numObjectFiles = fileInputNode.files.length; //Number of selected objects files
	let numCameraFiles = cameraInputNode.files.length; //Number of selected camera files
	return ( (numCameraFiles == 1) && (numObjectFiles > 0) );
}

//Load all the selected files and parses it into objects
var loadFiles = () => {
	//Validates if files are correctly submitted
	if(!validateFilesInputs()) {
		Materialize.toast('Selecione uma câmera e um ou mais objetos!', 4000);
		return;
	}

	scenarioObjects = []; //Erases all scenarios objects
	//Loads all objects into scenarioObjects
	loadObjects();

	//Reads Camera into scenarioCamera
	loadCamera();

}

//Array of Object3D objects to be rendered
var scenarioObjects;
//Application Camera
var scenarioCamera;

