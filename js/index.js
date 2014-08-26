var _updcounter  = 0;
setInterval(function() {
	_updcounter = _updcounter + 1;

  
  $('#vasCounter').text(_updcounter);
  $('#gzbCounter').text(_updcounter);
}, 60000);
