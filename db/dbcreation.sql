-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.1.32-community


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema qm
--


--
-- Definition of table `qsessions`
--

DROP TABLE IF EXISTS `qsessions`;
CREATE TABLE `qsessions` (
  `usr` varchar(45) NOT NULL,
  `sname` varchar(255) NOT NULL,
  `counter` int(10) unsigned DEFAULT '0',
  `updated` int(10) unsigned DEFAULT '0',
  `started` int(10) unsigned DEFAULT '0',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index_1` (`usr`,`sname`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `qsessions`
--

/*!40000 ALTER TABLE `qsessions` DISABLE KEYS */;
INSERT INTO `qsessions` (`usr`,`sname`,`counter`,`updated`,`started`,`id`) VALUES 
 ('dummy','Restaurant',0,0,0,1),
 ('dummy','Clinic',0,0,0,1);
/*!40000 ALTER TABLE `qsessions` ENABLE KEYS */;


--
-- Definition of table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `usr` varchar(45) NOT NULL,
  `usrpwd` varchar(255) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  PRIMARY KEY (`usr`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`usr`,`usrpwd`,`fullname`) VALUES 
 ('dummy','0b90e7c87d233fba0c6200129798b67e','Dummy Provider');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
