var _updcounter  = 0;


__showActiveSessions = function (data, textStatus, jqXHR) {

var SelectOptions = "";


SelectOptions = SelectOptions + "<table class=\"table\"><thead><tr><th>Doctor</th><th>Clinic Location</th><th>Patient Number</th><th>Service Rate</th><th>Last Updated</th></tr></thead><tbody>";


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
				lastupdated = Math.round(lastupdated) ;
//started
//updated
//tmnow


				
				SelectOptions = SelectOptions + "<tr>";
				SelectOptions = SelectOptions + "<td>" + fullname + "</td>";
				SelectOptions = SelectOptions + "<td>" + sname + "</td>";
				SelectOptions = SelectOptions + "<td><span class=\"badge badge-success\">" + counter + "</span></td>";

				SelectOptions = SelectOptions + "<td><span class=\"badge badge-success\">" + servicerate + " minutes / 10 patients</span></td>";
				SelectOptions = SelectOptions + "<td><span class=\"badge badge-success\">" + lastupdated + " minutes before</span></td>";
				SelectOptions = SelectOptions + "</tr>";
				
				//SelectOptions = SelectOptions + "<p>" + fullname + "|" + sname + "|" + counter + "</p>";
			}
			SelectOptions = SelectOptions + "</tbody></table>";

			//alert(JSON.stringify(data));
			$("#activesessions").html(SelectOptions);

		} else {
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
