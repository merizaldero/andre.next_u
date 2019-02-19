CREATE USER IF NOT EXISTS 'cal_user'@'localhost' IDENTIFIED BY 'cal_clave';
CREATE DATABASE IF NOT EXISTS calendario CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE calendario;
CREATE TABLE USUARIO(
	username VARCHAR(32) not null,
	password VARCHAR(128) not null,
	CONSTRAINT PK_USUARIO PRIMARY KEY( username )
);
CREATE TABLE EVENTO(
	id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(32) not null,
	titulo VARCHAR(64) not null,
	start_date DATE not null,
	start_hour TIME,
	end_date DATE,
	end_hour TIME,
	allDay TINYINT(1),
	CONSTRAINT PK_EVENTO PRIMARY KEY( id )
);
GRANT ALL PRIVILEGES ON calendario.* TO 'cal_user'@'localhost';