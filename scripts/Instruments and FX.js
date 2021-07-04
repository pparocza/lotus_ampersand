function InstrumentConstructorTemplate(){

	this.output = audioCtx.createGain();

}

InstrumentConstructorTemplate.prototype = {

	output: this.output,

	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------

function Instrument(){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();
	this.startArray = [];

}

Instrument.prototype = {

	input: this.input,
	output: this.output,
	startArray: this.startArray,

	instrumentMethod: function(){
		this.startArray = [];
	},

	bandpassDelay: function(f, Q, dL, fB, pV, g){

		this.freq = f;
		this.Q = Q;
		this.dL = dL;
		this.fB = fB;
		this.pV = pV;
		this.g = g;

		this.f = new MyBiquad("bandpass", this.freq, this.Q);
		this.d = new MyDelay(this.dL, this.fB, 1);
		this.pan = new MyPanner2(this.pV);

		this.input.connect(this.f.input);

		this.f.connect(this.d);
		this.d.connect(this.pan);

		this.pan.connect(this.output);

		this.startArray = [];
	},

	start: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}
	},

	stop: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}
	},

	startAtTime: function(startTime){

		var startArray = this.startArray;
		var startTime = startTime;

		setTimeout(function(){
			for(var i=0; i<startArray.length; i++){
				startArray[i].start();
			}
		}, startTime*1000);

	},

	stopAtTime: function(stopTime){

		var startArray = this.startArray;
		var stopTime = stopTime;

		setTimeout(function(){
			for(var i=0; i<startArray.length; i++){
				startArray[i].stop();
			}
		}, startTime*1000);

	},

	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------
