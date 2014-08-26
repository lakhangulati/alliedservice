var modAuth = {};
modAuth.setUserName = function (username) {
	modAuth._LoggedInUser = username;
};

$("#authform").bind('submit',function(event){
	$.ajax({
		type: "POST",
		url:$('#authform').attr('action'),
		  dataType: 'json',
		  data: $('#authform').serialize(),
		success: function(data){
			if ( data.status == "FAIL") {
				alert("Login Failed - Please retry with correct credentials");
			} else {
				alert("Welcome " + data.username);
				modAuth._LoggedInUser = data.username;
				modAuth._isLoggedIn = 1;
			}
		}
	});
	return false;
});

