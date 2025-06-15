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
  `voucher_id` int DEFAULT NULL,
  `original_price` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `final_price` decimal(10,2) NOT NULL,
  `payment_method` enum('credit_card','bank_transfer','momo','zalo_pay','vnpay') NOT NULL,
  `payment_status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `paid_at` datetime DEFAULT NULL,
  `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `qr_code_data` text,
  `showing_time_id` int DEFAULT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `voucher_id` (`voucher_id`),
  KEY `showing_time_id` (`showing_time_id`),
  CONSTRAINT `tbl_booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`),
  CONSTRAINT `tbl_booking_ibfk_3` FOREIGN KEY (`voucher_id`) REFERENCES `tbl_voucher` (`voucher_id`),
  CONSTRAINT `tbl_booking_ibfk_4` FOREIGN KEY (`showing_time_id`) REFERENCES `tbl_showing_time` (`showing_time_id`)
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
  `seat_id` int DEFAULT NULL,
  `zone_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled','refunded') DEFAULT 'pending',
  PRIMARY KEY (`booking_seat_id`),
  KEY `booking_id` (`booking_id`),
  KEY `seat_id` (`seat_id`),
  KEY `zone_id` (`zone_id`),
  CONSTRAINT `tbl_booking_seat_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `tbl_booking` (`booking_id`),
  CONSTRAINT `tbl_booking_seat_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `tbl_seat` (`seat_id`),
  CONSTRAINT `tbl_booking_seat_ibfk_3` FOREIGN KEY (`zone_id`) REFERENCES `tbl_zone` (`zone_id`)
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_category`
--

LOCK TABLES `tbl_category` WRITE;
/*!40000 ALTER TABLE `tbl_category` DISABLE KEYS */;
INSERT INTO `tbl_category` VALUES (1,'Music Concert'),(3,'Phòng trà'),(2,'Thể thao điện tử ');
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
  `description` text,
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
  KEY `fk_event_status` (`status_id`),
  CONSTRAINT `fk_event_status` FOREIGN KEY (`status_id`) REFERENCES `tbl_event_status` (`status_id`),
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_event_status`
--

LOCK TABLES `tbl_event_status` WRITE;
/*!40000 ALTER TABLE `tbl_event_status` DISABLE KEYS */;
INSERT INTO `tbl_event_status` VALUES (1,'Bản nháp'),(2,'Chờ duyệt'),(6,'Đã hoàn tất'),(7,'Đã hủy'),(3,'Đã xuất bản'),(5,'Đang diễn ra'),(4,'Sắp diễn ra');
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
  `full_name` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `org_name` varchar(200) DEFAULT NULL,
  `org_type` varchar(50) DEFAULT NULL,
  `tax_code` varchar(50) DEFAULT NULL,
  `org_address` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `business_field` varchar(100) DEFAULT NULL,
  `org_info` text,
  `org_logo_url` varchar(255) DEFAULT NULL,
  `id_card_front_url` varchar(255) DEFAULT NULL,
  `id_card_back_url` varchar(255) DEFAULT NULL,
  `business_license_url` varchar(255) DEFAULT NULL,
  `experience` text,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`organizer_id`),
  UNIQUE KEY `unique_email` (`email`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_organizer_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_organizer`
--

LOCK TABLES `tbl_organizer` WRITE;
/*!40000 ALTER TABLE `tbl_organizer` DISABLE KEYS */;
INSERT INTO `tbl_organizer` VALUES (1,'Nguyễn Văn A','organizer@example.com','0987654321','Công ty Tổ chức Sự kiện ABC','Doanh nghiệp tư nhân','1234567890','Số 123 Đường ABC, Quận XYZ, TP.HCM','https://abc-event.com','Sự kiện văn hóa, giải trí','Thông tin mô tả về công ty','https://example.com/logo.png','https://example.com/id-card-front.jpg','https://example.com/id-card-back.jpg','https://example.com/business-license.jpg','Kinh nghiệm 5 năm trong lĩnh vực tổ chức sự kiện','approved','2025-06-10 12:15:26','2025-06-10 12:15:26',66);
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
  `comment` text,
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_role`
--

LOCK TABLES `tbl_role` WRITE;
/*!40000 ALTER TABLE `tbl_role` DISABLE KEYS */;
INSERT INTO `tbl_role` VALUES (1,'ADMIN'),(3,'ORGANIZER'),(2,'USER');
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
  `showing_time_id` int NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `seat_label` varchar(10) DEFAULT NULL,
  `x` int DEFAULT NULL,
  `y` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`seat_id`),
  KEY `showing_time_id` (`showing_time_id`),
  KEY `type` (`type`),
  CONSTRAINT `tbl_seat_ibfk_1` FOREIGN KEY (`showing_time_id`) REFERENCES `tbl_showing_time` (`showing_time_id`)
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
-- Table structure for table `tbl_showing_time`
--

DROP TABLE IF EXISTS `tbl_showing_time`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_showing_time` (
  `showing_time_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `address_id` int NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `sale_open_time` datetime DEFAULT NULL,
  `sale_close_time` datetime DEFAULT NULL,
  `layout_mode` enum('seat','zone','both') NOT NULL,
  PRIMARY KEY (`showing_time_id`),
  KEY `event_id` (`event_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `tbl_showing_time_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`),
  CONSTRAINT `tbl_showing_time_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `tbl_address` (`address_id`)
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
INSERT INTO `tbl_token` VALUES (1,'user1','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMSIsImV4cCI6MTc0ODc3NTExMSwiaWF0IjoxNzQ4NzcxNTExfQ.rUfufKFyN0erAsd0x909WwXrtQHlxOJaXGYaXzOXSfdJ2k3Ea8ZjNyJSvONGoJUWCJnrGjNTvqkeIqCUSkf8aw','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMSIsImV4cCI6MTc0ODgyNTUxMSwiaWF0IjoxNzQ4NzcxNTExfQ.GB25PpXKmKMqsDMs0RSS6ayCPr1fGPkWSkbhio1HzZ8cz-P-i5RdaG93ur0MfJ0aFGtTiy3ZBilNEp5StAliIQ'),(2,'jane@example.com','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqYW5lQGV4YW1wbGUuY29tIiwiZXhwIjoxNzQ5MDMwOTkwLCJpYXQiOjE3NDkwMjczOTB9.yaBrwlk15Q-VKmOTqerp1SlKuA6C1Oo5gU-MvGbwceJ-t6PYYP1yKVCYHx9RbHE10yI7nhQiM87VGV-AmNbC3g','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqYW5lQGV4YW1wbGUuY29tIiwiZXhwIjoxNzQ5MDgxMzkwLCJpYXQiOjE3NDkwMjczOTB9.KnhdGPqPJhHKhh5b0ExbPWgub1jajLPMkw2bLqqGg9FPji8EEKa3RhHfPEs65NHsFjOMgvg4SLz38fLmdHLvKg'),(3,'jacba1czxe111@example.com','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqYWNiYTFjenhlMTExQGV4YW1wbGUuY29tIiwiZXhwIjoxNzQ5MTQ0NTQ0LCJpYXQiOjE3NDkxNDA5NDR9.SXqXqJp7_vfcNcM2GNHIwqvzgAW4aYmqQRCUIXRtpJP3lixyuOrpp19ijI8olypv85cs_QSce7dPbiJykifb-g','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqYWNiYTFjenhlMTExQGV4YW1wbGUuY29tIiwiZXhwIjoxNzQ5MTk0OTQ0LCJpYXQiOjE3NDkxNDA5NDR9.V9ltnt82lRBgTWxMJUyUd2efp3wKhf7GF0JKOC8FMgUM-LUm1-PLw1Xk4B_PphDi2aIcDHzyzgRo21u0PTE1Sg');
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
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user`
--

LOCK TABLES `tbl_user` WRITE;
/*!40000 ALTER TABLE `tbl_user` DISABLE KEYS */;
INSERT INTO `tbl_user` VALUES (2,'$2a$10$vO4.s7XVuU4wXmzVmFkKvO3ycefMy2T8zyimUQDIazGmLMZGupmxa','Jane Smith',NULL,NULL,'0987654321','jane@example.com',1,20,'2025-05-28 14:07:14','2025-05-29 15:22:14','system','system',NULL),(3,'$2a$10$vO4.s7XVuU4wXmzVmFkKvO3ycefMy2T8zyimUQDIazGmLMZGupmxa','Administrator',NULL,NULL,'0111222333','admin@example.com',1,30,'2025-05-28 14:07:14','2025-05-29 15:22:14','system','system',NULL),(4,'$2a$10$vO4.s7XVuU4wXmzVmFkKvO3ycefMy2T8zyimUQDIazGmLMZGupmxa','User One',NULL,NULL,'0222333444','user1@example.com',1,15,'2025-05-28 14:07:14','2025-05-29 15:22:14','system','system',NULL),(5,'$2a$10$vO4.s7XVuU4wXmzVmFkKvO3ycefMy2T8zyimUQDIazGmLMZGupmxa','User Two',NULL,NULL,'0333444555','user2@example.com',1,25,'2025-05-28 14:07:14','2025-05-29 15:22:14','system','system',NULL),(28,'$2a$10$Yssv3tdJ3t5w.F2dcUiL3O6MDPG0d3YykgsOFnY.2NEeD4CicDfDy','levangiabao',NULL,'2004-06-03','0352039921','giabao362020114@gmail.com',1,0,'2025-05-29 16:13:29','2025-05-29 16:13:29',NULL,NULL,NULL),(36,'$2a$10$4Y46r7L8TNLRIpJDZFMEZeXNyjcgpVdbEpxr85XhHXWjehVjNoVuG','John Doe',NULL,'2000-01-01','0912345678','john.doe@example.com',1,0,'2025-06-01 08:34:29','2025-06-01 08:34:29',NULL,NULL,NULL),(39,'$2a$10$cKhy4bYP73NcjBJeJn8rveRdOJnz6nIzfR2H1sld1h8.kokp1zZha','Lê Văn Gia Bảo',NULL,'2025-06-01','0352038856','giabao362004@gmail.com',1,0,'2025-06-01 11:49:08','2025-06-01 11:49:08',NULL,NULL,NULL),(40,'$2a$10$XyYdC7.X7FfiONAkuUoRd.Oxly0bvwJDPYN1G9hO1INth..j7xq3.','Le Van Gia Bao',NULL,'2025-06-02','0352038856','giabao3620041@gmail.com',1,0,'2025-06-02 12:19:20','2025-06-02 12:19:20',NULL,NULL,NULL),(41,'$2a$10$jlbCIAZXHmOtbZc/b/12SuDfhETxRxtypvBwLVpqhc.ZQeA6T84/K','John Doe',NULL,'2000-01-01','0912345678','jane1@example.com',1,0,'2025-06-04 21:51:37','2025-06-04 21:51:37',NULL,NULL,NULL),(43,'$2a$10$IcJJOUDS/ztH4Ib9mcA0VOfMWSM1bp5.PTk83.pvDNPCJFakOU4.C','Le Van Gia Bao',NULL,'2025-06-04','0352038856','giabao1231@gmail.com',1,0,'2025-06-04 22:29:29','2025-06-04 22:29:29',NULL,NULL,NULL),(44,'$2a$10$5M5i9qoZBSIWSRa94Cce8.3bni3NFTGTWO4GJIPmVsrlAlfeQtCcu','Le Van Gia Bao',NULL,'2025-06-04','0914099824','giabaokk@gmail.com',1,0,'2025-06-04 22:43:06','2025-06-04 22:43:06',NULL,NULL,NULL),(45,'$2a$10$oG2Szjiy75fLRVR3agyu2OMN2od3r9xEU0mvGHYUw5nK9UXp032Fi','John Doe',NULL,'2000-01-01','0912345678','jan1e1@example.com',1,0,'2025-06-04 22:51:28','2025-06-04 22:51:28',NULL,NULL,NULL),(46,'$2a$10$TTKhkO6FY7iJ0ordbG2IB.cYcY9X6oODZBGGAZ708oIgxMQ9MOwMK','John Doe',NULL,'2000-01-01','0912345678','jan1e11@example.com',1,0,'2025-06-04 22:55:31','2025-06-04 22:55:31',NULL,NULL,NULL),(47,'$2a$10$NCYt1ZFjxPeT06TZXadGo.ZecGENgJ9l45FwC6B77HyN0FUHO5OMm','John Doe',NULL,'2000-01-01','0912345678','jan1e111@example.com',1,0,'2025-06-04 22:57:33','2025-06-04 22:57:33',NULL,NULL,NULL),(48,'$2a$10$fKl4Ga/wYMEBilUdZssHHOObfDSAjZGFYM1VsMiuAR/3LsCYC5yby','John Doe',NULL,'2000-01-01','0912345678','jan1e1111@example.com',1,0,'2025-06-04 23:01:33','2025-06-04 23:01:33',NULL,NULL,NULL),(49,'$2a$10$ZsqFhltopM2WVrc3iFJbL.wijn4XsJ5xKfgP07kuFTzM.ec5635f.','John Doe',NULL,'2000-01-01','0912345678','jacn1e1111@example.com',1,0,'2025-06-04 23:03:44','2025-06-04 23:03:44',NULL,NULL,NULL),(50,'$2a$10$cniLZMoPdjX2GIwjK.iZLeCXQsr7pKYP8V0O/mD6aONrYWuGSSjte','Le Van Gia Hoang',NULL,'2013-02-04','0935203991','giabaoz3620014@gmail.com',1,0,'2025-06-04 23:33:22','2025-06-04 23:33:22',NULL,NULL,NULL),(51,'$2a$10$6YjwJfnThneSYz/ksalIYOYGpE6clSMS2i0YghfGz6svmTCN/xElG','John Doe',NULL,'2000-01-01','0912345678','jacn1ze1111@example.com',1,0,'2025-06-04 23:34:17','2025-06-04 23:34:17',NULL,NULL,NULL),(52,'$2a$10$iJY0EEc3N7mR1Rp2f4c0deXj/FMHdJlx06zR6d2JwTVJRdAYF14RK','Le Van Gia Hoang',NULL,'2013-02-04','0935203991','giabao1z3620014@gmail.com',1,0,'2025-06-04 23:37:53','2025-06-04 23:37:53',NULL,NULL,NULL),(53,'$2a$10$zbz8kg5Cwd1X1Ng6GSYOn.kbY6RQKuS.TtC0TfLdlIXozv7nXThEO','Le Van Gia Hoang',NULL,'2013-02-04','0935203991','giabaao1z3620014@gmail.com',1,0,'2025-06-04 23:38:32','2025-06-04 23:38:32',NULL,NULL,NULL),(54,'$2a$10$uzM4lRulwpd3jBG5ameYNeXV4fHb59mq8wYY8MrKulceOatzu8iCu','Le Van Gia Hoang',NULL,'2013-02-04','0935203991','giabaao1zz3620014@gmail.com',1,0,'2025-06-04 23:41:56','2025-06-04 23:41:56',NULL,NULL,NULL),(55,'$2a$10$0/jbmLAyEAeFIEPKmZs97OL6.HytjOVnRL18CG9NvxWLR5rZanqY2','asdfasdfasdf',NULL,'2025-05-28','0352039912','giabaao@gmail.com',1,0,'2025-06-04 23:49:42','2025-06-04 23:49:42',NULL,NULL,NULL),(56,'$2a$10$oJJ.wpJXr1EZcEuw6LUR1eVjTEUjHU.3KoDHE3mn2T556EfcLHsn.','GiaBao',NULL,'2025-05-27','0912022321','giabaook@gmail.com',1,0,'2025-06-04 23:56:22','2025-06-04 23:56:22',NULL,NULL,NULL),(57,'$2a$10$0/zLtYb0osr8EGZ896EUaea2vEOOQ3QYPj/XSDaPLFkQkb9PUNQea','John Doe',NULL,'2000-01-01','0912345678','jacna1ze1111@example.com',1,0,'2025-06-04 23:57:19','2025-06-04 23:57:19',NULL,NULL,NULL),(58,'$2a$10$e2/KG4AgQmQ/RjfAcZQYCOREUypTPWb4agxcaFWtQw5/moA.ZdW3u','John Doe',NULL,'2000-01-01','0912345678','jacna1cze1111@example.com',1,0,'2025-06-05 00:02:39','2025-06-05 00:02:39',NULL,NULL,NULL),(59,'$2a$10$AiumAyqalcsMs9Ahwfx99.9xfsoGCv2D6wwJGzkEvQKfb9DN1JNrq','John Doe',NULL,'2000-01-01','0912345678','jacbna1cze1111@example.com',1,0,'2025-06-05 00:04:42','2025-06-05 00:04:42',NULL,NULL,NULL),(60,'$2a$10$xbeiaznQ5QFBgNGAIIdp4ef3gOnQRWyoHz2h.hYd1zZ81rbdOWy0C','John Doe',NULL,'2000-01-01','0912345678','jacbna1czxe1111@example.com',1,0,'2025-06-05 00:10:42','2025-06-05 00:10:42',NULL,NULL,NULL),(61,'$2a$10$mr7jgGbpV1tGEoVcEpTXxeiJ.Z1l6BGAkskQnARW9vb.ZXE.53t7W','John Doe',NULL,'2000-01-01','0912345678','jacbna1czxe111@example.com',1,0,'2025-06-05 00:11:15','2025-06-05 00:11:15',NULL,NULL,NULL),(62,'$2a$10$WgkA1UMMnkOfxhD1e.E/TuRxJ0o.CGfUDBVWej2Kkxm7I7k1aucpy','John Doe',NULL,'2000-01-01','0912345678','jacba1czxe111@example.com',1,0,'2025-06-05 00:17:20','2025-06-05 00:17:20',NULL,NULL,NULL),(63,'$2a$10$TErD2UNK.FHC9608vPNZsOOGB1RglXleGRFocsTW.8gEBPDASUgVW','Le Van Gia Bao',NULL,'2025-06-04','0352038856','giabcao362004@gmail.com',1,0,'2025-06-05 00:37:25','2025-06-05 00:37:25',NULL,NULL,NULL),(64,'GOOGLE','Bảo Lê','https://lh3.googleusercontent.com/a/ACg8ocK47Pq32UP3Dk6mnwbzf_Fb7Sb5ullD1BqzC1-81qWhiTad1TI=s96-c',NULL,NULL,'giabaoworking362004@gmail.com',1,0,'2025-06-08 17:05:01','2025-06-08 17:05:01',NULL,NULL,'117286615578928784419'),(65,'GOOGLE','Tw Trí','https://lh3.googleusercontent.com/a/ACg8ocLCYvfE4Zifwxx9fre6TQXP_XK10aUZwGduVxT-AQUdtxx5tG03=s96-c',NULL,NULL,'trikun2k4@gmail.com',1,0,'2025-06-10 15:21:49','2025-06-10 15:21:49',NULL,NULL,'106250994131249737773'),(66,'$2a$10$B7xxwcQmPZcvgLqA7mFNeebC6FlrxlgaTEHFvD9tf3xbcNAbWMPeO','ee',NULL,'2010-01-02','0836020944','gokun9x@gmail.com',1,0,'2025-06-10 16:35:42','2025-06-10 16:35:42',NULL,NULL,NULL),(72,'123456','John Doe','https://example.com/profile.jpg','1990-01-01','1234567890','admin32@example.com',1,0,'2025-06-10 10:13:47','2025-06-10 10:13:47',NULL,NULL,NULL),(73,'$2a$10$JMDuVPOoZqBsaZh/JLu4t.6IzhRNApLchIM64AHQU27QK1W2V9Mk6','ee',NULL,'2010-01-02','0836020944','gokun2k4@gmail.com',1,0,'2025-06-10 17:26:09','2025-06-10 17:26:09',NULL,NULL,NULL),(74,'GOOGLE','kk tri','https://res.cloudinary.com/dbpchaamx/image/upload/v1749734835/avatars/user_74.jpg',NULL,NULL,'trilearn11@gmail.com',1,0,'2025-06-12 15:59:15','2025-06-12 15:59:15',NULL,NULL,'118028385234479742417');
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_role`
--

LOCK TABLES `tbl_user_role` WRITE;
/*!40000 ALTER TABLE `tbl_user_role` DISABLE KEYS */;
INSERT INTO `tbl_user_role` VALUES (2,2,2),(3,3,1),(4,4,2),(5,5,1),(7,39,2),(8,40,2),(9,41,2),(10,43,2),(11,44,2),(12,45,2),(13,46,2),(14,47,2),(15,48,2),(16,49,2),(17,50,2),(18,51,2),(19,52,2),(20,53,2),(21,54,2),(22,55,2),(23,56,2),(24,57,2),(25,58,2),(26,59,2),(27,60,2),(28,61,2),(29,62,2),(30,63,2),(31,66,3),(32,73,1),(33,74,2);
/*!40000 ALTER TABLE `tbl_user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_temp`
--

DROP TABLE IF EXISTS `tbl_user_temp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_temp` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `verification_token` varchar(100) NOT NULL,
  `token_expiry` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_email_token` (`email`,`verification_token`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_temp`
--

LOCK TABLES `tbl_user_temp` WRITE;
/*!40000 ALTER TABLE `tbl_user_temp` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_user_temp` ENABLE KEYS */;
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
  UNIQUE KEY `token` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `description` text,
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

--
-- Table structure for table `tbl_zone`
--

DROP TABLE IF EXISTS `tbl_zone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_zone` (
  `zone_id` int NOT NULL AUTO_INCREMENT,
  `showing_time_id` int NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `zone_name` varchar(100) DEFAULT NULL,
  `x` int DEFAULT NULL,
  `y` int DEFAULT NULL,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `capacity` int NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`zone_id`),
  KEY `showing_time_id` (`showing_time_id`),
  CONSTRAINT `tbl_zone_ibfk_1` FOREIGN KEY (`showing_time_id`) REFERENCES `tbl_showing_time` (`showing_time_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_zone`
--

LOCK TABLES `tbl_zone` WRITE;
/*!40000 ALTER TABLE `tbl_zone` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_zone` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-15 19:35:32
