var _updcounter  = 0;


__showActiveSessions = function (data, textStatus, jqXHR) {

	var SelectOptions = "";
	SelectOptions = SelectOptions + "<table class=\"table\"><thead><tr><th>Doctor</th><th>Clinic Location</th><th>Patient Number</th><th>Service Rate</th><th>Last Updated</th></tr></thead><tbody>";

	var HeroUnits = '<h1><span class="label label-primary">Active Sessions</span></h1>';
	$.post( "modules/sessions/moduleEntry.php", {action:'getActiveSessions'}, function( data ) {
		if ( data.callstatus == "OK" ) {
			var sessions = data.sessions;
			

			for (var i = 0; i < sessions.length; i++) {
				var sobj = sessions[i];
				
				var fullname = sobj.fullname;
				var sname = sobj.sname;
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
				
				var itmsession = sname ;
				var itmcounter = "<span class=\"label label-success\">" + counter + "</span>";
				var itmrate = "<span class=\"label label-info\">" + servicerate + " minutes / 10 patients</span>";
				var itmlastupd = "<span class=\"label label-info\">" + lastupdated + lastupdateunit + " before</span>";
				
				//SelectOptions = SelectOptions + "<p>" + fullname + "|" + sname + "|" + counter + "</p>";
				HeroUnits = HeroUnits + "<div class=\"col-md-3 hero-unit\">";
				HeroUnits = HeroUnits + "<h1>" + fullname + "</h1>";
				HeroUnits = HeroUnits + "<h2>" + itmsession + "</h2>";
				HeroUnits = HeroUnits + "<h3>" + itmcounter + "</h3>";
				HeroUnits = HeroUnits + "<h4>" + itmrate + "</h4>";
				HeroUnits = HeroUnits + "<h5>" + itmlastupd + "</h5>";
				HeroUnits = HeroUnits + "</div>";

			}
			SelectOptions = SelectOptions + "</tbody></table>";

			//alert(JSON.stringify(data));
			$("#activesessionshero").html(HeroUnits);

		} else {
			$("#activesessionshero").html("");
			$("#activesessions").html("");
		}
	});
};


setInterval(function() {
	_updcounter = _updcounter + 1;
	$('#vasCounter').text(_updcounter);
	$('#gzbCounter').text(_updcounter);

	__showActiveSessions();
	
	
}, 5000);
