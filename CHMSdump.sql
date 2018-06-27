-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema CHMS
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema CHMS
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `CHMS` DEFAULT CHARACTER SET utf8 ;
-- -----------------------------------------------------
-- Schema new_schema1
-- -----------------------------------------------------
USE `CHMS` ;

-- -----------------------------------------------------
-- Table `CHMS`.`tbluser`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tbluser`;
CREATE TABLE IF NOT EXISTS `CHMS`.`tbluser` (
  `intID` INT NOT NULL,
  `strFName` VARCHAR(45) NULL,
  `strLName` VARCHAR(45) NULL,
  `strEmail` VARCHAR(45) NULL,
  `strPassword` VARCHAR(45) NULL,
  `strType` VARCHAR(45) NULL,
  `strStatus` VARCHAR(45) NULL,
  PRIMARY KEY (`intID`))
ENGINE = InnoDB;

INSERT INTO `tbluser` VALUES 
('1','lance','sanpablo','lance@xyz.com','pass','Client','Registered'),('2','jeron','pablo','jeron@xyz.com','pass','Household Worker','Registered'),('3','lanz','sanpabloz','lanz@xyz.com','pass','Admin','Registered');

-- maintenance tables
DROP TABLE IF EXISTS `tblMincidentreport`;
CREATE TABLE IF NOT EXISTS `CHMS`.`tblMincidentreport` (
	`intID` INT NOT NULL auto_increment,
    `strName` VARCHAR(100) NULL,
    `strDesc` VARCHAR(250) NULL,
    `strStatus` VARCHAR(45) NULL,
    PRIMARY KEY (`intID`))
ENGINE = InnoDB;

INSERT INTO `tblMincidentreport` VALUES
('1','Personal Injury',"Physical injury inflicted on a person's body.",'Active');


DROP TABLE IF EXISTS `tblMrequirements`;
CREATE TABLE IF NOT EXISTS `CHMS`.`tblMrequirements` (
	`intID` INT NOT NULL auto_increment,
    `strName` VARCHAR(100) NULL,
    `strStatus` VARCHAR(45) NULL,
    PRIMARY KEY (`intID`))
ENGINE = InnoDB;

INSERT INTO `tblMrequirements` VALUES
('1','NBI','Active'),('2','Police Clearance','Inactive');

DROP TABLE IF EXISTS `tblMleave`;
CREATE TABLE IF NOT EXISTS `CHMS`.`tblMleave` (
	`intID` INT NOT NULL auto_increment,
    `strName` VARCHAR(100) NULL,
    `strStatus` VARCHAR(45) NULL,
    PRIMARY KEY (`intID`))
ENGINE = InnoDB;

INSERT INTO `tblMleave` VALUES
('1','Vacation Leave','Active'),('2','Sick Leave','Inactive');

DROP TABLE IF EXISTS `tblMservice`;
CREATE TABLE IF NOT EXISTS `CHMS`.`tblMservice` (
	`intID` INT NOT NULL auto_increment,
    `strName` VARCHAR(100) NULL,
    `strStatus` VARCHAR(45) NULL,
    PRIMARY KEY (`intID`))
ENGINE = InnoDB;

INSERT INTO `tblMservice` VALUES
('1','Cook','Active'),('2','Housemaid','Inactive');




SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
