var _vasCounter = 0;
var _gzbCounter = 0;

$(document).ready(function (){
	$.post( "modules/auth/moduleEntry.php", {action:'getAuthStatus'}, function( data ) {
		if ( data.IsVald == 1) {
		    $('#loginuser').html("Welcome " + data.User);
		    $("#frmsignin").hide(); 
		    $("#loggedin").show(); 
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


$('#vasBtnNxt').on('click', function (e) {
     //your awesome code here
	_vasCounter = _vasCounter + 1;
     // alert("clicked");
    $('#vasCounter').text(_vasCounter);

})

$('#vasBtnStop').on('click', function (e) {
     //your awesome code here
	_vasCounter = 0;
     // alert("clicked");
    $('#vasCounter').text(_vasCounter);

})


$('#gzbBtnNxt').on('click', function (e) {
     //your awesome code here
	_gzbCounter = _gzbCounter + 1;
     // alert("clicked");
    $('#gzbCounter').text(_gzbCounter);

})

$('#gzbBtnStop').on('click', function (e) {
     //your awesome code here
	_gzbCounter = 0;
     // alert("clicked");
    $('#gzbCounter').text(_gzbCounter);

})


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
	});
})

