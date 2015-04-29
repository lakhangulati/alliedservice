<?php
class DBConnection
{
	private static $_conn;

	public static function getConnection() {
		if (  ! isset(self::$_conn) ) {
			self::init();
		}
		return self::$_conn;
	}

	private static function init () {
		if (   isset(self::$_conn) ) {
			return;
		}
		self::$_conn = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME) or
		die('There was a problem connecting to the database.');
	}
}

class SessionManager
{
	private static $conn;

	public static function setNextCounter($id , $usr, $counter) {
		if (  ! isset(self::$_name2id) ) {
			self::init();
		}

		$tmnow = time();

		$query = "UPDATE qsessions SET started = $tmnow WHERE id = $id AND counter = 0 AND usr = '$usr'";
		if($stmt = self::$conn->prepare($query)) {
			$stmt->execute();
			$stmt->close();
		}

		$query = "UPDATE qsessions SET counter = $counter , updated = $tmnow WHERE usr = '$usr' AND id = $id";
		if($stmt = self::$conn->prepare($query)) {
			$stmt->execute();
			$stmt->close();
		}

		return self::getCounter($id);
	}

	public static function getLineDetails($line) {
		if (  ! isset(self::$_name2id) ) {
			self::init();
		}

		$tmnow = time();
		$query = "SELECT A.usr,B.fullname, A.sname,A.sector,A.address,A.contact FROM qsessions A, users B WHERE id = $line AND A.usr = B.usr ";
		$retval = array();
		$retval['found'] =  0;

		if($stmt = self::$conn->prepare($query)) {
			$stmt->execute();

			/* bind result variables */
			$stmt->bind_result($usr,$fullname,$sname,$sector,$address,$contact);

			/* fetch values */
			while ($stmt->fetch()) {
				$retval['found'] =  1;
				$retval['usr'] =  $usr;
				$retval['fullname'] =  $fullname;
				$retval['sname'] =  $sname;
				$retval['sector'] =  $sector;
				$retval['address'] =  $address;
				$retval['contact'] =  $contact;
			}
				
			/* close statement */
			$stmt->close();
		}
		return $retval;
	}

	public static function getCounter($id) {
		if (  ! isset(self::$_name2id) ) {
			self::init();
		}

		$query = "SELECT counter from qsessions WHERE id = $id";
		$counter = -1;

		if($stmt = self::$conn->prepare($query)) {
			$stmt->execute();

			/* bind result variables */
			$stmt->bind_result($icounter);

			/* fetch values */
			while ($stmt->fetch()) {
				$counter = $icounter;
			}

			/* close statement */
			$stmt->close();
		}
		return $counter;
	}

	public static function getSessions($usr) {
		if (  ! isset(self::$_name2id) ) {
			self::init();
		}

		$query = "SELECT id,sname,counter FROM qsessions where usr='$usr'";
		$retval = array();

		if($stmt = self::$conn->prepare($query)) {
			$stmt->execute();

			/* bind result variables */
			$stmt->bind_result($id,$sname,$counter);

			/* fetch values */
			while ($stmt->fetch()) {
				$retval[] =  array('id' => $id,
						'sname' => $sname,
						'counter' => $counter);

			}

			/* close statement */
			$stmt->close();
		}
		return $retval;
	}

	public static function getSessionsById($line) {
		if (  ! isset(self::$_name2id) ) {
			self::init();
		}

		$tmnow = time();
		$query = "SELECT A.counter,A.started,A.updated FROM qsessions A WHERE id = $line ";
		$retval = array();

		if($stmt = self::$conn->prepare($query)) {
			$stmt->execute();

			/* bind result variables */
			$stmt->bind_result($counter,$started,$updated);

			/* fetch values */
			while ($stmt->fetch()) {
				$retval =  array('counter' => $counter , 'started' => $started,
						'updated' => $updated,
						'tmnow' => $tmnow );
			}

			/* close statement */
			$stmt->close();
		}
		return $retval;
	}

	private static function init () {
		self::$conn = DBConnection::getConnection();
	}
}

