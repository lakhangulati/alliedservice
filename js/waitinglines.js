var mod_wl = {};
mod_wl.lastcounter = new Object(); // or var map = {};
mod_wl.livecounter = new Object(); // or var map = {};



$(document).ready(function (){
	$.post( "modules/auth/moduleEntry.php", {action:'getAuthStatus'}, function( data ) {
		if ( data.IsVald == 1) {
		    $('#loginuser').html("Welcome " + data.User);
		    $("#frmsignin").hide(); 
		    $("#loggedin").show(); 
		    $("#frmchangepwd").hide(); 
		    __displaySessions();
		} else {
		    $("#frmsignin").show(); 
		    $("#loggedin").hide(); 
		}
	});


	$(document).on('click', '.btnnext', function() {
   	    var sessionid = $(this).attr('sessionid');
		var counterid = "#counter_" + sessionid;
		mod_wl.livecounter[sessionid] = parseInt($(counterid).text()) + 1;
		$(counterid).text(mod_wl.livecounter[sessionid]);

		var usrcounterid = "#usrcounter_" + sessionid;
		$(usrcounterid).text(mod_wl.lastcounter[sessionid]);
	});

	$(document).on('click', '.btnstop', function() {
   	    var sessionid = $(this).attr('sessionid');
		var counterid = "#counter_" + sessionid;
		$(counterid).text(0);
		mod_wl.livecounter[sessionid] = 0;

		var usrcounterid = "#usrcounter_" + sessionid;
		$(usrcounterid).text(mod_wl.lastcounter[sessionid]);
	});
});


$(document).ajaxError(function( event, request, settings ) {
    //When XHR Status code is 0 there is no connection with the server
    if (request.status == 0){ 
    	
		$(".userstat").css("background-color","red");
        //alert("Communication with the server is lost!");
    } 
});

mod_wl.handleConnFailure = function () {
	// Record the timestamp it failed last time if not already recorded
	// Change the color of 
};

__displaySessions = function (data, textStatus, jqXHR) {

	var SelectOptions = "";
	$.post( "modules/sessions/moduleEntry.php", {action:'getSessions'}, function( data ) {
		if ( data.callstatus == "OK" &&  data.IsVald == 1) {
			var sessions = data.FromDB;

			for (var i = 0; i < sessions.length; i++) {
				// SelectOptions = SelectOptions + " " +  sessions[i]  ;
				var sobj = sessions[i];
				
				var sid = sobj.id;
				var counterid = "counter_" + sobj.id;
				var usrcounterid = "usrcounter_" + sobj.id;
				var cntr = sobj.counter;

				mod_wl.lastcounter[sid] = cntr; 
				mod_wl.livecounter[sid] = cntr; // or var map = {};
				
				var usrstatus = '<span id=' + usrcounterid + ' class="badge userstat"> ' + cntr + '</span></h1>';
				
				SelectOptions = SelectOptions + "<div class=\"col-md-3\">";
				SelectOptions = SelectOptions + "<h3> Line Number: " + sid + "</h3>";
				SelectOptions = SelectOptions + "<h3>" + sobj.sname + "</h3>";
				SelectOptions = SelectOptions + "<p><button sessionid=\"" + sid + "\" class=\"btn btnnext btn-default\"><span class=\"glyphicon glyphicon-step-forward\" style=\"vertical-align:middle\"></span></button>";

				SelectOptions = SelectOptions + "<h1><span id=\"" + counterid + "\" class=\"label label-success\">" + cntr + "</span>";
				SelectOptions = SelectOptions + usrstatus ;

				//SelectOptions = SelectOptions + '<span id=' + usrcounterid + ' class="badge userstat"> ' + cntr + '</span></h1>';

				SelectOptions = SelectOptions + "<button sessionid=\"" + sid + "\" class=\"btn btnstop btn-default\"><span class=\"glyphicon glyphicon-stop\" style=\"vertical-align:middle\"></span></button>";
				SelectOptions = SelectOptions + "</button></p></div>";
			}
			
			//alert(JSON.stringify(data));
			$("#mysessions").html(SelectOptions);

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
		    $("#frmchangepwd").hide(); 
		    mod_wl.lastcounter = new Object(); // or var map = {};
			mod_wl.livecounter = new Object(); // or var map = {};
		    
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

	    mod_wl.lastcounter = new Object(); // or var map = {};
		mod_wl.livecounter = new Object(); // or var map = {};

	});
})



$('#btnTogglePwdFrm').on('click', function (e) {
	if($("#frmchangepwd").is(":hidden"))
	{
	    $("#frmchangepwd").show(); 
	} else {
	    $("#frmchangepwd").hide(); 
	}
})

$('#btnChangePwd').on('click', function (e) {
	var oldpwd = $('#oldpwd').val();
	var newpwd = $('#newpwd').val();
	var newpwdrepeat = $('#newpwdrepeat').val();
	
	if ( newpwdrepeat == newpwd ) {
		$.post( "modules/auth/moduleEntry.php", {action:'changePwd', oldpwd:oldpwd,newpwd:newpwd}, function( data ) {
			if ( data.status == "OK") {
			    $("#frmchangepwd").hide(); 
		            alert("Password Changed");
			} else {
		            alert("ERROR:: " + data.statusdetail);
			}
		});
	} else {
		alert("ERROR:: New Passwords Does Not Match");
	}
})

setInterval(function() {
	// Verify if the current counter is different than last counter\
	// If it is different send the counter to the server
	// set the last counter with what is recieved from web
	
	for (var sessionid in mod_wl.lastcounter) {
		var counter = mod_wl.livecounter[sessionid];
		var lastcounter = mod_wl.lastcounter[sessionid];
		
		if ( lastcounter != counter ) {
			$.post( "modules/sessions/moduleEntry.php", {action:'setNextCounter', sessionid:sessionid,counter:counter}, function( data ) {
				if ( data.callstatus == "OK") {
					var usrcounterid = "#usrcounter_" + data.sessionid;
					mod_wl.lastcounter[data.sessionid] =  data.counter;
					$(usrcounterid).text(mod_wl.lastcounter[data.sessionid]);
					$(".userstat").css("background-color","green");
					// TODO - RAISE Alert if counter could not be set
				} else {
					// TODO - RAISE Alert
				}
			});
		}
	}
}, 1000);
