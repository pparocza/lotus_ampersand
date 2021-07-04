function rampDelaySection(startTime, now){

	var startTime = startTime;
	var now = now;

	playRampDelays1(startTime, now, bar*34, bar*4);
	playRampDelays2(startTime+(bar*8), now, bar*31, bar*4);
	playRampDelays3(startTime+(bar*24), now, bar*31, bar*4);

	l2.stopAtTime(now+startTime+(bar*31));
	l3.stopAtTime(now+startTime+(bar*31));

	l1.stopAtTime(now+startTime+(bar*34));

}
