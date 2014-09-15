<?php
session_start();

require_once './includes/constants.php';
require_once './classes/sessionmanager.php';

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

function getSessionsById () {
	$data = array();

	$data['callstatus'] = 'FAIL';
	$line = -1;

	if ( isset($_GET['line'] )  ) {
		$intext = $_GET['line'];
		$intext = trim($intext);
		if (is_numeric($intext) && $intext > 0 ) {
			$line = $intext;
			$_SESSION['line'] = $line;
		} 
	} 
	
	
	if ( $line < 0 && isset($_SESSION['line'] )  ) {
		$line = $_SESSION['line'] ; 
	}
			

	$data['line'] = $line;
	if ( $line >= 0 ) {
		$data['callstatus'] = 'OK';
		$data['sessions'] = SessionManager::getSessionsById($line);
	}

	header('Content-Type: application/json; charset=utf8');
	echo json_encode($data);
}

function getLineDetails () {
	$data = array();

	$data['callstatus'] = 'FAIL';
	$line = -1;

	if ( isset($_GET['line'] )  ) {
		$intext = $_GET['line'];
		$intext = trim($intext);
		if (is_numeric($intext) && $intext > 0 ) {
			$line = $intext;
			$_SESSION['line'] = $line;
		} 
	} 
		
	
	if ( $line <0 && isset($_SESSION['line'] )  ) {
		$line = $_SESSION['line'] ; 
	}
	
	$data['line'] = $line;

	if ( $line >= 0 ) {
		$data = SessionManager::getLineDetails($line);
		$data['callstatus'] = 'OK';
		$data['line'] = $line;
	}
	
	header('Content-Type: application/json; charset=utf8');
	echo json_encode($data);
}


function setNextCounter () {
	$sessionid = $_POST['sessionid'];
	$counter = $_POST['counter'];
	
	$data = array();
	$data['callstatus'] = 'FAIL';
	$data['sessionid'] = $sessionid;
	$data['counter'] = -1;
	if ( isset($_SESSION['IsVald'] )  ) {
		$data['callstatus'] = 'OK';
		$usr = $_SESSION['User'] ;
		$data['counter'] = SessionManager::setNextCounter($sessionid,$usr,$counter);
	}
	
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

	if ( $action == "getActiveSessions" ) {
		getActiveSessions();
	}

	if ( $action == "getSessionsById" ) {
		getSessionsById();
	}

	if ( $action == "getLineDetails" ) {
		getLineDetails();
	}
		
}

#echo SessionManager::setNextCounter(5);
#echo json_encode(SessionManager::getActiveSessions());

actionProcessor ();
