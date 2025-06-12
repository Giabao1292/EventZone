-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: event
-- ------------------------------------------------------
-- Server version	9.3.0

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
  `payment_method` enum('credit_card','bank_transfer','momo','zalo_pay','vnpay') NOT NULL,
  `payment_status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `paid_at` datetime DEFAULT NULL,
  `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `qr_code_data` text,
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_category`
--

LOCK TABLES `tbl_category` WRITE;
/*!40000 ALTER TABLE `tbl_category` DISABLE KEYS */;
INSERT INTO `tbl_category` VALUES (1,'Âm nhạc'),(3,'Khác'),(2,'Thể thao');
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
  `header_image` text,
  `poster_image` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(50) DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `organizer_id` (`organizer_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `tbl_event_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `tbl_organizer` (`organizer_id`),
  CONSTRAINT `tbl_event_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `tbl_category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_event`
--

LOCK TABLES `tbl_event` WRITE;
/*!40000 ALTER TABLE `tbl_event` DISABLE KEYS */;
INSERT INTO `tbl_event` VALUES (1,1,1,'Lễ hội âm nhạc quốc tế 2025',1,'All Ages','2025-07-20 18:00:00','2025-07-20 22:30:00','Lễ hội quy tụ các ban nhạc đến từ Nhật Bản, Hàn Quốc và Việt Nam.','Sự kiện âm nhạc hot nhất mùa hè!','https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2','https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg','2025-06-06 13:56:37','2025-06-06 13:56:37','admin',NULL),(2,1,2,'Giải bóng đá sinh viên toàn quốc',1,'All Ages','2025-08-01 08:00:00','2025-08-05 18:00:00','Giải đấu quy mô toàn quốc dành cho sinh viên với hơn 30 đội tham gia.','Cổ vũ cho trường bạn!','https://images.unsplash.com/photo-1549921296-3a6b3d3c112b','https://images.unsplash.com/photo-1517649763962-0c623066013b','2025-06-06 13:56:37','2025-06-06 13:56:37','admin',NULL),(3,1,3,'Giao lưu cộng đồng khởi nghiệp',1,'16+','2025-07-10 19:30:00','2025-07-10 21:30:00','Buổi giao lưu giữa các startup trẻ và nhà đầu tư tiềm năng.','Cơ hội kết nối và học hỏi!','https://images.unsplash.com/photo-1551836022-d5d88e9218df','https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop','2025-06-06 13:56:37','2025-06-06 13:56:37','admin',NULL),(16,2,1,'Sunset Chill Music Night',1,'All Ages','2025-08-05 17:30:00','2025-08-05 21:00:00','Thưởng thức âm nhạc acoustic nhẹ nhàng giữa không gian hoàng hôn tuyệt đẹp tại bờ sông Sài Gòn.','Hòa mình vào âm nhạc và hoàng hôn.','https://media.istockphoto.com/id/1201152636/vi/anh/ban-nh%E1%BA%A1c-bi%E1%BB%83u-di%E1%BB%85n.jpg?s=1024x1024&w=is&k=20&c=SFkdRViLDTPSkqxjvL-GldXI-FgsLx3kfvcwobjPX6g=','https://images.unsplash.com/photo-1594937391335-e25ef9b03186?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWNvdXN0aWMlMjBldmVudHxlbnwwfHwwfHx8MA%3D%3D','2025-06-09 11:47:21','2025-06-09 11:47:21','admin','admin'),(17,2,2,'Trận Giao Hữu Quốc Tế: Việt Nam vs Thái Lan',1,'All Ages','2025-07-25 19:00:00','2025-07-25 21:00:00','Cuộc so tài hấp dẫn giữa hai đội bóng hàng đầu Đông Nam Á tại SVĐ Thống Nhất.','Đại chiến Đông Nam Á!','data:image/jpeg;base64,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','https://media.istockphoto.com/id/1442743958/vi/anh/s%C3%A2n-b%C3%B3ng-%C4%91%C3%A1-xanh-%C4%91%C3%A8n-s%C3%A2n-b%C3%B3ng-s%C3%A1ng.jpg?s=1024x1024&w=is&k=20&c=QgX1yNXQjbt7wpH3olMTnRTveXzE9eMovAI5NQrKIgM=','2025-06-09 11:47:21','2025-06-09 11:47:21','admin','admin'),(18,2,1,'EDM Rave Night 2025',1,'18+','2025-09-12 20:00:00','2025-09-13 02:00:00','Bữa tiệc âm nhạc điện tử sôi động với DJ quốc tế, âm thanh ánh sáng đỉnh cao.','Cháy hết mình cùng EDM!','https://images.unsplash.com/photo-1660634061919-a9e2e00ba19b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D','https://media.istockphoto.com/id/2185378721/vi/anh/back-view-of-female-dj-with-long-blonde-hair-performing-live-at-a-night-club-playing-techno.jpg?s=1024x1024&w=is&k=20&c=RdKZ_Lq9YKUox1Vs6_fJRya3ayMS2iDrqQ1uZQ80yYo=','2025-06-09 11:47:21','2025-06-09 11:47:21','admin','admin'),(19,2,2,'WORLD CUP 2024 - Chung Kết',1,'All Ages','2024-07-14 20:00:00','2024-07-14 22:00:00','Trận đấu được chờ đợi nhất châu Âu tại sân vận động Olympiastadion Berlin.','Ai sẽ là nhà vô địch Thế Giới ?','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoyjrQ0OxkFChMlQ_y1Vz7bQHIvUuLaMjjYQ&s','https://media.istockphoto.com/id/698848166/vi/anh/c%C3%BAp-li%C3%AAn-%C4%91o%C3%A0n-c%C3%A1c-ch%C3%A2u-l%E1%BB%A5c-c%C3%BAp-v%C3%A0ng-d%C6%B0%E1%BB%9Bi-d%E1%BA%A1ng-to%C3%A0n-c%E1%BA%A7u-k%E1%BA%BFt-xu%E1%BA%A5t-2017-3d-2017.jpg?s=1024x1024&w=is&k=20&c=IsRI2rwTyrw4_uHkoL5RnRVNo6pPotg-qSY_5K-HKXg=','2025-06-09 11:47:21','2025-06-09 11:47:21','admin','admin');
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
  `description` text,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_organizer`
--

LOCK TABLES `tbl_organizer` WRITE;
/*!40000 ALTER TABLE `tbl_organizer` DISABLE KEYS */;
INSERT INTO `tbl_organizer` VALUES (1,2,'Công ty Tổ chức Sự kiện A',1,'2025-06-06 10:02:16','2025-06-06 10:02:16','2',NULL),(2,1,'Công ty Sự kiện B',1,'2025-06-09 11:13:42','2025-06-09 11:13:42','admin','admin');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_role`
--

LOCK TABLES `tbl_role` WRITE;
/*!40000 ALTER TABLE `tbl_role` DISABLE KEYS */;
INSERT INTO `tbl_role` VALUES (1,'admin'),(2,'user');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_token`
--

LOCK TABLES `tbl_token` WRITE;
/*!40000 ALTER TABLE `tbl_token` DISABLE KEYS */;
INSERT INTO `tbl_token` VALUES (4,'nhi123','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuaGkxMjMiLCJleHAiOjE3NDg5MTczODYsImlhdCI6MTc0ODkxMzc4Nn0.CPu0ZBOXe9c1TlbOH3pIe25q5vvvUPvGh2zb_s43Md73XsOH6AgpIAd_sM56RKfQk9beqD_AraX0lwDB4c9QBg','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuaGkxMjMiLCJleHAiOjE3NDg5Njc3ODYsImlhdCI6MTc0ODkxMzc4Nn0.0APFtnLXaatPqwIJ-9mlMGsrlnEi_xnyRR3QfbgQHxqDGa7m4gMppwd3Dg5x552ZT986sVbdPx00erbbMDcTow');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user`
--

LOCK TABLES `tbl_user` WRITE;
/*!40000 ALTER TABLE `tbl_user` DISABLE KEYS */;
INSERT INTO `tbl_user` VALUES (1,'GOOGLE','Bui Yen Nhi (K18 DN)','https://res.cloudinary.com/dbpchaamx/image/upload/v1748864513/avatars/user_1.jpg',NULL,NULL,'nhibyde181014@fpt.edu.vn',1,0,'2025-06-02 18:41:40','2025-06-02 18:41:40',NULL,NULL,'115228405004680159814'),(2,'$2a$10$5toYpwTIl4AGuYZxIfpAeuDfPcFu6bCJHbVhjgN0Co1RRz86OKfhm','Bui Yen Nhi','https://res.cloudinary.com/dbpchaamx/image/upload/v1749041437/avatars/user_2.webp','2004-01-01','0934929173','nhybui2312@gmail.com',1,0,'2025-06-02 23:34:27','2025-06-02 23:34:27',NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_role`
--

LOCK TABLES `tbl_user_role` WRITE;
/*!40000 ALTER TABLE `tbl_user_role` DISABLE KEYS */;
INSERT INTO `tbl_user_role` VALUES (1,2,2);
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_temp`
--

LOCK TABLES `tbl_user_temp` WRITE;
/*!40000 ALTER TABLE `tbl_user_temp` DISABLE KEYS */;
INSERT INTO `tbl_user_temp` VALUES (1,'john.doe123@example.com','John Doe','$2a$10$XhMWG.M9O0cWJeHamzVAOe/gkhAWaA318IuBaD6wNuDI18kYJzpua','0912345678','2000-01-01','eec61753-f7d5-459e-9ad6-19dd6abaddfd','2025-06-05 08:54:15'),(2,'jane1@example.com','John Doe','$2a$10$jlbCIAZXHmOtbZc/b/12SuDfhETxRxtypvBwLVpqhc.ZQeA6T84/K','0912345678','2000-01-01','6a415936-ae97-49b2-8f9c-3abb70f1fc1e','2025-06-05 14:49:21'),(3,'giabao1234@gmail.com','Le Van Gia Bao','$2a$10$SOFjbe8iFwt4fVXRghty7uiNDv0/fuPQ7sNEN20Iq2b52i7sNH.aC','0352038856','2025-06-04','151197f6-ff84-4e16-be59-8d858ae1c071','2025-06-05 10:48:36'),(4,'giabao3620014@gmail.com','Le Van Gia Bao','$2a$10$.mxvhE.B5t6h7AyPq5NG7egYE9sReRGiUiSiAX1QWN4q.xPY/hJVK','0352038816','2025-06-04','4f4d7cc1-3563-47b7-8bb1-be62fd2efb94','2025-06-05 12:38:29'),(11,'jan1e1â111@example.com','John Doe','$2a$10$HW8E7R7IfJk/FjenlwLxhOFhtYtKWcgBUgAXUsX3AZ73ld3Qn823i','0912345678','2000-01-01','d5aac90e-fd96-44d4-95d0-3b79b9d42635','2025-06-05 16:03:09');
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
  KEY `expiry_date_idx` (`expiry_date`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-12 12:49:00
