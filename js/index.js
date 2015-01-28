var modSessions = {};
modSessions.lastcounter = -1;
modSessions.timer = 30;

modSessions.setLineNo = function (lineNo) {
	if ( isNaN(parseInt(lineNo)) ) {
		modSessions._line = -1;
	}  else {
		modSessions._line = parseInt(lineNo);
	}
	$.cookie('lastline', modSessions._line, { expires : 30 });
};

modSessions.getLineNo = function () {
	if (typeof modSessions._line === 'undefined') {
		modSessions._line = $.cookie('lastline') ;
	};
	if (typeof modSessions._line === 'undefined') {
		modSessions._line = -1 ;
	};
	return modSessions._line;
};

modSessions.showLineDetails = function (data, textStatus, jqXHR) {
//	var HeroUnits = '<h1><span class="label label-primary">Active Sessions</span></h1>';
	var HeroUnits = '<div class="jumbotron">';
	var line = modSessions.getLineNo();

		$.get( "modules/sessions/moduleEntry.php", {action:'getLineDetails',line:line}, function( data ) {
		if ( data.callstatus == "OK" ) {
			if ( data.found > 0 ) {
				HeroUnits = HeroUnits + "<h3>" + data.fullname + "</h3>";
				HeroUnits = HeroUnits + "<h4>" + data.sector + "</h4>";
				HeroUnits = HeroUnits + "<h5>" + data.contact + "</h5>";
				HeroUnits = HeroUnits + "<h5>" + data.address + "</h5>";
				HeroUnits = HeroUnits + "</div>" ;
				//alert(JSON.stringify(data));
				$("#linedetails").html(HeroUnits);
			} else {
				HeroUnits = HeroUnits + "<h3> There is no line with number " + data.line + "</h3>";
				HeroUnits = HeroUnits + "</div>" ;
				$("#linedetails").html(HeroUnits);
			}
		} 
	});
};

modSessions.getCounterUI = function (sobj) {
	var retval = '<div class="jumbotron">';

	var counter = sobj.counter;
	var started = sobj.started;
	var updated = sobj.updated;
	var tmnow = sobj.tmnow;
	
	modSessions.lastcounter = counter; 
	
	var servicerate = ((updated - started) * 10 ) / (60 * counter);
	var lastupdated = (tmnow - updated) / 60;
	
	servicerate = Math.round(servicerate) ;
	
	var lastupdateunit = " minutes";
	if ( lastupdated > 60 ) {
		lastupdateunit = " hours";
		lastupdated = lastupdated / 60;

		if ( lastupdated > 24 ) {
			lastupdateunit = " days";
			lastupdated = lastupdated / 24;
		} 
	} 
	

	lastupdated = Math.round(lastupdated) ;
	
	var itmcounter = "<span class=\"label label-success\">" + counter + "</span>";
	var itmrate = "<span class=\"label label-info\">" + servicerate + " minutes / 10 patients</span>";

	if ( counter <= 0 ) {
		itmcounter = "<span class=\"label label-danger\">" + counter + "</span>";
		itmrate = '<span class="label label-default"> Not Started Yet</span>';
	} 
	
	var itmlastupd = "<span class=\"label label-info\">" + lastupdated + lastupdateunit + " before</span>";
	
	retval = retval + "<h3>" + itmcounter + "</h3>";
	retval = retval + "<h4>" + itmrate + "</h4>";
	retval = retval + "<h5>" + itmlastupd + "</h5>";
	retval = retval + "<h6> Line Number: " + modSessions.getLineNo() + "</h6>";
	retval = retval + "</div>";	
	
	return retval;
};

$(document).ajaxError(function(xhr, error) {
	 //alert( "Triggered ajaxError handler." );
});



modSessions.showActiveSessions = function (data, textStatus, jqXHR) {
	var counterUI = '';
	var line = modSessions.getLineNo();
	var jsonname = 'modules/sessions/' + line + '.json';

	$.get( "modules/sessions/moduleEntry.php", {action:'getServerTime'}, function( servertime ) {
		$.getJSON( jsonname, function( data ) {
			data.tmnow = servertime;
			counterUI = counterUI + modSessions.getCounterUI(data );
			$("#activesessionshero").html(counterUI);
		});
	});
};


$(document).ready(function (e) { // pass the event object
	modSessions.showActiveSessions();
	modSessions.showLineDetails();
	setInterval(modSessions.showActiveSessions,modSessions.timer * 1000);
});

$( "#lineToSubscribe" )
	.focusout(function() {
		modSessions.lastcounter = -1;
    	modSessions.setLineNo ( $('#lineToSubscribe').val());
    	modSessions.showActiveSessions();
    	modSessions.showLineDetails();
});

$(document).on("keypress", "#lineToSubscribe", function(e) {
    if (e.which == 13) {
		modSessions.lastcounter = -1;
    	modSessions.setLineNo ( $('#lineToSubscribe').val());
    	modSessions.showActiveSessions();
    	modSessions.showLineDetails();
    }
});


