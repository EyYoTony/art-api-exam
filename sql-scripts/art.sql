DROP SCHEMA IF EXISTS art;
CREATE DATABASE art;
USE art;

DROP TABLE IF EXISTS `painting`;
CREATE TABLE `painting` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `movement` varchar(50) NOT NULL,
  `artist` varchar(50) NOT NULL,
  `yearCreated` int(4) unsigned NOT NULL,
  `museumName` varchar(50) NOT NULL,
  `museumLocation` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

INSERT INTO `painting` VALUES
(1,'The Starry Night','post-impressionism','Vincent van Gogh',1889,'Museum of Modern Art','New York'),
(2,'Water Lilies Nympheas','impressionism','Claude Monet',1907,'Art Gallery of Ontario','Toronto'),
(3,'The Last Supper','Renaissance','Leonardo da Vinci',1495,'Santa Maria delle Grazie','Milan'),
(4,'Mona Lisa','Renaissance','Leonardo da Vinci',1503,'Museum of Modern Art','New York');

DROP TABLE IF EXISTS `vcountbycity`;
CREATE VIEW `vcountbycity` AS
SELECT `p`.`museumLocation` AS `city`, COUNT(`p`.`museumLocation`) AS `paintingCount`
FROM `painting` `p`
GROUP BY `p`.`museumLocation`;

DROP TABLE IF EXISTS `vcountbymovement`;
CREATE VIEW `vcountbymovement` AS
SELECT `p`.`movement` AS `city`, COUNT(`p`.`movement`) AS `paintingCount`
FROM `painting` `p`
GROUP BY `p`.`movement`;
