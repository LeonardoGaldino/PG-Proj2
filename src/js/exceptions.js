function FileReadException(message) {
	this.message = message;
	this.name = 'FileReadException';
}

function PointCoordinateParseException(message) {
	this.message = message;
	this.name = 'PointCoordinateParseException';
}

function PointReferenceException(message) {
	this.message = message;
	this.name = 'PointReferenceException';
}

function MatrixSizeException(message) {
	this.message = message;
	this.name = 'MatrixSizeException';	
}

function MatrixMultiplicationException(message) {
	this.message = message;
	this.name = 'MatrixMultiplicationException';	
}