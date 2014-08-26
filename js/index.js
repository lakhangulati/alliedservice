var _updcounter  = 0;


__showActiveSessions = function (data, textStatus, jqXHR) {

	var SelectOptions = "";
	$.post( "modules/sessions/moduleEntry.php", {action:'getActiveSessions'}, function( data ) {
		if ( data.callstatus == "OK" ) {
			var sessions = data.sessions;
			

			for (var i = 0; i < sessions.length; i++) {
				var sobj = sessions[i];
				
				var fullname = sobj.fullname;
				var sname = sobj.sname;
				var fullname = sobj.fullname;
				var counter = sobj.counter;

				SelectOptions = SelectOptions + "<p>" + fullname + "|" + sname + "|" + counter + "</p>";
			}
			
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
