//Script used only for testing drawing functions
let canvas = document.getElementById('main-canvas');
let ctx = canvas.getContext('2d');

let randomPixelPaint = () => {
	for(let i = 0 ; i < 500 ; ++i) {
		let x = Math.random()*400;
		let y = Math.random()*400;
		let red = Math.random()*255;
		let green = Math.random()*255;
		let blue = Math.random()*255;
		drawPixel(ctx, x, y, red, green, blue, 255);	
	}
}

let clearCanvas = (ctx) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let randomPaint = (ctx) => {
	clearCanvas(ctx);
	randomPixelPaint(ctx);
}

let mainAnimationLoop = () => {
	randomPaint(ctx);
	setTimeout( () => {
		mainAnimationLoop();
	}, 150);
}

//mainAnimationLoop();