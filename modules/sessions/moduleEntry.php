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

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}

function getServerTime () {
	$data = array();
	$data['tmnow'] = time();
	#header('Content-Type: application/json; charset=utf-8');
	#echo json_encode($data);
	echo time();
}

function getLineDetails () {
	session_write_close();
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
	session_start();
	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}

function updateResponse ($line) {
	$myfile = fopen("${line}.json", "w");
	$data = SessionManager::getSessionsById($line);;
	fwrite($myfile, json_encode($data));
	fclose($myfile);
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
		updateResponse($sessionid);
	}

	header('Content-Type: application/json; charset=utf-8');
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
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($data);
		return;
	}

	if ( $action == "getServerTime" ) {
		getServerTime();
	}
	
	
	if ( $action == "getSessions" ) {
		getSessions();
	}

	if ( $action == "setNextCounter" ) {
		setNextCounter();
	}

	if ( $action == "getSessionsById" ) {
		getSessionsById();
	}

	if ( $action == "getLineDetails" ) {
		getLineDetails();
	}

}

#echo SessionManager::setNextCounter(5);

actionProcessor ();
