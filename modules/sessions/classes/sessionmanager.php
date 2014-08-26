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

	public static function setNextCounter($id) {
		if (  ! isset(self::$_name2id) ) {
			self::init();
		}

		$query = "UPDATE qsessions SET counter = counter + 1 WHERE id = $id";
		if($stmt = self::$conn->prepare($query)) {
			$stmt->execute();
			$stmt->close();
		}
		return self::getCounter($id);
	}

	public static function resetCounter($id) {
		if (  ! isset(self::$_name2id) ) {
			self::init();
		}

		$query = "UPDATE qsessions SET counter = 0 WHERE id = $id";
		if($stmt = self::$conn->prepare($query)) {
			$stmt->execute();
			$stmt->close();
		}
		return self::getCounter($id);
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

	public static function getActiveSessions() {
		if (  ! isset(self::$_name2id) ) {
			self::init();
		}

		$query = "SELECT A.usr,B.fullname, A.sname,A.counter FROM qsessions A, users B WHERE counter > 0 AND A.usr = B.usr order by A.usr,A.sname";
		$retval = array();

		if($stmt = self::$conn->prepare($query)) {
			$stmt->execute();

			/* bind result variables */
			$stmt->bind_result($usr,$fullname,$sname,$counter);

			/* fetch values */
			while ($stmt->fetch()) {
				$retval[] =  array('usr' => $usr,
						'sname' => $sname,
						'fullname' => $fullname,
						'counter' => $counter);
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

