function loadFile() {
	var inputNode = document.getElementById('file-input-field'); //File Input DOM node
	var inputFile = inputNode.files[0]; //File is always the first element in the array
	var fileParser = new FileReader();
	fileParser.readAsText(inputFile); //This is an async function

	fileParser.onload = function(loadEvent) { //Callback for file loaded
		var parser = loadEvent.target;
		var result = parser.result; //holds the file content
		console.log(result);
	};
}