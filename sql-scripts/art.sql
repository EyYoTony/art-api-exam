DROP SCHEMA IF EXISTS art;
CREATE DATABASE art;
USE art;

DROP TABLE IF EXISTS `movement`;
CREATE TABLE `movement` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `desc` varchar(400) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

INSERT INTO `movement` VALUES
(1,'post-impressionism','the work or style of a varied group of late 19th-century and early 20th-century artists including Van Gogh, Gauguin, and Cezanne. They reacted against the naturalism of the impressionists to explore color, line, and form, and the emotional response of the artist, a concern that led to the development of expressionism.'),
(2,'impressionism','a style or movement in painting originating in France in the 1860s, characterized by a concern with depicting the visual impression of the moment, especially in terms of the shifting effect of light and color.'),
(3,'Renaissance','the painting, sculpture and decorative arts of that period of European history known as the Renaissance, emerging as a distinct style in Italy in about 1400, in parallel with developments which occurred in philosophy, literature, music and science.'),
(4,'surrealism','a 20th-century avant-garde movement in art and literature that sought to release the creative potential of the unconscious mind, for example by the irrational juxtaposition of images.');

DROP TABLE IF EXISTS `painting`;
CREATE TABLE `painting` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `movementId` int(10) unsigned NOT NULL,
  `artist` varchar(50) NOT NULL,
  `yearCreated` int(4) unsigned NOT NULL,
  `museumName` varchar(50) NOT NULL,
  `museumLocation` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

INSERT INTO `painting` VALUES
(1,'The Starry Night',1,'Vincent van Gogh',1889,'Museum of Modern Art','New York'),
(2,'Water Lilies Nympheas',2,'Claude Monet',1907,'Art Gallery of Ontario','Toronto'),
(3,'The Last Supper',3,'Leonardo da Vinci',1495,'Santa Maria delle Grazie','Milan'),
(4,'Mona Lisa',3,'Leonardo da Vinci',1503,'Museum of Modern Art','New York');

ALTER TABLE `art`.`painting`
ADD INDEX `FK_Painting_Movement_idx` (`movementId` ASC);
ALTER TABLE `art`.`painting`
ADD CONSTRAINT `FK_Painting_Movement`
  FOREIGN KEY (`movementId`)
  REFERENCES `art`.`movement` (`ID`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

DROP TABLE IF EXISTS `vcountbycity`;
CREATE OR REPLACE VIEW `vcountbycity` AS
SELECT `p`.`museumLocation` AS `city`, COUNT(`p`.`museumLocation`) AS `paintingCount`
FROM `painting` `p`
GROUP BY `p`.`museumLocation`;

DROP TABLE IF EXISTS `vpaintingswithmovement`;
CREATE OR REPLACE VIEW `vpaintingswithmovement` AS
SELECT 'p'.'ID', 'p'.'name', 'p'.'artist','p'.'yearCreated', 'p'.'museumName', 'p'.'museumLocation', 'b'.'name' AS 'movement'
FROM 'art'.'painting' 'p'
JOIN 'art'.'movement' 'b' ON 'b'.'ID' = 'p'.'movementId';


DROP TABLE IF EXISTS `vcountbymovement`;
/*
CREATE OR REPLACE VIEW `vcountbymovement` AS
SELECT `p`.`movement` AS `city`, COUNT(`p`.`movement`) AS `paintingCount`
FROM `painting` `p`
GROUP BY `p`.`movement`;
*/
