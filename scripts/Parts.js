var rate = 0.25*1.55;
var qNoteSeconds = (1/rate)*0.25;
var bar = 1/rate;
var fund = 432;

//--------------------------------------------------------------

var l1;
var fund1 = 432*0.25;
var rate1 = rate;
var bpDArray2;
var nInstruments2;
var dGain1;
var output1;
var dE1;

function initRampDelays1(){

	output1 = audioCtx.createGain();
	output1.gain.value = 13;

	var fxGain = audioCtx.createGain();
	fxGain.gain.value = 1;

	l1 = new LFO(0, 1, rate1);
	l1.buffer.makeInverseSawtooth(16);
	var l1F = new MyBiquad("lowpass", 2000, 0);
	var l1Out = new MyGain(1);

	l1.connect(l1F);
	l1F.connect(l1Out);

	var c1 = [1, M3, P5];

	var iArray = c1;

	bpDArray2 = [];
	nInstruments2 = 32;

	// del1ay the l1fo
	var dIn = new MyGain(1);
	var d1 = new MyDelay(qNoteSeconds*1.5, 0, 1);
	var d2 = new MyDelay(qNoteSeconds*1.5, 0, 1);
	var dOut = new MyGain(1);

	l1Out.connect(dIn);
	dIn.connect(d1);
	d1.connect(d2);
	d2.connect(dOut);

	for(var i=0; i<nInstruments2; i++){

		bpDArray2[i] = new Instrument();
		// f, Q, dl1, fB, pV, g
		bpDArray2[i].bandpassDelay(fund1*randomInt(1, 4)*randomArrayValue(iArray), randomInt(100, 200), (1/((randomInt(1, 9)*1.55))), 0.2, randomFloat(-1, 1), 1/(Math.pow(nInstruments2, 2)));

		if(i<nInstruments2/2){
			l1Out.connect(bpDArray2[i]);
		}
		else if (i>=nInstruments2/2){
			dOut.connect(bpDArray2[i])
		};

		bpDArray2[i].connect(fxGain);
	}

	// fx

	var w = new MyWaveShaper();
	w.makeSigmoid(10);

	fxGain.connect(w.input);
	w.connect(output1);

	//--------------------------------------------------------------

	var nDelays = 4;
	var dBase = 1/rate;
	var dEArray = [-1, -2, -3];
	var dArray = [];
	dGain1 = new MyGain(0.1);

	var dSL = new Sequence();
	dSL.additivePowers(nDelays, dBase, dEArray);
	dSL = dSL.sequence;

	var dSR = new Sequence();
	dSR.additivePowers(nDelays, dBase, dEArray);
	dSR = dSR.sequence;

	for(var i=0; i<4; i++){
		dArray[i] = new MyStereoDelay(dSL[i], dSR[i], 0.2, 1);
		w.connect(dArray[i].input);
		dArray[i].connect(dGain1);
	}

	dE1 = new Envelope([1, bar*33]);
	var dEG1 = new MyGain(0);

	dGain1.connect(dEG1); dE1.connect(dEG1.gain.gain);
	dEG1.connect(output1);

	//--------------------------------------------------------------

	var f1 = new MyBiquad("highpass", 30.251, 1.031);
	var f2 = new MyBiquad("lowpass", 9100.7, 0.98);

	output1.connect(f1.input);
	f1.connect(f2);
	f2.connect(masterGain);

}

function playRampDelays1(startTime, now, duration, rate){

	var startTime = startTime;
	var now = now;
	var duration = duration;
	var rate = rate;

	// CHORDS
	var c1 = [1, M3, P5];
	var c2 = [M6, 1, P4];
	var c4 = [M6, 1, P4];

	var cArray = [c1, c2/*, c4*/];

	var iArray = c1;

	// START
	l1.startAtTime(startTime+now);

	// CHORD PROGRESSION l1OOP
	var m = 0;
	var chordIdx;
	var t;
	var length = 1+parseInt(duration/rate);

	for(var idx=0; idx<length; idx++){

		t = startTime+now+(idx*rate);

		chordIdx = m%cArray.length;
		iArray = cArray[chordIdx];

		for(var j=0; j<nInstruments2; j++){
				bpDArray2[j].f.biquad.frequency.setValueAtTime(fund1*randomInt(1, 4)*randomArrayValue(iArray), t);
				bpDArray2[j].f.biquad.Q.setValueAtTime(randomInt(100, 200), t);

			if(chordIdx==0){
				bpDArray2[j].d.delay.delayTime.setValueAtTime((1/((randomInt(1, 9)*1.55))), t);
				bpDArray2[j].pan.setPositionAtTime(randomFloat(-1, 1), t);
			}
		}
		m++;
	};

	// START SEQUENCE DELAYS
	dE1.startAtTime(startTime+now);

}

//--------------------------------------------------------------

var l2;
var fund2 = fund;
var rate2 = rate*0.5;
var bpDArray2;
var nInstruments2;
var dGain2;
var dE2;
var output2;

function initRampDelays2(){

	output2 = audioCtx.createGain();
	output2.gain.value = 3;

	var fxGain = audioCtx.createGain();
	fxGain.gain.value = 1;

	l2 = new LFO(0, 1, rate2);
	l2.buffer.makeInverseSawtooth(16);
	var l2F = new MyBiquad("lowpass", 2000, 0);
	var l2Out = new MyGain(1);

	l2.connect(l2F);
	l2F.connect(l2Out);

	var c1 = [1, M3, P5];

	var iArray = c1;

	bpDArray1 = [];
	nInstruments1 = 32;

	// del2ay the l2fo
	var dIn = new MyGain(1);
	var d1 = new MyDelay(qNoteSeconds*1.5, 0, 1);
	var d2 = new MyDelay(qNoteSeconds*1.5, 0, 1);
	var dOut = new MyGain(1);

	l2Out.connect(dIn);
	dIn.connect(d1);
	d1.connect(d2);
	d2.connect(dOut);

	for(var i=0; i<nInstruments1; i++){

		bpDArray1[i] = new Instrument();
		// f, Q, dl2, fB, pV, g
		bpDArray1[i].bandpassDelay(fund2*randomInt(1, 4)*randomArrayValue(iArray), randomInt(100, 200), (1/((randomInt(1, 9)*1.55))), 0.2, randomFloat(-1, 1), 1/(Math.pow(nInstruments1, 2)));

		if(i<nInstruments1/2){
			l2Out.connect(bpDArray1[i]);
		}
		else if (i>=nInstruments1/2){
			dOut.connect(bpDArray1[i])
		};

		bpDArray1[i].connect(fxGain);

	}

	// fx

	var w = new MyWaveShaper();
	w.makeSigmoid(10);

	fxGain.connect(w.input);
	w.connect(output2);

	//--------------------------------------------------------------

	var nDelays = 4;
	var dBase = 1/rate;
	var dEArray = [-1, -2, -3];
	var dArray = [];
	dGain2 = new MyGain(0.1);

	var dSL = new Sequence();
	dSL.additivePowers(nDelays, dBase, dEArray);
	dSL = dSL.sequence;

	var dSR = new Sequence();
	dSR.additivePowers(nDelays, dBase, dEArray);
	dSR = dSR.sequence;

	for(var i=0; i<4; i++){
		dArray[i] = new MyStereoDelay(dSL[i], dSR[i], 0.2, 1);
		w.connect(dArray[i].input);
		dArray[i].connect(dGain2);
	}

	dE2 = new Envelope([1, bar*33]);
	var dEG2 = new MyGain(0);

	dGain2.connect(dEG2); dE2.connect(dEG2.gain.gain);
	dEG2.connect(output2);

	//--------------------------------------------------------------

	var f1 = new MyBiquad("highpass", 30.251, 1.031);
	var f2 = new MyBiquad("lowpass", 9100.7, 0.98);

	output2.connect(f1.input);
	f1.connect(f2);
	f2.connect(masterGain);

}

function playRampDelays2(startTime, now, duration, rate){

	var startTime = startTime;
	var now = now;
	var duration = duration;
	var rate = rate;

	// CHORDS
	var c1 = [1, M3, P5];
	var c2 = [M6, 1, P4];
	var c4 = [M6, 1, P4];

	var cArray = [c1, c2/*, c4*/];

	var iArray = c1;

	// START
	l2.startAtTime(startTime+now);

	// CHORD PROGRESSION l1OOP
	var m = 0;
	var chordIdx;
	var t;
	var length = parseInt(duration/rate);

	for(var idx=0; idx<length; idx++){

		t = startTime+now+(idx*rate);

		chordIdx = m%cArray.length;
		iArray = cArray[chordIdx];

		for(var j=0; j<nInstruments2; j++){
				bpDArray1[j].f.biquad.frequency.setValueAtTime(fund2*randomInt(1, 4)*randomArrayValue(iArray), t);
				bpDArray1[j].f.biquad.Q.setValueAtTime(randomInt(100, 200), t);

			if(chordIdx==0){
				bpDArray1[j].d.delay.delayTime.setValueAtTime((1/((randomInt(1, 9)*1.55))), t);
				bpDArray1[j].pan.setPositionAtTime(randomFloat(-1, 1), t);
			}
		}
		m++;
	};

	// START SEQUENCE DELAYS
	dE2.startAtTime(startTime+now);

}

//--------------------------------------------------------------

var l3;
var fund3 = fund/2;
var rate3 = rate*2;
var bpDArray3;
var nInstruments3;
var dGain3;
var output3;

function initRampDelays3(){

	output3 = audioCtx.createGain();
	output3.gain.value = 2.5;

	var fxGain = audioCtx.createGain();
	fxGain.gain.value = 1;

	l3 = new LFO(0, 1, rate3);
	l3.buffer.makeInverseSawtooth(16);
	var l3F = new MyBiquad("lowpass", 2000, 0);
	var l3Out = new MyGain(1);

	l3.connect(l3F);
	l3F.connect(l3Out);

	var c1 = [1, M3, P5];

	var iArray = c1;

	bpDArray3 = [];
	nInstruments3 = 32;

	// del3ay the l3fo
	var dIn = new MyGain(1);
	var d1 = new MyDelay(qNoteSeconds*1.5, 0, 1);
	var d2 = new MyDelay(qNoteSeconds*1.5, 0, 1);
	var dOut = new MyGain(1);

	l3Out.connect(dIn);
	dIn.connect(d1);
	d1.connect(d2);
	d2.connect(dOut);

	for(var i=0; i<nInstruments3; i++){

		bpDArray3[i] = new Instrument();
		// f, Q, dl3, fB, pV, g
		bpDArray3[i].bandpassDelay(fund3*randomInt(1, 4)*randomArrayValue(iArray), randomInt(100, 200), (1/((randomInt(1, 9)*1.55))), 0.2, randomFloat(-1, 1), 1/(Math.pow(nInstruments3, 2)));

		if(i<nInstruments3/2){
			l3Out.connect(bpDArray3[i]);
		}
		else if (i>=nInstruments3/2){
			dOut.connect(bpDArray3[i])
		};

		bpDArray3[i].connect(fxGain);
	}

	// fx

	var w = new MyWaveShaper();
	w.makeSigmoid(10);

	fxGain.connect(w.input);
	w.connect(output3);

	//--------------------------------------------------------------

	var nDelays = 4;
	var dBase = 2;
	var dEArray = [-3, -4, -5];
	var dArray = [];
	dGain3 = new MyGain(0.1);

	var dSL = new Sequence();
	dSL.additivePowers(nDelays, dBase, dEArray);
	dSL = dSL.sequence;

	var dSR = new Sequence();
	dSR.additivePowers(nDelays, dBase, dEArray);
	dSR = dSR.sequence;

	for(var i=0; i<4; i++){
		dArray[i] = new MyStereoDelay(dSL[i], dSR[i], 0.2, 1);
		w.connect(dArray[i].input);
		dArray[i].connect(dGain3);
	}

	//--------------------------------------------------------------

	var f1 = new MyBiquad("highpass", 30.251, 1.031);
	var f2 = new MyBiquad("lowpass", 9100.7, 0.98);

	output3.connect(f1.input);
	f1.connect(f2);
	f2.connect(masterGain);

}

function playRampDelays3(startTime, now, duration, rate){

	var startTime = startTime;
	var now = now;
	var duration = duration;
	var rate = rate;

	// CHORDS
	var c1 = [1, M3, P5];
	var c2 = [M6, 1, P4];
	var c4 = [M6, 1, P4];

	var cArray = [c1, c2/*, c4*/];

	var iArray = c1;

	// START
	l3.startAtTime(startTime+now);

	// CHORD PROGRESSION l1OOP
	var m = 0;
	var chordIdx;
	var t;
	var length = parseInt(duration/rate);

	for(var idx=0; idx<length; idx++){

		t = startTime+now+(idx*rate);

		chordIdx = m%cArray.length;
		iArray = cArray[chordIdx];

		for(var j=0; j<nInstruments2; j++){
				bpDArray3[j].f.biquad.frequency.setValueAtTime(fund3*randomInt(1, 4)*randomArrayValue(iArray), t);
				bpDArray3[j].f.biquad.Q.setValueAtTime(randomInt(100, 200), t);

			if(chordIdx==0){
				bpDArray3[j].d.delay.delayTime.setValueAtTime((1/((randomInt(1, 9)*1.55))), t);
				bpDArray3[j].pan.setPositionAtTime(randomFloat(-1, 1), t);
			}
		}
		m++;
	};

	// START SEQUENCE DELAYS
	dGain3.connect(output3);

}

//--------------------------------------------------------------
