//Parses file content into objects
var storeFileContent = (fileContent, fileName) => {
	let objectName = getObjectName(fileName);
	let newObject = new Object3D(objectName);
	let lines = fileContent.split('\n');
	let limits = lines[0].split(' ');
	let numPoints = limits[0];
	let numTriangles = limits[1];
	let objectPoints = [];
	let idx;
	for(idx = 1 ; idx <= numPoints ; ++idx) {
		let coords = lines[idx].split(' ');
		let x = parseFloat(coords[0]);
		let y = parseFloat(coords[1]);
		let z = parseFloat(coords[2]);

		if(isNaN(x) || isNaN(y) || isNaN(z)) {
			let exceptionMessage = `Arquivo ${fileName}: Ponto ${idx} com coordenada inválida. Revise o arquivo enviado.`
			throw new PointCoordinateParseException(exceptionMessage);
		}

		objectPoints.push(new Point(x, y, z));
	}

	for(; idx < numTriangles ; ++idx) {
		let points = lines[idx].split(' ');
		if(points.length < 3) { // Avoid blank lines that separates the input
			++numTriangles;
			continue;
		}
		let p1 = parseFloat(points[0]);
		let p2 = parseFloat(points[1]);
		let p3 = parseFloat(points[2]);

		if(isNaN(p1) || isNaN(p2) || isNaN(p3)) {
			let exceptionMessage = `Arquivo ${fileName}: Triângulo ${idx} com referência para ponto inválida. Revise o arquivo enviado.`
			throw new PointReferenceException(exceptionMessage);	
		}

		newObject.triangles.push(new Triangle(objectPoints[p1-1],
											objectPoints[p2-1],
											objectPoints[p3-1]));
	}

	scenarioObjects.push(newObject);
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
var loadFile = () => {
	//Validates if files are correctly submitted
	if(!validateFilesInputs()) {
		Materialize.toast('Selecione uma câmera e um ou mais objetos!', 4000);
		return;
	}
	scenarioObjects = []; //Erases all scenarios objects
	let fileInputNode = document.getElementById('file-input-field'); //File Input DOM node
	let objectInputFiles = fileInputNode.files; //Array of selected objects

	for(let idx = 0; idx < objectInputFiles.length ; ++idx) { //For each file, parse it and load its content
		let file = objectInputFiles[idx];
		let fileParser = new FileReader();

		fileParser.onload = function(loadEvent) { //Callback for file loaded
			let parser = loadEvent.target;
			let result = parser.result; //holds the file content
			storeFileContent(result, file.name);
		};

		fileParser.onerror = function(errorEvent) { //Handle error while loading file
			throw new FileReadException('Erro ao carregar arquivo. Selecione arquivos de texto!');
		}

		fileParser.readAsText(file); //This is an async function
	}
}

//Array of Object3D objects to be rendered
let scenarioObjects = [];

