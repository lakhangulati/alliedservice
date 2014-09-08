var modSessions = {};
modSessions.setUserName = function (username) {
	modSessions._LoggedInUser = username;
};

modSessions.setLineNo = function (lineNo) {
	modSessions._line = lineNo;
	$.cookie('lastline', lineNo, { expires : 30 });
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

$(document).ajaxError(function(xhr, error) {
	 //alert( "Triggered ajaxError handler." );
});


__showLineDetails = function (data, textStatus, jqXHR) {
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


__showActiveSessions = function (data, textStatus, jqXHR) {

	var HeroUnits = '<div class="jumbotron">';
	var line = modSessions.getLineNo();
	
		$.get( "modules/sessions/moduleEntry.php", {action:'getSessionsById',line:line}, function( data ) {
		if ( data.callstatus == "OK" ) {
			var sessions = data.sessions;

			for (var i = 0; i < sessions.length; i++) {
				var sobj = sessions[i];
				
				var counter = sobj.counter;
				var started = sobj.started;
				var updated = sobj.updated;
				var tmnow = sobj.tmnow;
				
				var servicerate = ((updated - started) * 10 ) / (60 * counter);
				var lastupdated = (tmnow - updated) / 60;
				
				servicerate = Math.round(servicerate) ;
				
				var lastupdateunit = " minutes";
				if ( lastupdated > 60 ) {
					lastupdateunit = " hours";
					lastupdated = lastupdated / 60;
				} 
				
				if ( lastupdated > 24 ) {
					lastupdateunit = " days";
					lastupdated = lastupdated / 24;
				} 

				lastupdated = Math.round(lastupdated) ;
				
				var itmcounter = "<span class=\"label label-success\">" + counter + "</span>";
				var itmrate = "<span class=\"label label-info\">" + servicerate + " minutes / 10 patients</span>";

				if ( counter <= 0 ) {
					itmcounter = "<span class=\"label label-danger\">" + counter + "</span>";
					itmrate = '<span class="label label-default"> Not Started Yet</span>';
				} 
				
				var itmlastupd = "<span class=\"label label-info\">" + lastupdated + lastupdateunit + " before</span>";
				
				HeroUnits = HeroUnits + "<h3>" + itmcounter + "</h3>";
				HeroUnits = HeroUnits + "<h4>" + itmrate + "</h4>";
				HeroUnits = HeroUnits + "<h5>" + itmlastupd + "</h5>";
				HeroUnits = HeroUnits + "<h6> Line Number: " + data.line + "</h6>";
				HeroUnits = HeroUnits + "</div>";
			}

			//alert(JSON.stringify(data));
			$("#activesessionshero").html(HeroUnits);

		} else {
			$("#activesessionshero").html("");
			$("#activesessions").html("");
		}
	});
};

setInterval(function() {
	__showActiveSessions();
	__showLineDetails();
	
	
}, 10000);

$(document).ready(function (e) { // pass the event object
	__showActiveSessions();
	__showLineDetails();

	$("#submitLineScuscribe").click(function(){
    	modSessions.setLineNo ( $('#lineToSubscribe').val());
    	__showActiveSessions();
    	__showLineDetails();
    });

});

$( "#lineToSubscribe" )
	.focusout(function() {
    	modSessions.setLineNo ( $('#lineToSubscribe').val());
    	__showActiveSessions();
    	__showLineDetails();
});

$(document).on("keypress", "#lineToSubscribe", function(e) {
    if (e.which == 13) {
    	modSessions.setLineNo ( $('#lineToSubscribe').val());
    	__showActiveSessions();
    	__showLineDetails();
    }
});
