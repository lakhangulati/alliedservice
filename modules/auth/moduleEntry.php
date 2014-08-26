<?php
session_start();

require_once 'classes/auth.php';

function getAuthStatus () {
	$data = array();

	$data['callstatus'] = 'OK';
	$data['IsVald'] = 0;
	$data['User'] = "";

	if ( isset($_SESSION['IsVald'] )  ) {
		$data['IsVald'] = $_SESSION['IsVald'] ;
		$data['User'] = $_SESSION['User'];
	}

	header('Content-Type: application/json; charset=utf8');
	echo json_encode($data);
}

function authenticate () {
	$membership = new Membership();

	// Did the user enter a password/username and click submit?
	if($_POST && !empty($_POST['username']) && !empty($_POST['pwd'])) {
		$response = $membership->validate_User($_POST['username'], $_POST['pwd']);
	}

	header('Content-Type: application/json; charset=utf8');
	echo $response;
}

function logout () {
	$membership = new Membership();

	// If the user clicks the "Log Out" link on the index page.
	$response = $membership->log_User_Out();

	header('Content-Type: application/json; charset=utf8');
	echo $response;
}

function actionProcessor () {
	$action = "NULL";

	if ( isset($_POST['action'] )  ) {
		$action = $_POST['action'];
	}

	if ( isset($_GET['action'] )  ) {
		$action = $_GET['action'];
	}

	if ( $action == "NULL"  ) {
		$data = array();
		$data['callstatus'] = 'FAIL';
		header('Content-Type: application/json; charset=utf8');
		echo json_encode($data);
		return;
	}

	if ( $action == "authenticate" ) {
		authenticate();
	}

	if ( $action == "getAuthStatus" ) {
		getAuthStatus();
	}

	if ( $action == "logout" ) {
		logout();
	}

}

actionProcessor ();

