-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: event
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbl_address`
--

DROP TABLE IF EXISTS `tbl_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_address` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `venue_name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  PRIMARY KEY (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_address`
--

LOCK TABLES `tbl_address` WRITE;
/*!40000 ALTER TABLE `tbl_address` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_booking`
--

DROP TABLE IF EXISTS `tbl_booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_booking` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `time_detail_id` int NOT NULL,
  `voucher_id` int DEFAULT NULL,
  `original_price` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `final_price` decimal(10,2) NOT NULL,
  `payment_method` tinytext NOT NULL,
  `payment_status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `paid_at` datetime DEFAULT NULL,
  `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `qr_code_data` tinytext,
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `time_detail_id` (`time_detail_id`),
  KEY `voucher_id` (`voucher_id`),
  CONSTRAINT `tbl_booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`),
  CONSTRAINT `tbl_booking_ibfk_2` FOREIGN KEY (`time_detail_id`) REFERENCES `tbl_time_detail` (`time_detail_id`),
  CONSTRAINT `tbl_booking_ibfk_3` FOREIGN KEY (`voucher_id`) REFERENCES `tbl_voucher` (`voucher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_booking`
--

LOCK TABLES `tbl_booking` WRITE;
/*!40000 ALTER TABLE `tbl_booking` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_booking_seat`
--

DROP TABLE IF EXISTS `tbl_booking_seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_booking_seat` (
  `booking_seat_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `seat_id` int NOT NULL,
  `status` enum('pending','confirmed','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`booking_seat_id`),
  KEY `booking_id` (`booking_id`),
  KEY `seat_id` (`seat_id`),
  CONSTRAINT `tbl_booking_seat_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `tbl_booking` (`booking_id`),
  CONSTRAINT `tbl_booking_seat_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `tbl_seat` (`seat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_booking_seat`
--

LOCK TABLES `tbl_booking_seat` WRITE;
/*!40000 ALTER TABLE `tbl_booking_seat` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_booking_seat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_category`
--

DROP TABLE IF EXISTS `tbl_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_category`
--

LOCK TABLES `tbl_category` WRITE;
/*!40000 ALTER TABLE `tbl_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_event`
--

DROP TABLE IF EXISTS `tbl_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_event` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `organizer_id` int NOT NULL,
  `category_id` int NOT NULL,
  `event_title` varchar(200) NOT NULL,
  `status_id` int NOT NULL,
  `age_rating` varchar(20) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `description` tinytext,
  `banner_text` varchar(255) DEFAULT NULL,
  `header_image` varchar(255) DEFAULT NULL,
  `poster_image` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(50) DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `organizer_id` (`organizer_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `tbl_event_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `tbl_organizer` (`organizer_id`),
  CONSTRAINT `tbl_event_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `tbl_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_event`
--

LOCK TABLES `tbl_event` WRITE;
/*!40000 ALTER TABLE `tbl_event` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_event_payment`
--

DROP TABLE IF EXISTS `tbl_event_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_event_payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `organizer_id` int NOT NULL,
  `package_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `method` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL,
  `expired_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `event_id` (`event_id`),
  KEY `organizer_id` (`organizer_id`),
  KEY `package_id` (`package_id`),
  CONSTRAINT `tbl_event_payment_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`),
  CONSTRAINT `tbl_event_payment_ibfk_2` FOREIGN KEY (`organizer_id`) REFERENCES `tbl_organizer` (`organizer_id`),
  CONSTRAINT `tbl_event_payment_ibfk_3` FOREIGN KEY (`package_id`) REFERENCES `tbl_feature_package` (`package_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_event_payment`
--

LOCK TABLES `tbl_event_payment` WRITE;
/*!40000 ALTER TABLE `tbl_event_payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_event_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_event_status`
--

DROP TABLE IF EXISTS `tbl_event_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_event_status` (
  `status_id` int NOT NULL AUTO_INCREMENT,
  `status_name` varchar(50) NOT NULL,
  PRIMARY KEY (`status_id`),
  UNIQUE KEY `status_name` (`status_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_event_status`
--

LOCK TABLES `tbl_event_status` WRITE;
/*!40000 ALTER TABLE `tbl_event_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_event_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_event_voucher`
--

DROP TABLE IF EXISTS `tbl_event_voucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_event_voucher` (
  `event_voucher_id` int NOT NULL AUTO_INCREMENT,
  `voucher_id` int NOT NULL,
  `event_id` int NOT NULL,
  `valid_from` date DEFAULT NULL,
  `valid_until` date DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`event_voucher_id`),
  UNIQUE KEY `voucher_id` (`voucher_id`,`event_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `tbl_event_voucher_ibfk_1` FOREIGN KEY (`voucher_id`) REFERENCES `tbl_voucher` (`voucher_id`),
  CONSTRAINT `tbl_event_voucher_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_event_voucher`
--

LOCK TABLES `tbl_event_voucher` WRITE;
/*!40000 ALTER TABLE `tbl_event_voucher` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_event_voucher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_feature_package`
--

DROP TABLE IF EXISTS `tbl_feature_package`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_feature_package` (
  `package_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` tinytext,
  `duration_days` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(50) DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`package_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_feature_package`
--

LOCK TABLES `tbl_feature_package` WRITE;
/*!40000 ALTER TABLE `tbl_feature_package` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_feature_package` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_featured_event`
--

DROP TABLE IF EXISTS `tbl_featured_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_featured_event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `package_id` int NOT NULL,
  `priority` int DEFAULT '0',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `package_id` (`package_id`),
  CONSTRAINT `tbl_featured_event_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`),
  CONSTRAINT `tbl_featured_event_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `tbl_feature_package` (`package_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_featured_event`
--

LOCK TABLES `tbl_featured_event` WRITE;
/*!40000 ALTER TABLE `tbl_featured_event` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_featured_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_organizer`
--

DROP TABLE IF EXISTS `tbl_organizer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_organizer` (
  `organizer_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `organization_name` varchar(100) NOT NULL,
  `status` int DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(50) DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`organizer_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tbl_organizer_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_organizer`
--

LOCK TABLES `tbl_organizer` WRITE;
/*!40000 ALTER TABLE `tbl_organizer` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_organizer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_review`
--

DROP TABLE IF EXISTS `tbl_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_review` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` tinytext,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tbl_review_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`),
  CONSTRAINT `tbl_review_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`),
  CONSTRAINT `tbl_review_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_review`
--

LOCK TABLES `tbl_review` WRITE;
/*!40000 ALTER TABLE `tbl_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_role`
--

DROP TABLE IF EXISTS `tbl_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_role`
--

LOCK TABLES `tbl_role` WRITE;
/*!40000 ALTER TABLE `tbl_role` DISABLE KEYS */;
INSERT INTO `tbl_role` VALUES (1,'ADMIN'),(2,'USER');
/*!40000 ALTER TABLE `tbl_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_seat`
--

DROP TABLE IF EXISTS `tbl_seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_seat` (
  `seat_id` int NOT NULL AUTO_INCREMENT,
  `seat_type_id` int NOT NULL,
  `address_id` int NOT NULL,
  `seat_zone_id` int NOT NULL,
  `seat_number` int NOT NULL,
  `row_label` varchar(10) NOT NULL,
  `x` int DEFAULT NULL,
  `y` int DEFAULT NULL,
  PRIMARY KEY (`seat_id`),
  KEY `seat_type_id` (`seat_type_id`),
  KEY `address_id` (`address_id`),
  KEY `seat_zone_id` (`seat_zone_id`),
  CONSTRAINT `tbl_seat_ibfk_1` FOREIGN KEY (`seat_type_id`) REFERENCES `tbl_seat_type` (`type_id`),
  CONSTRAINT `tbl_seat_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `tbl_address` (`address_id`),
  CONSTRAINT `tbl_seat_ibfk_3` FOREIGN KEY (`seat_zone_id`) REFERENCES `tbl_seat_zone` (`seat_zone_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_seat`
--

LOCK TABLES `tbl_seat` WRITE;
/*!40000 ALTER TABLE `tbl_seat` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_seat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_seat_type`
--

DROP TABLE IF EXISTS `tbl_seat_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_seat_type` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_seat_type`
--

LOCK TABLES `tbl_seat_type` WRITE;
/*!40000 ALTER TABLE `tbl_seat_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_seat_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_seat_zone`
--

DROP TABLE IF EXISTS `tbl_seat_zone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_seat_zone` (
  `seat_zone_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `x` int NOT NULL,
  `y` int NOT NULL,
  `width` int NOT NULL,
  `height` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`seat_zone_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_seat_zone`
--

LOCK TABLES `tbl_seat_zone` WRITE;
/*!40000 ALTER TABLE `tbl_seat_zone` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_seat_zone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_showing_time`
--

DROP TABLE IF EXISTS `tbl_showing_time`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_showing_time` (
  `showing_time_id` int NOT NULL AUTO_INCREMENT,
  `address_id` int NOT NULL,
  `event_id` int NOT NULL,
  `showing_datetime` datetime NOT NULL,
  PRIMARY KEY (`showing_time_id`),
  KEY `address_id` (`address_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `tbl_showing_time_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `tbl_address` (`address_id`),
  CONSTRAINT `tbl_showing_time_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_showing_time`
--

LOCK TABLES `tbl_showing_time` WRITE;
/*!40000 ALTER TABLE `tbl_showing_time` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_showing_time` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_time_detail`
--

DROP TABLE IF EXISTS `tbl_time_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_time_detail` (
  `time_detail_id` int NOT NULL AUTO_INCREMENT,
  `showing_time_id` int NOT NULL,
  `time_detail` time NOT NULL,
  PRIMARY KEY (`time_detail_id`),
  KEY `showing_time_id` (`showing_time_id`),
  CONSTRAINT `tbl_time_detail_ibfk_1` FOREIGN KEY (`showing_time_id`) REFERENCES `tbl_showing_time` (`showing_time_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_time_detail`
--

LOCK TABLES `tbl_time_detail` WRITE;
/*!40000 ALTER TABLE `tbl_time_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_time_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_token`
--

DROP TABLE IF EXISTS `tbl_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_token` (
  `token_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `access_token` text,
  `refresh_token` text,
  PRIMARY KEY (`token_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_token`
--

LOCK TABLES `tbl_token` WRITE;
/*!40000 ALTER TABLE `tbl_token` DISABLE KEYS */;
INSERT INTO `tbl_token` VALUES (1,'tri2222','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0cmkyMjIyIiwiZXhwIjoxNzQ4ODU3MTMwLCJpYXQiOjE3NDg4NTM1MzB9.1YMUKPqDH8qst-3uKEDrg5gmSU6cpw0DRALN8O1RG0nbRc3Mg5O0NNh114DOsDTlm1WVShHybeMnw7V2P8PUWA','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0cmkyMjIyIiwiZXhwIjoxNzQ4OTA3NTMwLCJpYXQiOjE3NDg4NTM1MzB9.vNUfpSjOpzPxTyPy0jJZC822fPpd8ANHU00OJCtVLQ1u3yZyuhFVZqAhxm3bN2Pf72GD2CiuSOfnQtLsv2fvsg'),(2,'tri222233','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0cmkyMjIyMzMiLCJleHAiOjE3NDg4NjEwMjYsImlhdCI6MTc0ODg1NzQyNn0.vns6AImdcPRq6UkUstril0oGq8Ad9-wMPg8xxrUtRv3EVSWOO4WyuXMdmd7o_YBIJY7SIyHyFvDkGlzxaHpU-A','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0cmkyMjIyMzMiLCJleHAiOjE3NDg5MTE0MjYsImlhdCI6MTc0ODg1NzQyNn0.HuGCOBuL3f3WSsuGni2qGro2hHucR4GoRHBVaiLZcy5CW99A8dLOacslQWUH0AaR4YZ-vJxtbK17ipOXtyoFTA'),(3,'abc','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhYmMiLCJleHAiOjE3NDg4NzY2MDAsImlhdCI6MTc0ODg3MzAwMH0.heUeSacIzC3sfxftaWfmgjNKZZNTdPg215tkwDFQjy_a2H-YCAVsKGWOfLg3hom-C5muR1DkUmcs_2-RNpuWxg','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhYmMiLCJleHAiOjE3NDg5MjcwMDAsImlhdCI6MTc0ODg3MzAwMH0.oEoDhf_XUIc9iAfOMgTVcqDn7k495hABtccy0-m-W8ppFMLfWetAufjuVxybPCDYMk7mnAGXH1TuW27KdIZwrg');
/*!40000 ALTER TABLE `tbl_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user`
--

DROP TABLE IF EXISTS `tbl_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `profile_url` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `status` int DEFAULT '1',
  `score` int DEFAULT '0',
  `createAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updateAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdby` varchar(50) DEFAULT NULL,
  `modifiedby` varchar(50) DEFAULT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user`
--

LOCK TABLES `tbl_user` WRITE;
/*!40000 ALTER TABLE `tbl_user` DISABLE KEYS */;
INSERT INTO `tbl_user` VALUES (10,'twkun11@gmail.com','GOOGLE','kun Tw','https://res.cloudinary.com/dbpchaamx/image/upload/v1748837350/avatars/user_10.png',NULL,NULL,'twkun11@gmail.com',1,0,'2025-05-30 14:41:49','2025-05-30 14:41:49',NULL,NULL,'117966265490344660743'),(11,'trikun2k4@gmail.com','GOOGLE','Tw Trí','https://res.cloudinary.com/dbpchaamx/image/upload/v1748837376/avatars/user_11.png',NULL,NULL,'trikun2k4@gmail.com',1,0,'2025-06-02 11:09:26','2025-06-02 11:09:26',NULL,NULL,'106250994131249737773'),(18,'tri112','$2a$10$Qahyt2vOlGWLO1ZKt2CTxuPq/0E16Lg1yO40iG6CIOD3NWpi7jj8q','ee',NULL,'2025-02-12','0836020944','gokun9x@gmail.com',1,0,'2025-06-02 17:21:57','2025-06-02 17:21:57',NULL,NULL,NULL),(19,'abc','$2a$10$5fp9QKarBiQTix/XEGtEIeeHPvdBKAswVyWfrOEstfMHliUwCDq2i','tran vo van tri223','https://res.cloudinary.com/dbpchaamx/image/upload/v1748875718/avatars/user_19.png','2004-05-29','0836020944','gokun2k4@gmail.com',1,0,'2025-06-02 17:25:04','2025-06-02 17:25:04',NULL,NULL,NULL),(20,'asd','$2a$10$5HtDxl/BLYFv9lwkbcRok.0/HlAj5mPmAAw.xIzD9KQ4WfqrHNP4q','ee',NULL,'2025-02-12','0836020944','trilearn11@gmail.com',1,0,'2025-06-02 17:26:21','2025-06-02 17:26:21',NULL,NULL,NULL);
/*!40000 ALTER TABLE `tbl_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_role`
--

DROP TABLE IF EXISTS `tbl_user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_role` (
  `user_role_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_role_id`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `tbl_user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`),
  CONSTRAINT `tbl_user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `tbl_role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_role`
--

LOCK TABLES `tbl_user_role` WRITE;
/*!40000 ALTER TABLE `tbl_user_role` DISABLE KEYS */;
INSERT INTO `tbl_user_role` VALUES (7,18,2),(8,19,2),(9,20,2);
/*!40000 ALTER TABLE `tbl_user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_voucher`
--

DROP TABLE IF EXISTS `tbl_user_voucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_voucher` (
  `user_voucher_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `voucher_id` int NOT NULL,
  PRIMARY KEY (`user_voucher_id`),
  KEY `user_id` (`user_id`),
  KEY `voucher_id` (`voucher_id`),
  CONSTRAINT `tbl_user_voucher_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`),
  CONSTRAINT `tbl_user_voucher_ibfk_2` FOREIGN KEY (`voucher_id`) REFERENCES `tbl_voucher` (`voucher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_voucher`
--

LOCK TABLES `tbl_user_voucher` WRITE;
/*!40000 ALTER TABLE `tbl_user_voucher` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_user_voucher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_verification_token`
--

DROP TABLE IF EXISTS `tbl_verification_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_verification_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `expiry_date` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `expiry_date_idx` (`expiry_date`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_verification_token`
--

LOCK TABLES `tbl_verification_token` WRITE;
/*!40000 ALTER TABLE `tbl_verification_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_verification_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_voucher`
--

DROP TABLE IF EXISTS `tbl_voucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_voucher` (
  `voucher_id` int NOT NULL AUTO_INCREMENT,
  `voucher_code` varchar(50) NOT NULL,
  `voucher_name` varchar(100) NOT NULL,
  `description` tinytext,
  `required_points` int DEFAULT '0',
  `discount_amount` decimal(10,2) NOT NULL,
  `valid_from` date NOT NULL,
  `valid_until` date NOT NULL,
  PRIMARY KEY (`voucher_id`),
  UNIQUE KEY `voucher_code` (`voucher_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_voucher`
--

LOCK TABLES `tbl_voucher` WRITE;
/*!40000 ALTER TABLE `tbl_voucher` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_voucher` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-02 22:32:57
