<?php
session_start();

require_once 'includes/constants.php';
require_once 'classes/sessionmanager.php';

function getSessionsold () {
	$data = array();

	$data['callstatus'] = 'OK';
	$data['IsVald'] = 0;
	$data['User'] = "";
	$data['Sessions'] = array();
	$data['SessionId'] = array();
	$data['Counters'] = array();

	$data['Sessions'][] = 'V1';
	$data['Sessions'][] = 'V2';

	$data['Counters'][] = 78;
	$data['Counters'][] = 12;

	$data['SessionId'][] = 4;
	$data['SessionId'][] = 5;

	if ( isset($_SESSION['IsVald'] )  ) {
		$data['IsVald'] = $_SESSION['IsVald'] ;
		$data['User'] = $_SESSION['User'];
	}

	header('Content-Type: application/json; charset=utf8');
	echo json_encode($data);
}

function getSessions () {
	$data = array();

	$data['callstatus'] = 'OK';
	$data['IsVald'] = 0;
	$data['User'] = "";

	if ( isset($_SESSION['IsVald'] )  ) {
		$data['IsVald'] = $_SESSION['IsVald'] ;
		$data['User'] = $_SESSION['User'];
	}

	$data['FromDB'] = SessionManager::getSessions($_SESSION['User']);

	header('Content-Type: application/json; charset=utf8');
	echo json_encode($data);
}

function getActiveSessions () {
	$data = array();

	$data['callstatus'] = 'OK';

	$data['sessions'] = SessionManager::getActiveSessions();

	header('Content-Type: application/json; charset=utf8');
	echo json_encode($data);
}



function setNextCounter () {
	$sessionid = $_POST['sessionid'];

	$data = array();
	$data['callstatus'] = 'OK';
	$data['sessionid'] = $sessionid;
	$data['Counter'] = SessionManager::setNextCounter($sessionid);

	header('Content-Type: application/json; charset=utf8');
	echo json_encode($data);
}

function resetCounter () {
	$sessionid = $_POST['sessionid'];

	$data = array();
	$data['callstatus'] = 'OK';
	$data['sessionid'] = $sessionid;
	$data['Counter'] = SessionManager::resetCounter($sessionid);

	header('Content-Type: application/json; charset=utf8');
	echo json_encode($data);
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

	if ( $action == "getSessions" ) {
		getSessions();
	}

	if ( $action == "setNextCounter" ) {
		setNextCounter();
	}

	if ( $action == "resetCounter" ) {
		resetCounter();
	}

	if ( $action == "getActiveSessions" ) {
		getActiveSessions();
	}

}

#echo SessionManager::setNextCounter(5);
#echo json_encode(SessionManager::getActiveSessions());

actionProcessor ();
