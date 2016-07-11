var drawing = false;
var currentShape = [];
var shapes = [];
var prevPoint = undefined;
var pointDist = 5;
var strokeColor;

var synthOpts = {
	harmonicity:3,
	modulationIndex:10,
	detune:0,
	oscillator:{
		type:"triangle"
	},
	envelope:{
		attack:0.001,
		decay:0.1,
		sustain:1,
		release:0.8
	},
	moduation:{
		type:"triangle"
	},
	modulationEnvelope:{
		attack:0.05,
		decay:0.4,
		sustain:1,
		release:0.8
	}
};

var notes = ["D3", "E3", "D4", "E4"];

var mySynth = new Tone.FMSynth(synthOpts).toMaster();
var randomWalk = new Tone.CtrlRandom({
	"min" : 0,
	"max" : notes.length,
	"integer" : true
});

function setup() {
	var ctx = createCanvas(windowWidth, windowHeight);

	strokeColor = color(255);

	fill(255);

	colorMode(HSB);
	resetShape();

	stroke(strokeColor);
	strokeWeight(5);
	textAlign(CENTER);
	textSize(36);
}

function draw() {
	background(0);

	if (!StartAudioContext.isStarted()) {
		noStroke();
		text('Tap to start audio', width/2, height/2);
		stroke(strokeColor);
	}

	var distIsBig = prevPoint && (Math.abs(mouseX-prevPoint.x)>pointDist || Math.abs(mouseY-prevPoint.y) > pointDist );

	if (drawing && (currentShape.length === 0 || distIsBig)) {
		var nextPoint = new p5.Vector(mouseX, mouseY);
		var h;
		currentShape.push( nextPoint );

		if (prevPoint) {
			var last = currentShape.length - 1;
			// var prevPoint = currentShape[ currentShape.length - 2 ];

			var x2 = mouseX;
			var y2 = mouseY;
			var x1 = prevPoint.x;
			var y1 = prevPoint.y;

			var dist = Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) );
			var dirX = (x2 - x1) / dist;
			var dirY = (y2 - y1) / dist;

			h = new p5.Vector(dirX, dirY).heading();

			// New Direction
			if (prevPoint.heading && Math.abs(prevPoint.heading - h) > 0.3) {
				console.log('new direction', h);
				strokeColor = color( map(h, -3.14, 3.14, 0, 360), 255, 255 );
				stroke(strokeColor);

				var note = notes[randomWalk.value];
				mySynth.triggerAttackRelease(note, 0.1);
				console.log(note);
			}
		}
		prevPoint = nextPoint;
		prevPoint.heading = h;
	}

	drawShapes();
	drawPoints(currentShape);
}

function mouseReleased() {
	drawing = false;

	// DONE DRAWING
	shapes.push(currentShape);
	resetShape();

}

function resetShape() {
	currentShape = [];
	prevPoint = undefined;
}

function mousePressed() {
	drawing = true;
}

// draw all the shapes
function drawShapes() {
	for (var i = 0; i < shapes.length; i++) {
		var points = shapes[i];
		drawFinishedShape(points);
	}
}

// draw a complete shape
function drawFinishedShape(points) {
	beginShape();
	for (var j = 0; j < points.length; j++) {
		vertex(points[j].x, points[j].y);
	}
	endShape(CLOSE);
}

function drawPoints(points) {
	for (var j = 0; j < points.length; j++) {
		point(points[j].x, points[j].y);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}