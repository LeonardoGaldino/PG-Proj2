//Function used to paint 1 pixel on the (x,y) coordinate
//with color rgba(red, green, blue, alpha)
//red, green, blue, alpha are in range (0,255)
function drawPixel(ctx, x, y, red, green, blue, alpha) {
	var imageData = ctx.createImageData(1,1);
	imageData.data[0] = red;
	imageData.data[1] = green;
	imageData.data[2] = blue;
	imageData.data[3] = alpha;
	ctx.putImageData(imageData, x, y);
}
//Script used only for testing drawing functions
var canvas = document.getElementById('main-canvas');
var ctx = canvas.getContext('2d');

function randomPixelPaint() {
	for(var i = 0 ; i < 500 ; ++i) {
		var x = Math.random()*400;
		var y = Math.random()*400;
		var red = Math.random()*255;
		var green = Math.random()*255;
		var blue = Math.random()*255;
		drawPixel(ctx, x, y, red, green, blue, 255);	
	}
}

function clearCanvas(ctx) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function randomPaint(ctx) {
	clearCanvas(ctx);
	randomPixelPaint(ctx);
}

function mainAnimationLoop() {
	randomPaint(ctx);
	setTimeout( function() {
		mainAnimationLoop();
	}, 150);
}

mainAnimationLoop();