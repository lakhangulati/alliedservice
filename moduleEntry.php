<?php
session_start();

require_once 'php/QSessions.php';

function getCentres () {
	$clist = Centres::getList();
	$data = array();

	$data['callstatus'] = 'OK';
	$data['centres'] = array ();

	foreach( array_keys($clist) as $cname){
		$data['centres'][$cname] = $clist[$cname];
	}

	header('Content-Type: application/json; charset=utf8');
	echo json_encode($data);
}



function actionProcessor () {
	if ( ! isset($_SESSION['IsVald'] )  || $_SESSION['IsVald'] != 1 ) {
		return;
	}

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

	## Get the sessions where counter is greater than 0
	if ( $action == "getActiveSessions" ) {
		getActiveSessions();
		return;
	}

	## Get the sessions where counter is greater than 0
	if ( $action == "getSessions" ) {
		getSessions();
		return;
	}

	## Set the counter for a session to a value set by provider
	if ( $action == "setCounter" ) {
		setCounter();
		return;
	}

}

actionProcessor ();

