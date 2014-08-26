var _vasCounter = 0;
var _gzbCounter = 0;

$(document).ready(function (){
	$.post( "modules/auth/moduleEntry.php", {action:'getAuthStatus'}, function( data ) {
		if ( data.IsVald == 1) {
		    $('#loginuser').html("Welcome " + data.User);
		    $("#frmsignin").hide(); 
		    $("#loggedin").show(); 
		    __displaySessions();
		} else {
		    $("#frmsignin").show(); 
		    $("#loggedin").hide(); 
		}
	});
});


$( document ).ajaxError(function(xhr, error) {
	 console.debug(xhr); console.debug(error);
  alert( "Triggered ajaxError handler." );
});

function ajaxError(jqXHR, textStatus, errorThrown) {
        alert('$.post error: ' + textStatus + ' : ' + errorThrown);
};


__displaySessions_safe = function (data, textStatus, jqXHR) {

	var SelectOptions = "";
	$.post( "modules/sessions/moduleEntry.php", {action:'getSessions'}, function( data ) {
		if ( data.callstatus == "OK" &&  data.IsVald == 1) {
			var sessions = data.Sessions;
			var sessionid = data.SessionId;
			var counters = data.Counters;

			for (var i = 0; i < sessions.length; i++) {
				// SelectOptions = SelectOptions + " " +  sessions[i]  ;

				SelectOptions = SelectOptions + "<div class=\"col-md-3\">";
				SelectOptions = SelectOptions + "<h3>" + sessions[i] + "</h3>";
				SelectOptions = SelectOptions + "<p><button class=\"btn btn-default\"><span class=\"glyphicon glyphicon-step-forward\" style=\"vertical-align:middle\"></span></button>";
				SelectOptions = SelectOptions + "<span class=\"badge badge-success\">0</span>";
				SelectOptions = SelectOptions + "<button class=\"btn btn-default\"><span class=\"glyphicon glyphicon-stop\" style=\"vertical-align:middle\"></span>";
				SelectOptions = SelectOptions + "</button></p></div>";
			}
			
			//alert(JSON.stringify(data));
			$("#mysessions").html(SelectOptions);
			
		} else {
			$("#mysessions").html("");
		}
	});
};


__displaySessions = function (data, textStatus, jqXHR) {

	var SelectOptions = "";
	$.post( "modules/sessions/moduleEntry.php", {action:'getSessions'}, function( data ) {
		if ( data.callstatus == "OK" &&  data.IsVald == 1) {
			var sessions = data.Sessions;
			var sessionid = data.SessionId;
			var counters = data.Counters;

			for (var i = 0; i < sessions.length; i++) {
				// SelectOptions = SelectOptions + " " +  sessions[i]  ;
				
				var sid = sessionid[i];
				var counterid = "counter_" + sid;
				var cntr = counters[i];

				SelectOptions = SelectOptions + "<div class=\"col-md-3\">";
				SelectOptions = SelectOptions + "<h3>" + sessions[i] + "</h3>";
				SelectOptions = SelectOptions + "<p><button sessionid=\"" + sid + "\" class=\"btn btnnext btn-default\"><span class=\"glyphicon glyphicon-step-forward\" style=\"vertical-align:middle\"></span></button>";

				SelectOptions = SelectOptions + "<span id=\"" + counterid + "\" class=\"badge badge-success\">" + cntr + "</span>";

				SelectOptions = SelectOptions + "<button sessionid=\"" + sid + "\" class=\"btn btnstop btn-default\"><span class=\"glyphicon glyphicon-stop\" style=\"vertical-align:middle\"></span></button>";
				SelectOptions = SelectOptions + "</button></p></div>";
			}
			
			//alert(JSON.stringify(data));
			$("#mysessions").html(SelectOptions);

			$(".btnnext").on('click', function (e) {
		   	    var sessionid = $(this).attr('sessionid');

				$.post( "modules/sessions/moduleEntry.php", {action:'setNextCounter', sessionid:sessionid}, function( data ) {
					var counterid = "#counter_" + data.sessionid;
					$(counterid).text(data.Counter);
				});
			})

			$(".btnstop").on('click', function (e) {
		   	    var sessionid = $(this).attr('sessionid');

				$.post( "modules/sessions/moduleEntry.php", {action:'resetCounter', sessionid:sessionid}, function( data ) {
					var counterid = "#counter_" + data.sessionid;
					$(counterid).text(data.Counter);
				});
			})


		} else {
			$("#mysessions").html("");
		}
	});
};


$('#btnLogin').on('click', function (e) {

	var username = $('#username').val();
	var pwd = $('#pwd').val();
	
	$.post( "modules/auth/moduleEntry.php", {action:'authenticate', username:username,pwd:pwd}, function( data ) {
		if ( data.status == "OK") {
		    $('#loginuser').html("Welcome " + username);
		    $('#username').val("") ;
		    $('#pwd').val("") ;
		    $("#frmsignin").hide(); 
		    $("#loggedin").show(); 
		    __displaySessions();
		} else {
		    $("#frmsignin").show(); 
		    $("#loggedin").hide(); 
		    $('#signinstatus').html("Failed to log in") ;
		}
	});
})


$('#btnLogout').on('click', function (e) {
	$.post( "modules/auth/moduleEntry.php", {action:'logout'}, function( data ) {
	    $('#signinstatus').html("") ;
	    $("#frmsignin").show(); 
	    $("#loggedin").hide(); 
	    $("#mysessions").html("");
	});
})

