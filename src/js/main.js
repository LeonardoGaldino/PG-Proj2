var loadFile = () => {
	var inputNode = document.getElementById('file-input-field'); //File Input DOM node
	var inputFiles = inputNode.files; //Array of selected files
	for(var idx in inputFiles) { //For each file, parse it and load its content
		var file = inputFiles[idx];
		var fileParser = new FileReader();
		fileParser.readAsText(file); //This is an async function

		fileParser.onload = function(loadEvent) { //Callback for file loaded
			var parser = loadEvent.target;
			var result = parser.result; //holds the file content
			console.log(result);
		};
	}
}