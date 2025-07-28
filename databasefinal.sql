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
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'0','<< Flyway Baseline >>','BASELINE','<< Flyway Baseline >>',NULL,'root','2025-06-21 07:55:36',0,1),(2,'1','alter some table','SQL','V1__alter_some_table.sql',1448172504,'root','2025-06-21 07:59:45',22,1),(3,'2','alter null payment','SQL','V2__alter_null_payment.sql',-20772597,'root','2025-07-03 08:26:39',79,1),(4,'3','alter event status','SQL','V3__alter_event_status.sql',789653682,'root','2025-07-03 08:26:39',5,1),(5,'4','create rejection reason','SQL','V4__create_rejection_reason.sql',1786799909,'root','2025-07-03 08:26:39',25,1),(6,'5','alter booking qr checkin','SQL','V5__alter_booking_qr_checkin.sql',-414105222,'root','2025-07-03 08:26:39',27,1),(7,'6','alter showing time','SQL','V6__alter_showing_time.sql',-1763124339,'root','2025-07-03 08:26:39',4,1),(8,'7','add status column to voucher','SQL','V7__add_status_column_to_voucher.sql',-3606797,'root','2025-07-03 08:26:39',16,1),(9,'8','alter event status','SQL','V8__alter_event_status.sql',1408908737,'root','2025-07-03 08:26:39',7,1),(10,'9','add table eventAds','SQL','V9__add_table_eventAds.sql',-1442858516,'root','2025-07-03 08:26:39',26,1),(11,'10','alter booking checkinstatus','SQL','V10__alter_booking_checkinstatus.sql',332522009,'root','2025-07-03 08:26:39',48,1),(12,'11','add wishlist','SQL','V11__add_wishlist.sql',599677261,'root','2025-07-03 09:35:12',36,1),(13,'14','review','SQL','V14__review.sql',-1039270340,'root','2025-07-08 13:52:53',400,1),(14,'19','withdraw request','SQL','V19__withdraw_request.sql',438338550,'root','2025-07-09 03:29:36',36,1),(15,'50','add table notifications','SQL','V50__add_table_notifications.sql',-1748575568,'root','2025-07-10 03:25:51',49,1),(16,'39','drop review update','SQL','V39__drop_review_update.sql',649958842,'root','2025-07-11 12:46:44',114,1),(17,'33','add table view','SQL','V33__add_table_view.sql',-1786503163,'root','2025-07-12 08:45:41',87,1),(18,'30','alter tbl showing time','SQL','V30__alter_tbl_showing_time.sql',-870918850,'root','2025-07-14 11:53:01',181,1),(20,'76','add isUse','SQL','V76__add_isUse.sql',90914769,'root','2025-07-15 07:31:15',71,1),(21,'31','add tbl event reschedule request','SQL','V31__add_tbl_event_reschedule_request.sql',-1645901315,'root','2025-07-16 10:18:27',100,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_address`
--

LOCK TABLES `tbl_address` WRITE;
/*!40000 ALTER TABLE `tbl_address` DISABLE KEYS */;
INSERT INTO `tbl_address` VALUES (1,'NHà hát lớn','Xã Thụy Lôi, Huyện Tiên Lữ, Tỉnh Hưng Yên','Tỉnh Hưng Yên'),(2,'Nhà hát lớn','Phường Kim Liên, Quận Đống Đa, Thành phố Hà Nội','Thành phố Hà Nội'),(3,'Nhà','Xã Mai Đình, Huyện Hiệp Hòa, Tỉnh Bắc Giang','Tỉnh Bắc Giang'),(4,'abc','Xã Hà Kỳ, Huyện Tứ Kỳ, Tỉnh Hải Dương','Tỉnh Hải Dương'),(5,'asd','Xã Cao Minh, Huyện Vĩnh Bảo, Thành phố Hải Phòng','Thành phố Hải Phòng'),(6,'Sad','Xã Nghĩa Đạo, Thị xã Thuận Thành, Tỉnh Bắc Ninh','Tỉnh Bắc Ninh'),(7,'asd','Xã Cao Phong, Huyện Sông Lô, Tỉnh Vĩnh Phúc','Tỉnh Vĩnh Phúc'),(8,'asd','Xã Cao Phong, Huyện Sông Lô, Tỉnh Vĩnh Phúc','Tỉnh Vĩnh Phúc'),(9,'asd','Xã Cao Phong, Huyện Sông Lô, Tỉnh Vĩnh Phúc','Tỉnh Vĩnh Phúc'),(10,'asd','Xã Cao Phong, Huyện Sông Lô, Tỉnh Vĩnh Phúc','Tỉnh Vĩnh Phúc'),(11,'asd','Xã Xuân Đám, Huyện Cát Hải, Thành phố Hải Phòng','Thành phố Hải Phòng'),(12,'asd','Xã Xuân Đám, Huyện Cát Hải, Thành phố Hải Phòng','Thành phố Hải Phòng'),(13,'asd','Xã Xuân Đám, Huyện Cát Hải, Thành phố Hải Phòng','Thành phố Hải Phòng'),(14,'asd','Xã Xuân Đám, Huyện Cát Hải, Thành phố Hải Phòng','Thành phố Hải Phòng'),(15,'asd','Xã Đại Bái, Huyện Gia Bình, Tỉnh Bắc Ninh','Tỉnh Bắc Ninh'),(16,'asd','Xã Đại Bái, Huyện Gia Bình, Tỉnh Bắc Ninh','Tỉnh Bắc Ninh'),(17,'asd','Xã Đại Bái, Huyện Gia Bình, Tỉnh Bắc Ninh','Tỉnh Bắc Ninh'),(18,'asd','Xã Kiến Phúc, Huyện Ninh Giang, Tỉnh Hải Dương','Tỉnh Hải Dương'),(19,'asds','Xã Kiến Phúc, Huyện Ninh Giang, Tỉnh Hải Dương','Tỉnh Hải Dương'),(20,'asd','Phường Hội Hợp, Thành phố Vĩnh Yên, Tỉnh Vĩnh Phúc','Tỉnh Vĩnh Phúc'),(21,'asd','Xã Đại Tự, Huyện Yên Lạc, Tỉnh Vĩnh Phúc','Tỉnh Vĩnh Phúc'),(22,'asd','Phường Hai Bà Trưng, Thành phố Phúc Yên, Tỉnh Vĩnh Phúc','Tỉnh Vĩnh Phúc'),(23,'Nhà tao','Xã Hồng Châu, Huyện Yên Lạc, Tỉnh Vĩnh Phúc','Tỉnh Vĩnh Phúc'),(24,'A','Xã Thanh Giang, Huyện Thanh Miện, Tỉnh Hải Dương','Tỉnh Hải Dương'),(25,'assd','Xã Văn Môn, Huyện Yên Phong, Tỉnh Bắc Ninh','Tỉnh Bắc Ninh'),(26,'Nhà Hát Mỹ','Xã Văn Khê, Huyện Mê Linh, Thành phố Hà Nội','Thành phố Hà Nội'),(27,'Mỹ','Xã Thanh Giang, Huyện Thanh Miện, Tỉnh Hải Dương','Tỉnh Hải Dương'),(28,'Nha thi dau hoa xuan','Phường Hải Châu, Quận Hải Châu, Thành phố Đà Nẵng','Thành phố Đà Nẵng'),(29,'asd','Xã Hồ Đắc Kiện, Huyện Châu Thành, Tỉnh Sóc Trăng','Tỉnh Sóc Trăng'),(30,'asd','Xã Xuân Đám, Huyện Cát Hải, Thành phố Hải Phòng','Thành phố Hải Phòng'),(31,'ok','Phường Phượng Sơn, Thị xã Chũ, Tỉnh Bắc Giang','Tỉnh Bắc Giang'),(32,'asd','Xã Ngũ Kiên, Huyện Vĩnh Tường, Tỉnh Vĩnh Phúc','Tỉnh Vĩnh Phúc'),(33,'haha','Xã Đại Bái, Huyện Gia Bình, Tỉnh Bắc Ninh','Tỉnh Bắc Ninh'),(34,'Nhà','Xã Tiền Phong, Huyện Vĩnh Bảo, Thành phố Hải Phòng','Thành phố Hải Phòng'),(35,'Nha','Xã Kiến Phúc, Huyện Ninh Giang, Tỉnh Hải Dương','Tỉnh Hải Dương'),(36,'asd','Xã Đông Cửu, Huyện Thanh Sơn, Tỉnh Phú Thọ','Tỉnh Phú Thọ'),(37,'Nhà Nhi nha','Xã Vân Hà, Thị xã Việt Yên, Tỉnh Bắc Giang','Tỉnh Bắc Giang'),(38,'asd','Xã Lâm Thao, Huyện Lương Tài, Tỉnh Bắc Ninh','Tỉnh Bắc Ninh'),(39,'áds','Xã Đại Bái, Huyện Gia Bình, Tỉnh Bắc Ninh','Tỉnh Bắc Ninh'),(40,'asd','Xã Đông Hưng, Huyện Tiên Lãng, Thành phố Hải Phòng','Thành phố Hải Phòng'),(41,'nhaf t','Phường Khắc Niệm, Thành phố Bắc Ninh, Tỉnh Bắc Ninh','Tỉnh Bắc Ninh'),(42,'asd','Xã Đức Long, Thị xã Quế Võ, Tỉnh Bắc Ninh','Tỉnh Bắc Ninh'),(43,'asd','Phường Tích Sơn, Thành phố Vĩnh Yên, Tỉnh Vĩnh Phúc','Tỉnh Vĩnh Phúc'),(44,'SSS','Phường Hạp Lĩnh, Thành phố Bắc Ninh, Tỉnh Bắc Ninh','Tỉnh Bắc Ninh'),(45,'asd','Xã Đại Bái, Huyện Gia Bình, Tỉnh Bắc Ninh','Tỉnh Bắc Ninh');
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
  `payment_method` enum('VNPAY','MOMO','PAYOS') DEFAULT NULL,
  `payment_status` enum('PENDING','CONFIRMED','REFUND') NOT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `showing_time_id` int DEFAULT NULL,
  `qr_token` varchar(255) DEFAULT NULL,
  `qr_publicId` varchar(255) DEFAULT NULL,
  `checkin_status` enum('CHECKED_IN','NOT_CHECKED_IN') DEFAULT 'NOT_CHECKED_IN',
  `checkin_time` datetime DEFAULT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `voucher_id` (`voucher_id`),
  KEY `showing_time_id` (`showing_time_id`),
  CONSTRAINT `tbl_booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`),
  CONSTRAINT `tbl_booking_ibfk_3` FOREIGN KEY (`voucher_id`) REFERENCES `tbl_voucher` (`voucher_id`),
  CONSTRAINT `tbl_booking_ibfk_4` FOREIGN KEY (`showing_time_id`) REFERENCES `tbl_showing_time` (`showing_time_id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_booking`
--

LOCK TABLES `tbl_booking` WRITE;
/*!40000 ALTER TABLE `tbl_booking` DISABLE KEYS */;
INSERT INTO `tbl_booking` VALUES (18,77,NULL,120000.00,NULL,120000.00,'VNPAY','CONFIRMED','2025-07-05 22:37:52','2025-07-05 22:30:48',6,'TK14f1b4e4-1c7b-41ef-b045-bf82793199dc','uploads/qrcodes/qrcodes/fb5f8fd5-c829-4cf8-a4bf-fce5769c738d',NULL,NULL),(19,77,NULL,120000.00,NULL,120000.00,'VNPAY','CONFIRMED','2025-07-05 22:51:26','2025-07-05 22:50:33',7,'TK688d8091-8b35-4429-963e-1c6c5058a665','uploads/qrcodes/qrcodes/18fa6d58-bd77-4a1a-9cfb-b7f7ff82c111',NULL,NULL),(21,77,NULL,30000.00,NULL,30000.00,'VNPAY','CONFIRMED','2025-07-14 15:39:20','2025-07-14 15:38:36',27,'TK93a73dd8-44c5-4dfc-b236-2af6a2cbaa9d','uploads/qrcodes/qrcodes/aff1ce65-9979-441c-9c3f-76aa182f01ef','NOT_CHECKED_IN',NULL),(24,77,NULL,2000.00,NULL,2000.00,'PAYOS','CONFIRMED','2025-07-14 15:49:58','2025-07-14 15:45:43',28,'TKfcb09e80-1de4-4966-96ac-c46c01b91101','uploads/qrcodes/qrcodes/adf621a9-f379-4aa8-8037-9b8e79365093','NOT_CHECKED_IN',NULL),(25,77,NULL,2000.00,NULL,2000.00,'PAYOS','CONFIRMED','2025-07-14 16:14:42','2025-07-14 16:14:02',28,'TKf9712ee3-4b51-48c4-b525-67ca7e822984','uploads/qrcodes/qrcodes/26b1ad4d-9201-4009-b514-68fe7570fa86','NOT_CHECKED_IN',NULL),(28,74,NULL,120000.00,NULL,120000.00,'VNPAY','CONFIRMED','2025-07-14 18:12:00','2025-07-14 18:11:39',28,'TK51dce112-4bb6-4d20-ac17-6c832d9e58ec','uploads/qrcodes/qrcodes/daa434c7-9302-405c-83f3-a6cf1e5129b2','NOT_CHECKED_IN',NULL),(39,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-14 22:47:35','2025-07-14 22:47:04',28,'TK8c458add-77c4-4c63-b713-c9906728cbd2','uploads/qrcodes/qrcodes/4ea97ef4-b3ae-44f4-8bbf-ea41bfbd7cb6','NOT_CHECKED_IN',NULL),(56,77,1,120000.00,10000.00,110000.00,'VNPAY','CONFIRMED','2025-07-15 14:32:49','2025-07-15 14:31:56',28,'TKf6b67326-b340-43cb-b483-d97abaa33636','uploads/qrcodes/qrcodes/b5314f24-a7ef-483c-af12-b90f3ab03071','NOT_CHECKED_IN',NULL),(57,77,1,120000.00,10000.00,110000.00,'VNPAY','CONFIRMED','2025-07-15 14:35:11','2025-07-15 14:34:42',28,'TK47848662-4aac-4226-b056-fef49efd7523','uploads/qrcodes/qrcodes/81691331-da1a-4c0f-a97d-36655af642e9','NOT_CHECKED_IN',NULL),(58,77,1,120000.00,10000.00,110000.00,'VNPAY','CONFIRMED','2025-07-15 15:00:04','2025-07-15 14:59:33',28,'TKe835d164-852b-48c9-a984-abe292273820','uploads/qrcodes/qrcodes/650d0ca8-d5f8-420d-a4ed-a2230ddf6d78','NOT_CHECKED_IN',NULL),(59,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 15:03:43','2025-07-15 15:03:00',28,'TKc61e8652-5111-43fc-8387-749d348facbd','uploads/qrcodes/qrcodes/550ed6f4-9e6e-4d02-853b-8595a33efaac','NOT_CHECKED_IN',NULL),(61,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 15:10:06','2025-07-15 15:09:11',28,'TK5cde2dab-43d4-484f-876b-c605cf3323f6','uploads/qrcodes/qrcodes/18c956d3-817b-4fed-b1f3-7ee06ba6c840','NOT_CHECKED_IN',NULL),(62,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 15:11:05','2025-07-15 15:10:35',28,'TKad290c25-34fb-4753-8705-b5ad177576bd','uploads/qrcodes/qrcodes/3dac5eaf-ff6a-4fed-b1f0-497fc6596934','NOT_CHECKED_IN',NULL),(63,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 15:13:36','2025-07-15 15:13:04',28,'TK93b2b208-c2d8-4238-81e9-2e27e9098bfc','uploads/qrcodes/qrcodes/780d8632-8876-46ed-afe4-8d91dcb8b55e','NOT_CHECKED_IN',NULL),(64,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 22:02:00','2025-07-15 22:01:08',30,'TK3a2dabc7-aeab-4f96-a666-b2e17b6a146b','uploads/qrcodes/qrcodes/0a3c8bb1-804e-4bd8-98d8-592b945cc70f','NOT_CHECKED_IN',NULL),(65,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 22:08:58','2025-07-15 22:08:33',30,'TK849c0c20-ac0f-4f80-9a05-5cbafdb3be51','uploads/qrcodes/qrcodes/067779fe-a5db-404c-a5e8-0a2acdf59297','NOT_CHECKED_IN',NULL),(66,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 22:10:12','2025-07-15 22:09:49',30,'TK650cc522-a87d-4aa1-8619-bcb7bd4513af','uploads/qrcodes/qrcodes/261056cb-9335-4407-ab25-fab58de2b25b','NOT_CHECKED_IN',NULL),(67,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 22:19:08','2025-07-15 22:18:19',30,'TK51486509-4f2a-4da0-92a6-52e051a2cce8','uploads/qrcodes/qrcodes/51dad46b-75ce-49b4-9164-35147a0cfb80','NOT_CHECKED_IN',NULL),(68,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 22:34:25','2025-07-15 22:34:04',30,'TKb4a2af0f-81c2-469c-a3c0-2835515393c5','uploads/qrcodes/qrcodes/b4545d5b-4059-4f61-8585-34840c48ca6c','NOT_CHECKED_IN',NULL),(69,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 22:39:46','2025-07-15 22:39:22',30,'TK396a0ab2-25b6-4c9f-89a9-dc90577b3399','uploads/qrcodes/qrcodes/bca65a89-30bc-423d-829d-96321b5822fa','NOT_CHECKED_IN',NULL),(70,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 22:41:55','2025-07-15 22:41:30',30,'TK3e6777dc-9eac-413e-b672-4cb828f50a13','uploads/qrcodes/qrcodes/b04dc03a-cb23-48b4-9587-0a7ec94dbb70','NOT_CHECKED_IN',NULL),(72,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 22:43:37','2025-07-15 22:43:08',30,'TK4c123da2-5460-4bc2-a928-4a513475a7c9','uploads/qrcodes/qrcodes/4d0a89ab-f286-41d3-ab83-cacffd50b1fa','NOT_CHECKED_IN',NULL),(73,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 22:53:52','2025-07-15 22:53:08',30,'TKb98b6894-068d-4ee0-97a6-d99b4b327fc5','uploads/qrcodes/qrcodes/6143075a-533e-4969-a870-24f945d4b1cf','NOT_CHECKED_IN',NULL),(74,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 23:03:34','2025-07-15 23:03:02',30,'TK1367bb9f-4fd4-4464-ae36-461ed6ecc7b0','uploads/qrcodes/qrcodes/ffec20ac-1b47-43e4-a339-86c713b3acc1','NOT_CHECKED_IN',NULL),(75,77,2,120000.00,20000.00,100000.00,'VNPAY','CONFIRMED','2025-07-15 23:09:16','2025-07-15 23:08:52',30,'TK32c9e6f8-46a7-4fe8-9359-021881b10184','uploads/qrcodes/qrcodes/7e9c8579-21ef-4c71-81f4-ddf9e171bb2f','NOT_CHECKED_IN',NULL),(76,77,NULL,120000.00,0.00,120000.00,'VNPAY','CONFIRMED','2025-07-15 23:15:44','2025-07-15 23:15:20',30,'TK32a02b89-e78c-4df5-8f56-49f9c96dc965','uploads/qrcodes/qrcodes/651eeea1-7413-4342-b1f9-b9e5bf79268f','NOT_CHECKED_IN',NULL),(82,77,3,60000.00,50000.00,10000.00,'PAYOS','CONFIRMED','2025-07-17 10:37:53','2025-07-17 10:37:22',34,'TK0a71ca02-0071-480d-873d-c304e7b3f03e','uploads/qrcodes/qrcodes/f562c6b4-9bdd-412f-a302-c9b094e4bf6f','CHECKED_IN','2025-07-17 03:39:20'),(83,77,11,80000.00,50000.00,30000.00,'PAYOS','CONFIRMED','2025-07-17 13:52:17','2025-07-17 13:51:32',37,'TK536e1510-5a33-49fb-966a-9f3bbbbbd79d','uploads/qrcodes/qrcodes/ebb04a42-5fee-4ffb-b252-0a4871e724be','CHECKED_IN','2025-07-17 06:54:29'),(84,74,NULL,80000.00,0.00,80000.00,'PAYOS','CONFIRMED','2025-07-17 14:03:13','2025-07-17 14:02:38',37,'TK60f55a6a-e12e-43b0-9740-9bb54b8f7a16','uploads/qrcodes/qrcodes/cb9a576a-5dbc-45e9-bfe9-bb19e663e01c','CHECKED_IN','2025-07-17 07:07:33'),(85,77,4,80000.00,30000.00,50000.00,'PAYOS','CONFIRMED','2025-07-24 16:31:05','2025-07-24 16:30:28',39,'TKa58d37f3-db97-456a-b553-ea2b81bc6451','uploads/qrcodes/qrcodes/a4dc03d1-81e1-4500-a696-45a9be5106a2','CHECKED_IN','2025-07-24 09:32:28');
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
  `status` enum('BOOKED','HOLD','CANCELLED','REFUNDED') DEFAULT NULL,
  PRIMARY KEY (`booking_seat_id`),
  KEY `booking_id` (`booking_id`),
  KEY `seat_id` (`seat_id`),
  KEY `zone_id` (`zone_id`),
  CONSTRAINT `tbl_booking_seat_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `tbl_booking` (`booking_id`),
  CONSTRAINT `tbl_booking_seat_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `tbl_seat` (`seat_id`),
  CONSTRAINT `tbl_booking_seat_ibfk_3` FOREIGN KEY (`zone_id`) REFERENCES `tbl_zone` (`zone_id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_booking_seat`
--

LOCK TABLES `tbl_booking_seat` WRITE;
/*!40000 ALTER TABLE `tbl_booking_seat` DISABLE KEYS */;
INSERT INTO `tbl_booking_seat` VALUES (21,18,81,NULL,1,120000.00,'BOOKED'),(22,19,90,NULL,1,120000.00,'BOOKED'),(24,21,NULL,11,1,30000.00,'BOOKED'),(27,24,168,NULL,1,2000.00,'BOOKED'),(28,25,169,NULL,1,2000.00,'BOOKED'),(31,28,159,NULL,1,120000.00,'BOOKED'),(42,39,160,NULL,1,120000.00,'BOOKED'),(59,56,162,NULL,1,120000.00,'BOOKED'),(60,57,156,NULL,1,120000.00,'BOOKED'),(61,58,157,NULL,1,120000.00,'BOOKED'),(62,59,155,NULL,1,120000.00,'BOOKED'),(64,61,158,NULL,1,120000.00,'BOOKED'),(65,62,163,NULL,1,120000.00,'BOOKED'),(66,63,161,NULL,1,120000.00,'BOOKED'),(67,64,194,NULL,1,120000.00,'BOOKED'),(68,65,193,NULL,1,120000.00,'BOOKED'),(69,66,200,NULL,1,120000.00,'BOOKED'),(70,67,201,NULL,1,120000.00,'BOOKED'),(71,68,209,NULL,1,120000.00,'BOOKED'),(72,69,211,NULL,1,120000.00,'BOOKED'),(73,70,195,NULL,1,120000.00,'BOOKED'),(75,72,206,NULL,1,120000.00,'BOOKED'),(76,73,210,NULL,1,120000.00,'BOOKED'),(77,74,208,NULL,1,120000.00,'BOOKED'),(78,75,207,NULL,1,120000.00,'BOOKED'),(79,76,202,NULL,1,120000.00,'BOOKED'),(85,82,265,NULL,1,60000.00,'BOOKED'),(86,83,NULL,14,1,80000.00,'BOOKED'),(87,84,NULL,14,1,80000.00,'BOOKED'),(88,85,NULL,17,1,80000.00,'BOOKED');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_category`
--

LOCK TABLES `tbl_category` WRITE;
/*!40000 ALTER TABLE `tbl_category` DISABLE KEYS */;
INSERT INTO `tbl_category` VALUES (4,'Khác'),(1,'Music Concert'),(3,'Phòng trà'),(2,'Thể thao điện tử ');
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
  `rejection_reason` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `organizer_id` (`organizer_id`),
  KEY `category_id` (`category_id`),
  KEY `fk_event_status` (`status_id`),
  CONSTRAINT `fk_event_status` FOREIGN KEY (`status_id`) REFERENCES `tbl_event_status` (`status_id`),
  CONSTRAINT `tbl_event_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `tbl_organizer` (`organizer_id`),
  CONSTRAINT `tbl_event_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `tbl_category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_event`
--

LOCK TABLES `tbl_event` WRITE;
/*!40000 ALTER TABLE `tbl_event` DISABLE KEYS */;
INSERT INTO `tbl_event` VALUES (1,1,1,'Thanh Duy Concert',3,'All ages','2025-06-28 11:41:00','2025-06-29 11:41:00','Anh trai vượt ngàn chông gai','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1750308076/uploads/zkoyorjvmgwsn1no1mqr.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1750308082/uploads/ezmawcqyeoxvha2tdrmy.jpg',NULL,'2025-07-14 08:34:53','system','system','abc'),(2,1,1,'Anh Trai Say Hi',2,'18+','2025-06-19 12:57:00','2025-06-28 12:57:00','Cos hieu thu 2','Anh trai si hi','https://res.cloudinary.com/dbpchaamx/image/upload/v1750312635/uploads/lnns3n1h2o9gwqngcjhc.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1750312656/uploads/hiksqaxfuyjt6h3l648o.jpg',NULL,NULL,'system','system',NULL),(3,1,3,'work shop',2,'18+','2025-06-19 13:09:00','2025-06-28 13:09:00','OK','áds','https://res.cloudinary.com/dbpchaamx/image/upload/v1750313386/uploads/cj3090hlugruwfrqo2l0.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1750313388/uploads/yyaowpl8we0gyr0ut3sf.jpg',NULL,NULL,'system','system',NULL),(4,1,1,'ABC',4,'All ages','2025-06-19 13:36:00','2025-06-21 13:36:00','Tri5c123','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1750314972/uploads/met3qinfvpwuwl5ceoeh.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1750314975/uploads/pyiw55jiulfxhkbspuzd.jpg',NULL,'2025-07-03 08:31:04','system','system',NULL),(5,1,1,'Hi em',2,'All ages','2025-06-19 23:16:00','2025-06-28 23:16:00','As','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1750349794/uploads/xr4s87pupsk8v2ojhenw.png','https://res.cloudinary.com/dbpchaamx/image/upload/v1750349794/uploads/wgzl72ujwvnal21k2xhi.jpg',NULL,NULL,'system','system',NULL),(6,1,3,'Gặp mặt tuyển thủ bóng rổ số 1 VN',4,'18+','2025-07-03 15:32:00','2025-07-18 15:32:00','vip pro','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1751531511/uploads/x8n2r6mrn7dfmsdyciwm.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1751531515/uploads/xhb6hytgnolkwjsrumsw.jpg',NULL,'2025-07-03 08:33:49','system','system',NULL),(7,1,1,'haha',1,'','2025-07-04 13:57:00','2025-07-18 13:58:00','sad','','https://res.cloudinary.com/dbpchaamx/image/upload/v1751612264/uploads/sfewnlk9ahwpogjesplc.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1751612272/uploads/e6fhakpiz5tczuleupf7.jpg',NULL,NULL,'system','system',NULL),(8,2,2,'Nhi già',1,'18+','2025-07-04 16:10:00','2025-07-18 16:11:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1751620183/uploads/hvmbji8yrenjczjnmjw2.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1751620185/uploads/d7yqnabyfsux87xewypc.jpg',NULL,'2025-07-09 10:41:08','system','system',NULL),(9,1,1,'sad',1,'All ages','2025-07-04 16:27:00','2025-07-12 16:27:00','asd','s','https://res.cloudinary.com/dbpchaamx/image/upload/v1751621251/uploads/nyr55seedugi9uznkopb.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1751621255/uploads/mjstxsbgdoxpjmgvdiv9.jpg',NULL,NULL,'system','system',NULL),(10,1,3,'asd',1,'18+','2025-07-04 16:34:00','2025-07-18 16:34:00','asd','','https://res.cloudinary.com/dbpchaamx/image/upload/v1751621641/uploads/s8fgig7pzpbocvobeowx.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1751621647/uploads/gzujgfyxsaumhbg5x2wt.jpg',NULL,NULL,'system','system',NULL),(11,1,1,'asd',1,'18+','2025-07-04 16:36:00','2025-07-17 16:36:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1751621761/uploads/ndlcavlzynqgeudyqavd.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1751621763/uploads/alrqhl9nvbzvehehbsj6.jpg',NULL,NULL,'system','system',NULL),(12,1,3,'má con nhi',1,'All ages','2025-07-25 16:53:00','2025-07-26 16:53:00','','','https://res.cloudinary.com/dbpchaamx/image/upload/v1751622775/uploads/lrbrjkt644adrzgzfmq1.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1751622778/uploads/k42h2hldxyjxhsluugkv.jpg',NULL,NULL,'system','system',NULL),(13,1,1,'haha test',1,'18+','2025-07-05 20:09:00','2025-07-24 20:09:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1751720945/uploads/rzs4qnjuiyusrsjgoqhs.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1751720948/uploads/zluibnuwlbgfajgvhyde.jpg',NULL,NULL,'system','system',NULL),(14,1,1,'Sự Kiện ',4,'18+','2025-07-06 12:06:00','2025-07-24 12:06:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1751778355/uploads/kff0cxjvmnre54trdzc9.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1751778357/uploads/baokuvtqxzgdeml5bgsd.jpg',NULL,'2025-07-06 05:07:39','system','system',NULL),(15,1,3,'Test Follow',4,'18+','2025-07-06 12:14:00','2025-07-08 12:14:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1751778869/uploads/yj0btletrfkgky214q8m.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1751778874/uploads/ndkwla7g1snl9v3o16nj.jpg',NULL,'2025-07-06 05:15:57','system','system',NULL),(16,1,3,'Test reminder',4,'18+','2025-07-06 12:22:00','2025-07-16 12:22:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1751779306/uploads/lurvwnckvokpiqrk0bb9.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1751779310/uploads/bapzadjkv3cl7fyocmg8.jpg',NULL,'2025-07-06 05:23:22','system','system',NULL),(17,1,3,'Má Ơi Út Dìa',4,'18+','2025-07-08 11:02:00','2025-07-24 11:02:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1751947317/uploads/lcbc0crp007uanhy8fy2.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1751947320/uploads/gcouq6yrjgtgfg30k1t6.jpg',NULL,'2025-07-08 04:12:57','system','system',NULL),(18,1,3,'Thanh Duy Live',4,'All ages','2025-07-08 11:13:00','2025-07-31 11:13:00','asd','','https://res.cloudinary.com/dbpchaamx/image/upload/v1751947996/uploads/drk809qjwmnnpmm1uq67.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1751948002/uploads/w59pj13akbwywxmuasrz.jpg',NULL,'2025-07-08 04:14:59','system','system',NULL),(19,1,4,'asd',4,'18+','2025-07-10 19:10:00','2025-07-17 19:10:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1752149409/uploads/mkpufc1huj34m5uelza3.png','https://res.cloudinary.com/dbpchaamx/image/upload/v1752149409/uploads/x8ygm1zkvcomu73mb2hr.png',NULL,'2025-07-10 12:11:29','system','system',NULL),(20,1,1,'Quang Hùng Minishow',4,'18+','2025-07-14 15:26:00','2025-07-25 15:26:00','Quang Hùng MasterD','Sự kiện hay','https://res.cloudinary.com/dbpchaamx/image/upload/v1752481574/uploads/bbslw4pxdeq9dwxqp6nq.webp','https://res.cloudinary.com/dbpchaamx/image/upload/v1752481578/uploads/poepvjjrlzbbtajdetbt.webp',NULL,'2025-07-14 08:34:45','system','system',NULL),(21,1,3,'Tuấn Ngọc x Khánh Hà LiveShow',4,'18+','2025-07-14 15:40:00','2025-07-23 15:40:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1752482401/uploads/am8njofev9jbw3xijqn4.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752482402/uploads/qeiottcviqgurdbwfapu.jpg',NULL,'2025-07-14 08:44:12','system','system',NULL),(22,1,2,'Da Nang X VBA Star',4,'18+','2025-07-15 21:57:00','2025-07-26 21:57:00','Good','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1752591433/uploads/gaduviuchpn93vituflh.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752591435/uploads/x8dbc1qwr6p2rn7up6tw.jpg',NULL,'2025-07-15 15:00:21','system','system',NULL),(23,1,1,'Phan Mạnh Quỳnh',1,'18+','2025-07-16 12:49:00','2025-07-24 12:49:00','Abc','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1752644952/uploads/vmaxcoppeg4to9vkxeic.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752644954/uploads/vcmtkapx7ueqbpbfpsas.jpg',NULL,NULL,'system','system',NULL),(24,1,1,'Phan Mạnh Quỳnh ',2,'21+','2025-07-16 13:54:00','2025-07-25 13:54:00','ASD','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1752648853/uploads/qfjiruwtntdjzntbxpmj.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752648855/uploads/xfie9az24ibrwyse73ry.jpg',NULL,NULL,'system','system',NULL),(25,1,1,'Phan Mạnh Quỳnh',2,'18+','2025-07-17 09:56:00','2025-07-19 09:56:00','OK','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1752720957/uploads/zs0vxe5b4zktj2eu3vzg.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752720960/uploads/ievrtzgufvdns6wjgvfe.jpg',NULL,NULL,'system','system',NULL),(26,1,3,'Phan Mạnh Quỳnh ',4,'All ages','2025-07-17 10:13:00','2025-07-24 10:13:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1752722019/uploads/n3rjmivkq5aefr4ma5qd.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752722020/uploads/pzsasxywrsaxrvjkgxjg.jpg',NULL,'2025-07-17 03:26:24','system','system',NULL),(27,1,3,'nhi',2,'18+','2025-07-17 13:17:00','2025-07-30 13:17:00','kl','54','https://res.cloudinary.com/dbpchaamx/image/upload/v1752733042/uploads/es1oqodfjfpukyxyucd1.webp','https://res.cloudinary.com/dbpchaamx/image/upload/v1752733044/uploads/saemmx3b1sx2uv3edpvd.webp',NULL,NULL,'system','system',NULL),(28,1,2,'VBA',2,'21+','2025-07-17 13:28:00','2025-07-19 13:28:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1752733686/uploads/n6tibjx5fdlxyzwpmxfk.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752733690/uploads/zcicdht2pisima285rcb.jpg',NULL,NULL,'system','system',NULL),(29,1,1,'ABC',4,'18+','2025-07-17 13:35:00','2025-07-21 13:35:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1752734094/uploads/cchtjeoka2lmogmxiczy.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752734096/uploads/rtfoaex731ocfqya4e0j.jpg',NULL,'2025-07-17 06:42:47','system','system',NULL),(30,1,1,'The Men Live Tour',4,'18+','2025-07-24 14:55:00','2025-07-31 14:55:00','Vip pro','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1753343723/uploads/hjofolndrqwnrmwqsttg.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1753343725/uploads/zymft3ncb2utlijjnvdo.jpg',NULL,'2025-07-24 07:58:00','system','system',NULL),(31,1,1,'Hi',4,'18+','2025-07-24 14:58:00','2025-07-26 14:58:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1753343900/uploads/sxljehgclmqzeonhwdbf.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1753343905/uploads/k9rlugstjentvqr93wmk.jpg',NULL,'2025-07-24 08:01:12','system','system',NULL),(32,1,4,'VBA',4,'21+','2025-07-24 15:04:00','2025-08-01 15:04:00','asd','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1753344239/uploads/gonxw1ishyj8hzspitd3.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1753344241/uploads/wmwv8gzejc8wkfqb6mkc.jpg',NULL,'2025-07-24 08:06:29','system','system',NULL),(33,1,2,'Tuấn Ngọc ',4,'All ages','2025-07-24 15:12:00','2025-07-26 15:12:00','asd','assd','https://res.cloudinary.com/dbpchaamx/image/upload/v1753344765/uploads/eptreobzzy2jmzzrlknu.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1753344768/uploads/g5lth0yfvbwv9vc3b6v6.jpg',NULL,'2025-07-24 08:14:11','system','system',NULL),(34,1,2,'VBA',4,'18+','2025-07-24 16:27:00','2025-07-27 16:27:00','VBA','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1753349233/uploads/yyyexjjqwetxv0pzhuqw.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1753349235/uploads/nhxvsdlv45yoxbn2gife.jpg',NULL,'2025-07-24 09:29:44','system','system',NULL),(35,1,1,'Ngoc Phuoc',4,'21+','2025-07-24 21:05:00','2025-07-29 21:05:00','asdd','assd','https://res.cloudinary.com/dbpchaamx/image/upload/v1753365954/uploads/uslctqtmjcpzosg66flc.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1753365955/uploads/uphigzl36bgv9o8kztjo.jpg',NULL,'2025-07-24 14:07:52','system','system',NULL),(36,1,3,'asd',4,'All ages','2025-07-24 22:17:00','2025-07-26 22:17:00','ád','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1753370260/uploads/pymee9ubhmsa6jte6cc2.webp','https://res.cloudinary.com/dbpchaamx/image/upload/v1753370262/uploads/psdfpvqmlcmfk8yztasz.webp',NULL,'2025-07-24 15:21:07','system','system',NULL),(37,1,1,'Phan Mạnh Quỳnh LiveShow',4,'All ages','2025-07-25 10:40:00','2025-08-01 10:40:00','asd','asdd','https://res.cloudinary.com/dbpchaamx/image/upload/v1753414840/uploads/yylfowdilrtvryhk45sc.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1753414840/uploads/efp8toqvdkbozvccywr8.jpg',NULL,'2025-07-25 03:43:00','system','system',NULL),(38,1,1,'asd',1,'18+','2025-07-25 10:49:00','2025-08-02 10:49:00','sadd','','https://res.cloudinary.com/dbpchaamx/image/upload/v1753415354/uploads/hvfsptgbbz8ghcinz63b.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1753415354/uploads/dlguikecls1iaxhaz9fh.jpg',NULL,NULL,'system','system',NULL),(39,1,1,'asd',1,'18+','2025-07-25 11:31:00','2025-07-29 11:31:00','sdd','','https://res.cloudinary.com/dbpchaamx/image/upload/v1753417898/uploads/q6rvpyjb7hnmhi4bqxnn.webp','https://res.cloudinary.com/dbpchaamx/image/upload/v1753417898/uploads/ryvam7eqmhxfscfdzp2e.webp',NULL,NULL,'system','system',NULL);
/*!40000 ALTER TABLE `tbl_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_event_ads`
--

DROP TABLE IF EXISTS `tbl_event_ads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_event_ads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `organizer_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `payment_gateway` enum('PAYOS','VNPAY') DEFAULT NULL,
  `payment_transaction_id` varchar(255) DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `rejection_reason` text,
  `refund_status` enum('NONE','REFUNDED','FAILED') DEFAULT 'NONE',
  `refund_at` datetime DEFAULT NULL,
  `banner_image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `organizer_id` (`organizer_id`),
  CONSTRAINT `tbl_event_ads_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`),
  CONSTRAINT `tbl_event_ads_ibfk_2` FOREIGN KEY (`organizer_id`) REFERENCES `tbl_organizer` (`organizer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_event_ads`
--

LOCK TABLES `tbl_event_ads` WRITE;
/*!40000 ALTER TABLE `tbl_event_ads` DISABLE KEYS */;
INSERT INTO `tbl_event_ads` VALUES (1,5,1,'2025-07-03','2025-07-12',20000.00,'VNPAY','15053807','APPROVED',NULL,'NONE',NULL,'','2025-07-03 15:27:31','2025-07-03 15:28:41'),(2,6,1,'2025-07-03','2025-07-11',18000.00,'VNPAY','15053835','APPROVED',NULL,'NONE',NULL,'','2025-07-03 15:35:46','2025-07-06 12:07:02'),(14,22,1,'2025-07-17','2025-07-24',16000.00,'VNPAY','15080022','APPROVED',NULL,'NONE',NULL,'','2025-07-17 09:33:02','2025-07-17 09:35:03'),(15,21,1,'2025-07-17','2025-07-24',16000.00,'VNPAY','15080029','APPROVED',NULL,'NONE',NULL,'','2025-07-17 09:38:25','2025-07-17 09:38:57'),(16,29,1,'2025-07-17','2025-07-20',8000.00,'VNPAY','13242134','APPROVED',NULL,'NONE',NULL,'','2025-07-17 13:55:39','2025-07-17 14:32:15'),(18,30,1,'2025-07-24','2025-07-28',10000.00,'PAYOS',NULL,'APPROVED',NULL,'NONE',NULL,'','2025-07-24 15:46:16','2025-07-24 15:46:59'),(19,34,1,'2025-07-24','2025-07-28',10000.00,NULL,NULL,'REJECTED','noo','NONE',NULL,'','2025-07-24 16:42:51','2025-07-25 15:45:22');
/*!40000 ALTER TABLE `tbl_event_ads` ENABLE KEYS */;
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
-- Table structure for table `tbl_event_reschedule_request`
--

DROP TABLE IF EXISTS `tbl_event_reschedule_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_event_reschedule_request` (
  `reschedule_request_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `showing_time_id` int NOT NULL,
  `old_start_time` datetime NOT NULL,
  `old_end_time` datetime NOT NULL,
  `requested_start_time` datetime NOT NULL,
  `requested_end_time` datetime NOT NULL,
  `requested_by_user_id` int NOT NULL,
  `approved_by_user_id` int DEFAULT NULL,
  `reason` text,
  `admin_note` text,
  `status_id` int NOT NULL,
  `requested_at` datetime NOT NULL,
  `responded_at` datetime DEFAULT NULL,
  PRIMARY KEY (`reschedule_request_id`),
  KEY `fk_event` (`event_id`),
  KEY `fk_showing_time_reschedule` (`showing_time_id`),
  KEY `fk_requested_by` (`requested_by_user_id`),
  KEY `fk_approved_by` (`approved_by_user_id`),
  KEY `fk_status` (`status_id`),
  CONSTRAINT `fk_approved_by` FOREIGN KEY (`approved_by_user_id`) REFERENCES `tbl_user` (`user_id`),
  CONSTRAINT `fk_event` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`),
  CONSTRAINT `fk_requested_by` FOREIGN KEY (`requested_by_user_id`) REFERENCES `tbl_user` (`user_id`),
  CONSTRAINT `fk_showing_time_reschedule` FOREIGN KEY (`showing_time_id`) REFERENCES `tbl_showing_time` (`showing_time_id`),
  CONSTRAINT `fk_status` FOREIGN KEY (`status_id`) REFERENCES `tbl_event_status` (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_event_reschedule_request`
--

LOCK TABLES `tbl_event_reschedule_request` WRITE;
/*!40000 ALTER TABLE `tbl_event_reschedule_request` DISABLE KEYS */;
INSERT INTO `tbl_event_reschedule_request` VALUES (1,15,21,'2025-07-18 12:14:00','2025-07-19 12:15:00','2025-07-24 17:22:00','2025-07-25 17:22:00',66,3,'thích là dời','không cho',3,'2025-07-16 17:22:31','2025-07-16 17:23:10'),(2,15,21,'2025-07-18 12:14:00','2025-07-19 12:15:00','2025-07-24 17:23:00','2025-07-25 17:24:00',66,3,'ok',NULL,4,'2025-07-16 17:24:08','2025-07-16 17:24:59'),(3,29,37,'2025-07-18 13:43:00','2025-07-19 13:35:00','2025-07-28 14:00:00','2025-07-29 14:00:00',66,3,'Mua',NULL,4,'2025-07-17 14:00:18','2025-07-17 14:00:41'),(4,29,37,'2025-07-28 14:00:00','2025-07-29 14:00:00','2025-07-31 14:03:00','2025-08-01 14:03:00',66,3,'mua',NULL,4,'2025-07-17 14:03:57','2025-07-17 14:04:17');
/*!40000 ALTER TABLE `tbl_event_reschedule_request` ENABLE KEYS */;
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
INSERT INTO `tbl_event_status` VALUES (4,'APPROVED'),(1,'DRAFT'),(2,'PENDING'),(3,'REJECTED');
/*!40000 ALTER TABLE `tbl_event_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_event_view`
--

DROP TABLE IF EXISTS `tbl_event_view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_event_view` (
  `event_view_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `viewed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_view_id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `tbl_event_view_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`),
  CONSTRAINT `tbl_event_view_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=824 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_event_view`
--

LOCK TABLES `tbl_event_view` WRITE;
/*!40000 ALTER TABLE `tbl_event_view` DISABLE KEYS */;
INSERT INTO `tbl_event_view` VALUES (1,77,19,'2025-07-12 16:05:24'),(2,77,19,'2025-07-12 16:05:24'),(3,77,17,'2025-07-13 22:13:54'),(4,77,17,'2025-07-13 22:13:54'),(5,77,17,'2025-07-13 22:13:55'),(6,77,17,'2025-07-13 22:13:55'),(7,77,19,'2025-07-13 22:13:57'),(8,77,19,'2025-07-13 22:13:57'),(9,77,19,'2025-07-13 22:13:57'),(10,77,19,'2025-07-13 22:13:57'),(11,77,19,'2025-07-13 22:14:32'),(12,77,19,'2025-07-13 22:14:32'),(13,77,19,'2025-07-13 22:14:32'),(14,77,19,'2025-07-13 22:14:32'),(15,77,17,'2025-07-13 22:17:00'),(16,77,17,'2025-07-13 22:17:00'),(17,77,17,'2025-07-13 22:17:00'),(18,77,17,'2025-07-13 22:17:00'),(19,74,19,'2025-07-13 22:31:45'),(20,74,19,'2025-07-13 22:31:45'),(21,74,19,'2025-07-13 22:31:45'),(22,74,19,'2025-07-13 22:31:45'),(23,74,17,'2025-07-13 22:55:22'),(24,74,17,'2025-07-13 22:55:22'),(25,74,17,'2025-07-13 22:55:22'),(26,74,17,'2025-07-13 22:55:22'),(27,77,20,'2025-07-14 15:35:53'),(28,77,20,'2025-07-14 15:35:53'),(29,77,20,'2025-07-14 15:35:53'),(30,77,20,'2025-07-14 15:35:53'),(31,77,20,'2025-07-14 15:36:13'),(32,77,20,'2025-07-14 15:36:13'),(33,77,20,'2025-07-14 15:36:14'),(34,77,20,'2025-07-14 15:36:14'),(35,77,20,'2025-07-14 15:36:33'),(36,77,20,'2025-07-14 15:36:33'),(37,77,20,'2025-07-14 15:38:22'),(38,77,20,'2025-07-14 15:38:22'),(39,77,20,'2025-07-14 15:38:22'),(40,77,20,'2025-07-14 15:38:22'),(41,77,21,'2025-07-14 15:44:34'),(42,77,21,'2025-07-14 15:44:34'),(43,77,21,'2025-07-14 15:44:34'),(44,77,21,'2025-07-14 15:44:34'),(45,77,21,'2025-07-14 15:50:58'),(46,77,21,'2025-07-14 15:50:58'),(47,77,21,'2025-07-14 15:50:58'),(48,77,21,'2025-07-14 15:50:58'),(49,77,21,'2025-07-14 16:15:00'),(50,77,21,'2025-07-14 16:15:00'),(51,77,21,'2025-07-14 16:15:01'),(52,77,21,'2025-07-14 16:15:01'),(53,74,20,'2025-07-14 18:10:50'),(54,74,20,'2025-07-14 18:10:50'),(55,74,20,'2025-07-14 18:10:50'),(56,74,20,'2025-07-14 18:10:50'),(57,74,20,'2025-07-14 18:10:54'),(58,74,20,'2025-07-14 18:10:54'),(59,74,21,'2025-07-14 18:10:58'),(60,74,21,'2025-07-14 18:10:58'),(61,74,21,'2025-07-14 18:10:58'),(62,74,21,'2025-07-14 18:10:59'),(63,77,17,'2025-07-14 21:24:03'),(64,77,17,'2025-07-14 21:24:03'),(65,77,17,'2025-07-14 21:24:03'),(66,77,17,'2025-07-14 21:24:04'),(67,77,16,'2025-07-14 21:24:31'),(68,77,16,'2025-07-14 21:24:31'),(69,77,16,'2025-07-14 21:24:32'),(70,77,16,'2025-07-14 21:24:32'),(71,77,20,'2025-07-14 21:24:38'),(72,77,20,'2025-07-14 21:24:38'),(73,77,20,'2025-07-14 21:24:38'),(74,77,20,'2025-07-14 21:24:38'),(75,77,20,'2025-07-14 21:25:42'),(76,77,20,'2025-07-14 21:25:42'),(77,77,20,'2025-07-14 21:25:42'),(78,77,20,'2025-07-14 21:25:42'),(79,77,20,'2025-07-14 22:11:10'),(80,77,20,'2025-07-14 22:11:10'),(81,77,20,'2025-07-14 22:11:12'),(82,77,20,'2025-07-14 22:11:12'),(83,77,20,'2025-07-14 22:14:33'),(84,77,20,'2025-07-14 22:14:33'),(85,77,20,'2025-07-14 22:14:33'),(86,77,20,'2025-07-14 22:14:33'),(87,77,20,'2025-07-14 22:14:54'),(88,77,20,'2025-07-14 22:14:54'),(89,77,21,'2025-07-14 22:14:57'),(90,77,21,'2025-07-14 22:14:57'),(91,77,21,'2025-07-14 22:14:57'),(92,77,21,'2025-07-14 22:14:57'),(93,77,21,'2025-07-14 22:21:29'),(94,77,21,'2025-07-14 22:21:29'),(95,77,21,'2025-07-14 22:21:29'),(96,77,21,'2025-07-14 22:21:29'),(97,77,21,'2025-07-14 22:21:34'),(98,77,21,'2025-07-14 22:21:34'),(99,77,21,'2025-07-14 22:45:35'),(100,77,21,'2025-07-14 22:45:35'),(101,77,20,'2025-07-15 12:38:40'),(102,77,20,'2025-07-15 12:38:40'),(103,77,20,'2025-07-15 12:38:41'),(104,77,20,'2025-07-15 12:38:41'),(105,77,20,'2025-07-15 12:39:05'),(106,77,20,'2025-07-15 12:39:05'),(107,77,21,'2025-07-15 12:39:07'),(108,77,21,'2025-07-15 12:39:07'),(109,77,21,'2025-07-15 12:39:08'),(110,77,21,'2025-07-15 12:39:08'),(111,77,21,'2025-07-15 12:42:20'),(112,77,21,'2025-07-15 12:42:20'),(113,77,21,'2025-07-15 12:42:20'),(114,77,21,'2025-07-15 12:42:21'),(115,77,21,'2025-07-15 12:45:09'),(116,77,21,'2025-07-15 12:45:09'),(117,77,20,'2025-07-15 12:45:12'),(118,77,20,'2025-07-15 12:45:12'),(119,77,20,'2025-07-15 12:45:12'),(120,77,20,'2025-07-15 12:45:12'),(121,77,20,'2025-07-15 12:45:22'),(122,77,20,'2025-07-15 12:45:22'),(123,77,20,'2025-07-15 12:55:20'),(124,77,20,'2025-07-15 12:55:20'),(125,77,21,'2025-07-15 12:55:24'),(126,77,21,'2025-07-15 12:55:24'),(127,77,21,'2025-07-15 12:55:24'),(128,77,21,'2025-07-15 12:55:24'),(129,77,21,'2025-07-15 13:52:09'),(130,77,21,'2025-07-15 13:52:09'),(131,77,21,'2025-07-15 13:52:09'),(132,77,21,'2025-07-15 13:52:09'),(133,77,21,'2025-07-15 14:31:29'),(134,77,21,'2025-07-15 14:31:30'),(135,77,21,'2025-07-15 14:31:30'),(136,77,21,'2025-07-15 14:31:30'),(137,77,21,'2025-07-15 14:31:48'),(138,77,21,'2025-07-15 14:31:49'),(139,77,21,'2025-07-15 14:31:49'),(140,77,21,'2025-07-15 14:31:49'),(141,77,21,'2025-07-15 14:33:36'),(142,77,21,'2025-07-15 14:33:37'),(143,77,21,'2025-07-15 14:33:37'),(144,77,21,'2025-07-15 14:33:37'),(145,77,4,'2025-07-15 14:49:24'),(146,77,4,'2025-07-15 14:49:24'),(147,77,6,'2025-07-15 14:49:34'),(148,77,6,'2025-07-15 14:49:34'),(149,77,21,'2025-07-15 14:59:23'),(150,77,21,'2025-07-15 14:59:23'),(151,77,21,'2025-07-15 14:59:23'),(152,77,21,'2025-07-15 14:59:23'),(153,77,21,'2025-07-15 15:02:53'),(154,77,21,'2025-07-15 15:02:53'),(155,77,21,'2025-07-15 15:02:53'),(156,77,21,'2025-07-15 15:02:53'),(157,77,17,'2025-07-15 15:05:22'),(158,77,17,'2025-07-15 15:05:23'),(159,77,17,'2025-07-15 15:05:25'),(160,77,17,'2025-07-15 15:05:26'),(161,77,21,'2025-07-15 15:06:00'),(162,77,21,'2025-07-15 15:06:00'),(163,77,21,'2025-07-15 15:06:07'),(164,77,21,'2025-07-15 15:06:08'),(165,77,21,'2025-07-15 15:09:07'),(166,77,21,'2025-07-15 15:09:07'),(167,77,21,'2025-07-15 15:09:07'),(168,77,21,'2025-07-15 15:09:07'),(169,77,21,'2025-07-15 15:10:32'),(170,77,21,'2025-07-15 15:10:32'),(171,77,21,'2025-07-15 15:10:32'),(172,77,21,'2025-07-15 15:10:32'),(173,77,17,'2025-07-15 15:12:43'),(174,77,17,'2025-07-15 15:12:43'),(175,77,17,'2025-07-15 15:12:43'),(176,77,17,'2025-07-15 15:12:43'),(177,77,17,'2025-07-15 15:12:46'),(178,77,17,'2025-07-15 15:12:46'),(179,77,19,'2025-07-15 15:12:48'),(180,77,19,'2025-07-15 15:12:48'),(181,77,19,'2025-07-15 15:12:48'),(182,77,19,'2025-07-15 15:12:48'),(183,77,19,'2025-07-15 15:12:51'),(184,77,19,'2025-07-15 15:12:51'),(185,77,20,'2025-07-15 15:12:53'),(186,77,20,'2025-07-15 15:12:53'),(187,77,20,'2025-07-15 15:12:53'),(188,77,20,'2025-07-15 15:12:53'),(189,77,20,'2025-07-15 15:12:57'),(190,77,20,'2025-07-15 15:12:57'),(191,77,21,'2025-07-15 15:12:59'),(192,77,21,'2025-07-15 15:12:59'),(193,77,21,'2025-07-15 15:13:00'),(194,77,21,'2025-07-15 15:13:00'),(195,77,20,'2025-07-15 21:56:18'),(196,77,20,'2025-07-15 21:56:18'),(197,77,20,'2025-07-15 21:56:18'),(198,77,20,'2025-07-15 21:56:18'),(199,77,4,'2025-07-15 21:56:32'),(200,77,4,'2025-07-15 21:56:32'),(201,77,22,'2025-07-15 22:00:59'),(202,77,22,'2025-07-15 22:00:59'),(203,77,22,'2025-07-15 22:00:59'),(204,77,22,'2025-07-15 22:00:59'),(205,77,22,'2025-07-15 22:08:29'),(206,77,22,'2025-07-15 22:08:29'),(207,77,22,'2025-07-15 22:08:29'),(208,77,22,'2025-07-15 22:08:29'),(209,77,22,'2025-07-15 22:09:45'),(210,77,22,'2025-07-15 22:09:45'),(211,77,22,'2025-07-15 22:09:46'),(212,77,22,'2025-07-15 22:09:46'),(213,77,22,'2025-07-15 22:18:10'),(214,77,22,'2025-07-15 22:18:10'),(215,77,22,'2025-07-15 22:18:10'),(216,77,22,'2025-07-15 22:18:10'),(217,77,22,'2025-07-15 22:34:00'),(218,77,22,'2025-07-15 22:34:00'),(219,77,22,'2025-07-15 22:34:01'),(220,77,22,'2025-07-15 22:34:01'),(221,77,22,'2025-07-15 22:39:16'),(222,77,22,'2025-07-15 22:39:16'),(223,77,22,'2025-07-15 22:39:17'),(224,77,22,'2025-07-15 22:39:17'),(225,77,22,'2025-07-15 22:41:27'),(226,77,22,'2025-07-15 22:41:27'),(227,77,22,'2025-07-15 22:41:27'),(228,77,22,'2025-07-15 22:41:27'),(229,77,22,'2025-07-15 22:42:49'),(230,77,22,'2025-07-15 22:42:49'),(231,77,22,'2025-07-15 22:42:49'),(232,77,22,'2025-07-15 22:42:49'),(233,77,22,'2025-07-15 22:43:03'),(234,77,22,'2025-07-15 22:43:03'),(235,77,22,'2025-07-15 22:43:03'),(236,77,22,'2025-07-15 22:43:03'),(237,77,22,'2025-07-15 22:53:03'),(238,77,22,'2025-07-15 22:53:03'),(239,77,22,'2025-07-15 22:53:03'),(240,77,22,'2025-07-15 22:53:03'),(241,77,22,'2025-07-15 23:02:53'),(242,77,22,'2025-07-15 23:02:53'),(243,77,22,'2025-07-15 23:02:53'),(244,77,22,'2025-07-15 23:02:53'),(245,77,22,'2025-07-15 23:08:42'),(246,77,22,'2025-07-15 23:08:42'),(247,77,22,'2025-07-15 23:08:43'),(248,77,22,'2025-07-15 23:08:43'),(249,77,22,'2025-07-15 23:15:13'),(250,77,22,'2025-07-15 23:15:14'),(251,77,22,'2025-07-15 23:15:14'),(252,77,22,'2025-07-15 23:15:14'),(253,77,22,'2025-07-16 14:16:03'),(254,77,22,'2025-07-16 14:16:03'),(255,77,22,'2025-07-16 14:16:03'),(256,77,22,'2025-07-16 14:16:03'),(257,66,23,'2025-07-16 16:14:47'),(258,66,23,'2025-07-16 16:14:47'),(259,77,4,'2025-07-16 16:50:09'),(260,77,4,'2025-07-16 16:50:09'),(261,77,22,'2025-07-16 16:50:30'),(262,77,22,'2025-07-16 16:50:30'),(263,77,22,'2025-07-16 16:50:30'),(264,77,22,'2025-07-16 16:50:30'),(265,77,21,'2025-07-16 16:50:56'),(266,77,21,'2025-07-16 16:50:56'),(267,77,21,'2025-07-16 17:19:30'),(268,77,21,'2025-07-16 17:19:31'),(269,66,21,'2025-07-16 17:20:30'),(270,66,21,'2025-07-16 17:20:30'),(271,77,15,'2025-07-16 17:24:41'),(272,77,15,'2025-07-16 17:24:41'),(273,77,15,'2025-07-16 17:24:41'),(274,77,15,'2025-07-16 17:24:41'),(275,77,15,'2025-07-16 17:25:07'),(276,77,15,'2025-07-16 17:25:07'),(277,77,22,'2025-07-16 17:32:12'),(278,77,22,'2025-07-16 17:32:12'),(279,77,22,'2025-07-16 17:32:13'),(280,77,22,'2025-07-16 17:32:13'),(281,77,21,'2025-07-16 21:31:50'),(282,77,21,'2025-07-16 21:31:50'),(283,77,21,'2025-07-16 21:31:50'),(284,77,21,'2025-07-16 21:31:50'),(285,77,21,'2025-07-16 21:32:00'),(286,77,21,'2025-07-16 21:32:01'),(287,77,21,'2025-07-16 21:32:01'),(288,77,21,'2025-07-16 21:32:01'),(289,77,21,'2025-07-16 21:32:05'),(290,77,21,'2025-07-16 21:32:05'),(291,77,21,'2025-07-16 21:32:05'),(292,77,21,'2025-07-16 21:32:05'),(293,77,4,'2025-07-16 21:32:10'),(294,77,4,'2025-07-16 21:32:10'),(295,77,4,'2025-07-16 21:32:16'),(296,77,4,'2025-07-16 21:32:16'),(297,77,4,'2025-07-16 21:32:17'),(298,77,4,'2025-07-16 21:32:17'),(299,77,20,'2025-07-16 21:32:38'),(300,77,20,'2025-07-16 21:32:38'),(301,77,20,'2025-07-16 21:32:38'),(302,77,20,'2025-07-16 21:32:38'),(303,77,19,'2025-07-16 21:33:32'),(304,77,19,'2025-07-16 21:33:32'),(305,77,19,'2025-07-16 21:33:32'),(306,77,19,'2025-07-16 21:33:32'),(307,77,19,'2025-07-16 21:38:53'),(308,77,19,'2025-07-16 21:38:53'),(309,77,19,'2025-07-16 21:38:54'),(310,77,19,'2025-07-16 21:38:54'),(311,77,19,'2025-07-16 21:39:02'),(312,77,19,'2025-07-16 21:39:02'),(313,77,20,'2025-07-16 21:39:07'),(314,77,20,'2025-07-16 21:39:07'),(315,77,20,'2025-07-16 21:39:07'),(316,77,20,'2025-07-16 21:39:07'),(317,77,20,'2025-07-16 21:39:16'),(318,77,20,'2025-07-16 21:39:16'),(319,77,22,'2025-07-16 21:39:18'),(320,77,22,'2025-07-16 21:39:19'),(321,77,22,'2025-07-16 21:39:19'),(322,77,22,'2025-07-16 21:39:19'),(323,77,19,'2025-07-16 22:11:18'),(324,77,19,'2025-07-16 22:11:18'),(325,77,19,'2025-07-16 22:11:18'),(326,77,19,'2025-07-16 22:11:18'),(327,77,20,'2025-07-16 22:11:21'),(328,77,20,'2025-07-16 22:11:21'),(329,77,20,'2025-07-16 22:11:22'),(330,77,20,'2025-07-16 22:11:22'),(331,77,20,'2025-07-16 22:11:57'),(332,77,20,'2025-07-16 22:19:43'),(333,77,20,'2025-07-16 22:19:43'),(334,77,20,'2025-07-16 22:24:39'),(335,77,20,'2025-07-16 22:24:43'),(336,77,20,'2025-07-16 22:29:19'),(337,77,20,'2025-07-16 22:30:09'),(338,77,20,'2025-07-16 22:33:47'),(339,77,20,'2025-07-16 22:33:55'),(340,77,20,'2025-07-16 22:33:55'),(341,77,20,'2025-07-16 22:34:12'),(342,77,20,'2025-07-16 22:34:12'),(343,77,20,'2025-07-16 22:37:34'),(344,77,20,'2025-07-16 22:37:37'),(345,77,20,'2025-07-16 22:37:37'),(346,77,20,'2025-07-16 22:37:44'),(347,77,20,'2025-07-16 22:40:43'),(348,77,20,'2025-07-16 22:42:25'),(349,77,20,'2025-07-16 22:44:02'),(350,77,20,'2025-07-16 22:44:02'),(351,77,20,'2025-07-16 22:44:16'),(352,77,20,'2025-07-16 22:44:16'),(353,77,20,'2025-07-16 22:46:36'),(354,77,20,'2025-07-16 22:46:36'),(355,77,20,'2025-07-16 22:46:37'),(356,77,20,'2025-07-16 22:46:37'),(357,77,20,'2025-07-16 22:46:41'),(358,77,20,'2025-07-16 22:47:16'),(359,77,20,'2025-07-16 22:47:34'),(360,77,20,'2025-07-16 22:49:16'),(361,77,20,'2025-07-16 22:49:16'),(362,77,20,'2025-07-16 22:49:20'),(363,77,20,'2025-07-16 22:50:35'),(364,77,20,'2025-07-16 22:50:35'),(365,77,20,'2025-07-16 22:52:51'),(366,77,20,'2025-07-16 22:56:27'),(367,77,20,'2025-07-16 23:01:27'),(368,77,20,'2025-07-16 23:05:32'),(369,77,20,'2025-07-16 23:05:42'),(370,77,22,'2025-07-16 23:07:17'),(371,77,22,'2025-07-16 23:07:17'),(372,77,22,'2025-07-16 23:07:18'),(373,77,22,'2025-07-16 23:07:18'),(374,77,22,'2025-07-16 23:08:41'),(375,77,22,'2025-07-16 23:08:41'),(376,77,22,'2025-07-16 23:10:04'),(377,77,22,'2025-07-16 23:10:37'),(378,77,22,'2025-07-16 23:10:41'),(379,77,22,'2025-07-16 23:10:41'),(380,77,20,'2025-07-16 23:10:50'),(381,77,20,'2025-07-16 23:10:50'),(382,77,20,'2025-07-16 23:10:51'),(383,77,20,'2025-07-16 23:10:51'),(384,77,19,'2025-07-16 23:10:56'),(385,77,19,'2025-07-16 23:10:56'),(386,77,19,'2025-07-16 23:10:56'),(387,77,19,'2025-07-16 23:10:56'),(388,77,20,'2025-07-16 23:11:28'),(389,77,20,'2025-07-16 23:11:28'),(390,77,20,'2025-07-16 23:11:29'),(391,77,20,'2025-07-16 23:11:29'),(392,77,20,'2025-07-16 23:13:42'),(393,77,20,'2025-07-16 23:13:42'),(394,77,22,'2025-07-16 23:14:08'),(395,77,22,'2025-07-16 23:14:08'),(396,77,22,'2025-07-16 23:14:08'),(397,77,22,'2025-07-16 23:14:08'),(398,77,19,'2025-07-16 23:14:19'),(399,77,19,'2025-07-16 23:14:19'),(400,77,19,'2025-07-16 23:14:19'),(401,77,19,'2025-07-16 23:14:19'),(402,77,21,'2025-07-16 23:14:22'),(403,77,21,'2025-07-16 23:14:22'),(404,77,21,'2025-07-16 23:14:22'),(405,77,21,'2025-07-16 23:14:22'),(406,77,21,'2025-07-16 23:14:33'),(407,77,21,'2025-07-16 23:14:33'),(408,77,21,'2025-07-16 23:14:33'),(409,77,21,'2025-07-16 23:14:34'),(410,77,21,'2025-07-16 23:14:37'),(411,77,21,'2025-07-16 23:14:37'),(412,77,21,'2025-07-16 23:14:37'),(413,77,21,'2025-07-16 23:14:37'),(414,77,22,'2025-07-16 23:14:59'),(415,77,22,'2025-07-16 23:14:59'),(416,77,22,'2025-07-16 23:15:00'),(417,77,22,'2025-07-16 23:15:00'),(418,77,22,'2025-07-17 09:43:26'),(419,77,22,'2025-07-17 09:43:26'),(420,77,22,'2025-07-17 09:43:27'),(421,77,22,'2025-07-17 09:43:27'),(422,65,6,'2025-07-17 09:45:36'),(423,65,6,'2025-07-17 09:45:36'),(424,65,21,'2025-07-17 09:45:40'),(425,65,21,'2025-07-17 09:45:40'),(426,65,4,'2025-07-17 09:45:45'),(427,65,4,'2025-07-17 09:45:45'),(428,65,6,'2025-07-17 09:45:54'),(429,65,6,'2025-07-17 09:45:54'),(430,65,21,'2025-07-17 09:46:02'),(431,65,21,'2025-07-17 09:46:03'),(432,65,21,'2025-07-17 09:46:36'),(433,65,21,'2025-07-17 09:46:36'),(434,65,6,'2025-07-17 09:46:39'),(435,65,6,'2025-07-17 09:46:39'),(436,65,4,'2025-07-17 09:46:41'),(437,65,4,'2025-07-17 09:46:41'),(438,78,21,'2025-07-17 09:48:25'),(439,78,21,'2025-07-17 09:48:25'),(440,77,21,'2025-07-17 09:48:45'),(441,77,21,'2025-07-17 09:48:45'),(442,77,21,'2025-07-17 09:49:03'),(443,77,21,'2025-07-17 09:49:03'),(444,77,21,'2025-07-17 09:49:04'),(445,77,21,'2025-07-17 09:49:04'),(446,77,21,'2025-07-17 09:50:22'),(447,77,21,'2025-07-17 09:50:23'),(448,66,25,'2025-07-17 10:01:45'),(449,66,25,'2025-07-17 10:01:45'),(450,77,26,'2025-07-17 10:26:51'),(451,77,26,'2025-07-17 10:26:51'),(452,77,26,'2025-07-17 10:26:51'),(453,77,26,'2025-07-17 10:26:51'),(454,77,26,'2025-07-17 10:33:49'),(455,77,26,'2025-07-17 10:33:49'),(456,77,26,'2025-07-17 10:33:49'),(457,77,26,'2025-07-17 10:33:49'),(458,77,26,'2025-07-17 10:34:40'),(459,77,26,'2025-07-17 10:34:40'),(460,77,26,'2025-07-17 10:34:40'),(461,77,26,'2025-07-17 10:34:40'),(462,77,20,'2025-07-17 11:03:59'),(463,77,20,'2025-07-17 11:04:00'),(464,77,20,'2025-07-17 11:04:00'),(465,77,20,'2025-07-17 11:04:00'),(466,77,20,'2025-07-17 11:04:08'),(467,77,20,'2025-07-17 11:04:09'),(468,77,20,'2025-07-17 11:04:41'),(469,77,20,'2025-07-17 11:04:41'),(470,77,20,'2025-07-17 11:04:42'),(471,77,20,'2025-07-17 11:04:42'),(472,77,20,'2025-07-17 11:04:44'),(473,77,20,'2025-07-17 11:04:44'),(474,77,21,'2025-07-17 12:43:54'),(475,77,21,'2025-07-17 12:43:54'),(476,77,21,'2025-07-17 12:44:03'),(477,77,21,'2025-07-17 12:44:03'),(478,77,21,'2025-07-17 12:44:03'),(479,77,21,'2025-07-17 12:44:03'),(480,77,6,'2025-07-17 12:44:07'),(481,77,6,'2025-07-17 12:44:07'),(482,77,6,'2025-07-17 12:44:12'),(483,77,6,'2025-07-17 12:44:12'),(484,77,6,'2025-07-17 12:44:12'),(485,77,6,'2025-07-17 12:44:12'),(486,77,21,'2025-07-17 12:44:27'),(487,77,21,'2025-07-17 12:44:27'),(488,77,21,'2025-07-17 12:44:27'),(489,77,21,'2025-07-17 12:44:27'),(490,77,21,'2025-07-17 12:45:45'),(491,77,21,'2025-07-17 12:46:06'),(492,77,21,'2025-07-17 12:46:29'),(493,77,21,'2025-07-17 12:47:07'),(494,77,21,'2025-07-17 12:47:09'),(495,77,21,'2025-07-17 12:47:25'),(496,77,21,'2025-07-17 12:47:40'),(497,77,21,'2025-07-17 12:48:09'),(498,77,21,'2025-07-17 12:50:40'),(499,77,21,'2025-07-17 12:50:54'),(500,77,21,'2025-07-17 12:51:18'),(501,77,21,'2025-07-17 12:51:32'),(502,77,21,'2025-07-17 12:51:32'),(503,77,21,'2025-07-17 12:51:32'),(504,77,21,'2025-07-17 12:51:32'),(505,77,19,'2025-07-17 12:52:24'),(506,77,19,'2025-07-17 12:52:24'),(507,77,19,'2025-07-17 12:52:24'),(508,77,19,'2025-07-17 12:52:24'),(509,77,19,'2025-07-17 13:04:36'),(510,77,19,'2025-07-17 13:04:36'),(511,77,19,'2025-07-17 13:04:37'),(512,77,19,'2025-07-17 13:04:37'),(513,77,19,'2025-07-17 13:04:40'),(514,77,19,'2025-07-17 13:04:41'),(515,77,26,'2025-07-17 13:11:33'),(516,77,26,'2025-07-17 13:11:33'),(517,77,26,'2025-07-17 13:11:33'),(518,77,26,'2025-07-17 13:11:33'),(519,77,26,'2025-07-17 13:11:56'),(520,66,7,'2025-07-17 13:14:04'),(521,66,7,'2025-07-17 13:14:04'),(522,66,7,'2025-07-17 13:14:37'),(523,66,7,'2025-07-17 13:14:37'),(524,66,25,'2025-07-17 13:14:44'),(525,66,25,'2025-07-17 13:14:44'),(526,77,29,'2025-07-17 13:43:04'),(527,77,29,'2025-07-17 13:43:04'),(528,77,29,'2025-07-17 13:43:05'),(529,77,29,'2025-07-17 13:43:05'),(530,77,29,'2025-07-17 13:43:18'),(531,77,29,'2025-07-17 13:43:19'),(532,77,21,'2025-07-17 13:58:17'),(533,77,21,'2025-07-17 13:58:17'),(534,77,21,'2025-07-17 13:58:17'),(535,77,21,'2025-07-17 13:58:17'),(536,74,29,'2025-07-17 14:02:26'),(537,74,29,'2025-07-17 14:02:26'),(538,74,29,'2025-07-17 14:02:26'),(539,74,29,'2025-07-17 14:02:26'),(540,74,28,'2025-07-17 14:20:54'),(541,74,28,'2025-07-17 14:20:54'),(542,66,10,'2025-07-24 15:02:14'),(543,66,10,'2025-07-24 15:02:14'),(544,66,7,'2025-07-24 15:03:11'),(545,66,7,'2025-07-24 15:03:11'),(546,77,22,'2025-07-24 15:06:50'),(547,77,22,'2025-07-24 15:06:50'),(548,77,22,'2025-07-24 15:06:51'),(549,77,22,'2025-07-24 15:06:51'),(550,77,18,'2025-07-24 15:07:13'),(551,77,18,'2025-07-24 15:07:13'),(552,77,18,'2025-07-24 15:07:13'),(553,77,18,'2025-07-24 15:07:13'),(554,77,20,'2025-07-24 15:07:19'),(555,77,20,'2025-07-24 15:07:19'),(556,77,20,'2025-07-24 15:07:19'),(557,77,20,'2025-07-24 15:07:19'),(558,77,20,'2025-07-24 15:07:24'),(559,77,20,'2025-07-24 15:07:24'),(560,77,29,'2025-07-24 15:07:31'),(561,77,29,'2025-07-24 15:07:31'),(562,77,29,'2025-07-24 15:07:31'),(563,77,29,'2025-07-24 15:07:31'),(564,77,21,'2025-07-24 15:07:35'),(565,77,21,'2025-07-24 15:07:35'),(566,77,21,'2025-07-24 15:07:40'),(567,77,21,'2025-07-24 15:07:40'),(568,77,21,'2025-07-24 15:07:40'),(569,77,21,'2025-07-24 15:07:41'),(570,66,25,'2025-07-24 15:10:05'),(571,66,25,'2025-07-24 15:10:05'),(572,66,25,'2025-07-24 15:11:06'),(573,66,25,'2025-07-24 15:11:06'),(574,66,25,'2025-07-24 15:11:41'),(575,66,25,'2025-07-24 15:11:41'),(576,77,22,'2025-07-24 15:34:38'),(577,77,22,'2025-07-24 15:34:38'),(578,77,22,'2025-07-24 15:34:38'),(579,77,22,'2025-07-24 15:34:38'),(580,77,34,'2025-07-24 16:30:09'),(581,77,34,'2025-07-24 16:30:10'),(582,77,34,'2025-07-24 16:30:10'),(583,77,34,'2025-07-24 16:30:10'),(584,77,31,'2025-07-24 16:30:19'),(585,77,31,'2025-07-24 16:30:19'),(586,77,31,'2025-07-24 16:30:20'),(587,77,31,'2025-07-24 16:30:20'),(588,77,21,'2025-07-24 16:33:03'),(589,77,21,'2025-07-24 16:33:03'),(590,66,25,'2025-07-24 16:36:42'),(591,66,25,'2025-07-24 16:36:42'),(592,66,25,'2025-07-24 16:36:56'),(593,66,25,'2025-07-24 16:36:56'),(594,66,25,'2025-07-24 16:37:05'),(595,66,25,'2025-07-24 16:37:05'),(596,66,23,'2025-07-24 16:38:44'),(597,66,23,'2025-07-24 16:38:44'),(598,77,32,'2025-07-24 16:51:19'),(599,77,32,'2025-07-24 16:51:19'),(600,77,32,'2025-07-24 16:51:19'),(601,77,32,'2025-07-24 16:51:19'),(602,77,32,'2025-07-24 16:51:38'),(603,77,32,'2025-07-24 16:51:38'),(604,77,31,'2025-07-24 16:55:03'),(605,77,31,'2025-07-24 16:55:03'),(606,77,31,'2025-07-24 16:55:03'),(607,77,31,'2025-07-24 16:55:03'),(608,77,33,'2025-07-24 21:09:57'),(609,77,33,'2025-07-24 21:09:57'),(610,77,33,'2025-07-24 21:09:57'),(611,77,33,'2025-07-24 21:09:57'),(612,77,22,'2025-07-24 22:12:11'),(613,77,22,'2025-07-24 22:12:11'),(614,77,22,'2025-07-24 22:12:11'),(615,77,22,'2025-07-24 22:12:11'),(616,77,31,'2025-07-24 22:28:10'),(617,77,31,'2025-07-24 22:28:10'),(618,77,31,'2025-07-24 22:28:10'),(619,77,31,'2025-07-24 22:28:10'),(620,77,36,'2025-07-24 22:28:28'),(621,77,36,'2025-07-24 22:28:28'),(622,77,36,'2025-07-24 22:28:28'),(623,77,36,'2025-07-24 22:28:28'),(624,77,30,'2025-07-24 22:28:31'),(625,77,30,'2025-07-24 22:28:31'),(626,77,30,'2025-07-24 22:28:31'),(627,77,30,'2025-07-24 22:28:31'),(628,77,21,'2025-07-24 22:53:02'),(629,77,21,'2025-07-24 22:53:03'),(630,77,21,'2025-07-24 22:53:03'),(631,77,21,'2025-07-24 22:53:03'),(632,77,32,'2025-07-24 22:54:43'),(633,77,32,'2025-07-24 22:54:43'),(634,77,32,'2025-07-24 22:54:43'),(635,77,32,'2025-07-24 22:54:43'),(636,77,32,'2025-07-24 22:56:31'),(637,77,32,'2025-07-24 22:56:34'),(638,77,31,'2025-07-24 22:57:00'),(639,77,31,'2025-07-24 22:57:01'),(640,77,31,'2025-07-24 22:57:01'),(641,77,31,'2025-07-24 22:57:01'),(642,77,31,'2025-07-24 22:58:49'),(643,77,31,'2025-07-24 22:58:49'),(644,77,31,'2025-07-24 22:58:54'),(645,77,31,'2025-07-24 22:58:54'),(646,77,31,'2025-07-24 22:58:54'),(647,77,31,'2025-07-24 22:58:54'),(648,77,30,'2025-07-24 22:58:56'),(649,77,30,'2025-07-24 22:58:56'),(650,77,30,'2025-07-24 22:58:56'),(651,77,30,'2025-07-24 22:58:56'),(652,77,33,'2025-07-24 22:59:09'),(653,77,33,'2025-07-24 22:59:09'),(654,77,33,'2025-07-24 22:59:10'),(655,77,33,'2025-07-24 22:59:10'),(656,77,31,'2025-07-24 22:59:23'),(657,77,31,'2025-07-24 22:59:23'),(658,77,31,'2025-07-24 22:59:24'),(659,77,31,'2025-07-24 22:59:24'),(660,77,31,'2025-07-24 23:00:47'),(661,77,31,'2025-07-24 23:00:47'),(662,77,30,'2025-07-24 23:00:51'),(663,77,30,'2025-07-24 23:00:51'),(664,77,30,'2025-07-24 23:00:52'),(665,77,30,'2025-07-24 23:00:52'),(666,77,32,'2025-07-24 23:00:59'),(667,77,32,'2025-07-24 23:00:59'),(668,77,32,'2025-07-24 23:01:00'),(669,77,32,'2025-07-24 23:01:00'),(670,77,33,'2025-07-24 23:01:53'),(671,77,33,'2025-07-24 23:01:53'),(672,77,33,'2025-07-24 23:01:53'),(673,77,33,'2025-07-24 23:01:53'),(674,77,33,'2025-07-24 23:01:57'),(675,77,33,'2025-07-24 23:01:57'),(676,77,30,'2025-07-24 23:02:06'),(677,77,30,'2025-07-24 23:02:06'),(678,77,30,'2025-07-24 23:02:06'),(679,77,30,'2025-07-24 23:02:06'),(680,77,30,'2025-07-24 23:23:54'),(681,77,30,'2025-07-24 23:23:54'),(682,77,30,'2025-07-24 23:27:31'),(683,77,30,'2025-07-24 23:27:31'),(684,77,31,'2025-07-25 10:23:38'),(685,77,31,'2025-07-25 10:23:38'),(686,77,31,'2025-07-25 10:23:39'),(687,77,31,'2025-07-25 10:23:39'),(688,77,30,'2025-07-25 10:31:35'),(689,77,30,'2025-07-25 10:31:35'),(690,77,30,'2025-07-25 10:31:35'),(691,77,30,'2025-07-25 10:31:35'),(692,77,30,'2025-07-25 10:31:43'),(693,77,30,'2025-07-25 10:31:43'),(694,77,31,'2025-07-25 10:43:27'),(695,77,31,'2025-07-25 10:43:27'),(696,77,31,'2025-07-25 10:43:27'),(697,77,31,'2025-07-25 10:43:27'),(698,77,37,'2025-07-25 10:43:31'),(699,77,37,'2025-07-25 10:43:31'),(700,77,37,'2025-07-25 10:43:31'),(701,77,37,'2025-07-25 10:43:31'),(702,77,37,'2025-07-25 10:45:12'),(703,77,37,'2025-07-25 10:45:12'),(704,77,36,'2025-07-25 10:45:16'),(705,77,36,'2025-07-25 10:45:16'),(706,77,36,'2025-07-25 10:45:16'),(707,77,36,'2025-07-25 10:45:17'),(708,77,33,'2025-07-25 10:45:22'),(709,77,33,'2025-07-25 10:45:22'),(710,77,33,'2025-07-25 10:45:22'),(711,77,33,'2025-07-25 10:45:22'),(712,77,33,'2025-07-25 10:45:26'),(713,77,33,'2025-07-25 10:45:26'),(714,77,32,'2025-07-25 10:47:38'),(715,77,32,'2025-07-25 10:47:38'),(716,77,32,'2025-07-25 10:47:39'),(717,77,32,'2025-07-25 10:47:39'),(718,77,32,'2025-07-25 10:47:45'),(719,77,32,'2025-07-25 10:47:45'),(720,77,32,'2025-07-25 10:48:12'),(721,77,32,'2025-07-25 10:48:12'),(722,77,32,'2025-07-25 10:48:22'),(723,77,32,'2025-07-25 10:48:22'),(724,77,30,'2025-07-25 10:48:24'),(725,77,30,'2025-07-25 10:48:24'),(726,77,30,'2025-07-25 10:48:24'),(727,77,30,'2025-07-25 10:48:24'),(728,77,31,'2025-07-25 10:54:08'),(729,77,31,'2025-07-25 10:54:08'),(730,77,31,'2025-07-25 10:54:08'),(731,77,31,'2025-07-25 10:54:08'),(732,77,30,'2025-07-25 10:54:54'),(733,77,30,'2025-07-25 10:54:54'),(734,77,30,'2025-07-25 10:54:55'),(735,77,30,'2025-07-25 10:54:55'),(736,77,26,'2025-07-25 10:56:00'),(737,77,26,'2025-07-25 10:56:00'),(738,77,31,'2025-07-25 11:02:55'),(739,77,31,'2025-07-25 11:02:55'),(740,77,31,'2025-07-25 11:02:55'),(741,77,31,'2025-07-25 11:02:55'),(742,77,32,'2025-07-25 11:24:06'),(743,77,32,'2025-07-25 11:24:06'),(744,77,32,'2025-07-25 11:24:06'),(745,77,32,'2025-07-25 11:24:06'),(746,77,32,'2025-07-25 11:24:14'),(747,77,32,'2025-07-25 11:24:14'),(748,77,32,'2025-07-25 11:24:14'),(749,77,32,'2025-07-25 11:24:14'),(750,77,31,'2025-07-25 11:35:22'),(751,77,31,'2025-07-25 11:35:22'),(752,77,31,'2025-07-25 11:35:22'),(753,77,31,'2025-07-25 11:35:22'),(754,77,31,'2025-07-25 11:55:01'),(755,77,31,'2025-07-25 11:55:01'),(756,77,31,'2025-07-25 11:55:02'),(757,77,31,'2025-07-25 11:55:02'),(758,66,31,'2025-07-25 13:57:00'),(759,66,31,'2025-07-25 13:57:00'),(760,66,31,'2025-07-25 13:57:00'),(761,66,31,'2025-07-25 13:57:00'),(762,77,17,'2025-07-25 13:58:27'),(763,77,17,'2025-07-25 13:58:27'),(764,77,30,'2025-07-25 13:58:35'),(765,77,30,'2025-07-25 13:58:35'),(766,77,30,'2025-07-25 13:58:35'),(767,77,30,'2025-07-25 13:58:35'),(768,77,31,'2025-07-25 14:17:56'),(769,77,31,'2025-07-25 14:17:56'),(770,77,31,'2025-07-25 14:17:57'),(771,77,31,'2025-07-25 14:17:57'),(772,77,31,'2025-07-25 14:38:02'),(773,77,31,'2025-07-25 14:38:02'),(774,77,31,'2025-07-25 14:38:02'),(775,77,31,'2025-07-25 14:38:02'),(776,77,31,'2025-07-25 15:21:35'),(777,77,31,'2025-07-25 15:21:35'),(778,77,31,'2025-07-25 15:21:35'),(779,77,31,'2025-07-25 15:21:35'),(780,77,31,'2025-07-25 15:25:33'),(781,77,31,'2025-07-25 15:25:33'),(782,77,31,'2025-07-25 15:25:33'),(783,77,31,'2025-07-25 15:25:33'),(784,77,31,'2025-07-25 15:25:43'),(785,77,31,'2025-07-25 15:25:44'),(786,77,30,'2025-07-25 15:25:46'),(787,77,30,'2025-07-25 15:25:46'),(788,77,30,'2025-07-25 15:25:46'),(789,77,30,'2025-07-25 15:25:46'),(790,77,30,'2025-07-25 15:41:50'),(791,77,30,'2025-07-25 15:41:50'),(792,77,30,'2025-07-25 15:41:50'),(793,77,30,'2025-07-25 15:41:50'),(794,3,6,'2025-07-25 15:45:47'),(795,3,6,'2025-07-25 15:45:47'),(796,66,30,'2025-07-27 18:25:21'),(797,66,30,'2025-07-27 18:25:21'),(798,66,30,'2025-07-27 18:25:21'),(799,66,30,'2025-07-27 18:25:21'),(800,77,30,'2025-07-27 18:25:48'),(801,77,30,'2025-07-27 18:25:48'),(802,77,30,'2025-07-27 18:25:49'),(803,77,30,'2025-07-27 18:25:49'),(804,77,30,'2025-07-27 18:30:09'),(805,77,30,'2025-07-27 18:30:09'),(806,77,30,'2025-07-27 18:30:09'),(807,77,30,'2025-07-27 18:30:09'),(808,77,29,'2025-07-27 18:30:32'),(809,77,29,'2025-07-27 18:30:32'),(810,77,29,'2025-07-27 18:30:32'),(811,77,29,'2025-07-27 18:30:33'),(812,77,30,'2025-07-27 18:30:44'),(813,77,30,'2025-07-27 18:30:44'),(814,77,30,'2025-07-27 18:30:44'),(815,77,30,'2025-07-27 18:30:44'),(816,77,30,'2025-07-27 18:43:08'),(817,77,30,'2025-07-27 18:43:08'),(818,77,30,'2025-07-27 18:43:20'),(819,77,30,'2025-07-27 18:43:20'),(820,77,30,'2025-07-27 18:48:43'),(821,77,30,'2025-07-27 18:48:43'),(822,77,30,'2025-07-27 18:48:43'),(823,77,30,'2025-07-27 18:48:43');
/*!40000 ALTER TABLE `tbl_event_view` ENABLE KEYS */;
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
-- Table structure for table `tbl_notifications`
--

DROP TABLE IF EXISTS `tbl_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `redirect_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tbl_notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_notifications`
--

LOCK TABLES `tbl_notifications` WRITE;
/*!40000 ALTER TABLE `tbl_notifications` DISABLE KEYS */;
INSERT INTO `tbl_notifications` VALUES (23,66,'Yêu cầu dời lịch bị từ chối','Yêu cầu dời lịch cho sự kiện \'Test Follow\' đã bị từ chối.\nLý do: không cho',0,'2025-07-16 10:23:10','/organizer/events'),(24,66,'Yêu cầu dời lịch đã được phê duyệt','Yêu cầu dời lịch suất chiếu của sự kiện \'Test Follow\' đã được admin phê duyệt.\nThời gian cũ: 12:14 18/07/2025 - 12:15 19/07/2025\nThời gian mới: 17:23 24/07/2025 - 17:24 25/07/2025',0,'2025-07-16 10:24:59','/organizer/events'),(25,77,'Đặt vé thành công','Bạn đã đặt vé thành công cho sự kiện Phan Mạnh Quỳnh . Vui lòng kiểm tra email để xem chi tiết vé.',1,'2025-07-17 03:37:53','/booking-history'),(26,3,'Yêu cầu xét duyệt Organizer','Người dùng kun Tw (twkun11@gmail.com) vừa yêu cầu trở thành nhà tổ chức sự kiện.',1,'2025-07-17 04:07:10','/admin/organizers'),(27,5,'Yêu cầu xét duyệt Organizer','Người dùng kun Tw (twkun11@gmail.com) vừa yêu cầu trở thành nhà tổ chức sự kiện.',0,'2025-07-17 04:07:10','/admin/organizers'),(28,73,'Yêu cầu xét duyệt Organizer','Người dùng kun Tw (twkun11@gmail.com) vừa yêu cầu trở thành nhà tổ chức sự kiện.',0,'2025-07-17 04:07:10','/admin/organizers'),(29,77,'Yêu cầu trở thành Organizer đã bị từ chối','Rất tiếc! Tài khoản của bạn không đủ điều kiện để trở thành người tổ chức sự kiện.',1,'2025-07-17 04:07:47','/register-organizer'),(30,77,'Đặt vé thành công','Bạn đã đặt vé thành công cho sự kiện ABC. Vui lòng kiểm tra email để xem chi tiết vé.',1,'2025-07-17 06:52:17','/booking-history'),(31,66,'Yêu cầu dời lịch đã được phê duyệt','Yêu cầu dời lịch suất chiếu của sự kiện \'ABC\' đã được admin phê duyệt.\nThời gian cũ: 13:43 18/07/2025 - 13:35 19/07/2025\nThời gian mới: 14:00 28/07/2025 - 14:00 29/07/2025',0,'2025-07-17 07:00:41','/organizer/events'),(32,77,'Thông báo dời lịch suất chiếu','Suất chiếu của sự kiện \'ABC\' bạn đã mua đã thay đổi thời gian. Vui lòng kiểm tra lại lịch mới.',1,'2025-07-17 07:00:47','/events/28'),(33,74,'Đặt vé thành công','Bạn đã đặt vé thành công cho sự kiện ABC. Vui lòng kiểm tra email để xem chi tiết vé.',0,'2025-07-17 07:03:13','/booking-history'),(34,66,'Yêu cầu dời lịch đã được phê duyệt','Yêu cầu dời lịch suất chiếu của sự kiện \'ABC\' đã được admin phê duyệt.\nThời gian cũ: 14:00 28/07/2025 - 14:00 29/07/2025\nThời gian mới: 14:03 31/07/2025 - 14:03 01/08/2025',0,'2025-07-17 07:04:17','/organizer/events'),(35,77,'Thông báo dời lịch suất chiếu','Suất chiếu của sự kiện \'ABC\' bạn đã mua đã thay đổi thời gian. Vui lòng kiểm tra lại lịch mới.',1,'2025-07-17 07:04:22','/events/28'),(36,74,'Thông báo dời lịch suất chiếu','Suất chiếu của sự kiện \'ABC\' bạn đã mua đã thay đổi thời gian. Vui lòng kiểm tra lại lịch mới.',1,'2025-07-17 07:04:22','/events/28'),(37,3,'Yêu cầu xét duyệt Organizer','Người dùng kk tri (trilearn11@gmail.com) vừa yêu cầu trở thành nhà tổ chức sự kiện.',1,'2025-07-17 07:19:58','/admin/organizers'),(38,5,'Yêu cầu xét duyệt Organizer','Người dùng kk tri (trilearn11@gmail.com) vừa yêu cầu trở thành nhà tổ chức sự kiện.',0,'2025-07-17 07:19:58','/admin/organizers'),(39,73,'Yêu cầu xét duyệt Organizer','Người dùng kk tri (trilearn11@gmail.com) vừa yêu cầu trở thành nhà tổ chức sự kiện.',0,'2025-07-17 07:19:58','/admin/organizers'),(40,74,'Bạn đã trở thành Organizer!','Tài khoản của bạn đã được phê duyệt trở thành người tổ chức sự kiện.',1,'2025-07-17 07:20:35','/register-organizer'),(41,77,'Đặt vé thành công','Bạn đã đặt vé thành công cho sự kiện Hi. Vui lòng kiểm tra email để xem chi tiết vé.',1,'2025-07-24 09:31:05','/booking-history');
/*!40000 ALTER TABLE `tbl_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_org_type`
--

DROP TABLE IF EXISTS `tbl_org_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_org_type` (
  `org_type_id` int NOT NULL AUTO_INCREMENT,
  `type_code` varchar(50) NOT NULL,
  `type_name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`org_type_id`),
  UNIQUE KEY `type_code` (`type_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_org_type`
--

LOCK TABLES `tbl_org_type` WRITE;
/*!40000 ALTER TABLE `tbl_org_type` DISABLE KEYS */;
INSERT INTO `tbl_org_type` VALUES (1,'1','Nhà bán hàng',NULL),(2,'2','Bán Vé Thể thao',NULL),(3,'3','Bán Vé Ca Nhạc',NULL),(4,'4','Khác',NULL);
/*!40000 ALTER TABLE `tbl_org_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_organizer`
--

DROP TABLE IF EXISTS `tbl_organizer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_organizer` (
  `organizer_id` int NOT NULL AUTO_INCREMENT,
  `org_name` varchar(200) DEFAULT NULL,
  `tax_code` varchar(60) DEFAULT NULL,
  `org_address` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `business_field` varchar(100) DEFAULT NULL,
  `org_info` text,
  `org_logo_url` varchar(255) DEFAULT NULL,
  `id_card_front_url` varchar(255) DEFAULT NULL,
  `id_card_back_url` varchar(255) DEFAULT NULL,
  `business_license_url` varchar(255) DEFAULT NULL,
  `experience` text,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `org_type_id` int DEFAULT NULL,
  PRIMARY KEY (`organizer_id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `fk_org_type` (`org_type_id`),
  CONSTRAINT `fk_org_type` FOREIGN KEY (`org_type_id`) REFERENCES `tbl_org_type` (`org_type_id`),
  CONSTRAINT `fk_organizer_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_organizer`
--

LOCK TABLES `tbl_organizer` WRITE;
/*!40000 ALTER TABLE `tbl_organizer` DISABLE KEYS */;
INSERT INTO `tbl_organizer` VALUES (1,'Công ty Tổ chức Sự kiện ABC','1234567890','Số 123 Đường ABC, Quận XYZ, TP.HCM','https://abc-event.com','Sự kiện văn hóa, giải trí','Thông tin mô tả về công ty','https://example.com/logo.png','https://example.com/id-card-front.jpg','https://example.com/id-card-back.jpg','https://example.com/business-license.jpg','Kinh nghiệm 5 năm trong lĩnh vực tổ chức sự kiện','APPROVED','2025-06-10 12:15:26','2025-06-19 12:42:37',66,1),(2,'TRAN VO VAN TRI','asd','Thôn Phước Đức, Xã Quế Châu, Huyện Quế Sơn, Tỉnh Quảng Nam','','free','asd','https://res.cloudinary.com/dbpchaamx/image/upload/v1750493156/identity_docs/in4_organizer_65.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1750493149/identity_docs/in4_organizer_65.png','https://res.cloudinary.com/dbpchaamx/image/upload/v1750493149/identity_docs/in4_organizer_65.png','https://res.cloudinary.com/dbpchaamx/image/upload/v1750493159/identity_docs/in4_organizer_65.png',NULL,'APPROVED','2025-06-21 08:06:00',NULL,65,1),(3,'TRAN VO VAN TRI','12323213','Thôn Phước Đức, Xã Quế Châu, Huyện Quế Sơn, Tỉnh Quảng Nam','sadsa','free','nha ở long biên','https://res.cloudinary.com/dbpchaamx/image/upload/v1752725224/identity_docs/in4_organizer_77.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752725224/identity_docs/in4_organizer_77.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752725224/identity_docs/in4_organizer_77.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752725224/identity_docs/in4_organizer_77.jpg',NULL,'REJECTED','2025-07-17 04:07:10',NULL,77,4),(4,'TRAN VO VAN TRI','12312313','Thôn Phước Đức, Xã Quế Châu, Huyện Quế Sơn, Tỉnh Quảng Nam','sadsa','free','assd','https://res.cloudinary.com/dbpchaamx/image/upload/v1752736789/identity_docs/in4_organizer_74.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752736789/identity_docs/in4_organizer_74.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752736789/identity_docs/in4_organizer_74.jpg','https://res.cloudinary.com/dbpchaamx/image/upload/v1752736789/identity_docs/in4_organizer_74.jpg',NULL,'APPROVED','2025-07-17 07:19:58',NULL,74,2);
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
  `showing_time_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` tinytext,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  `status` enum('active','deleted') DEFAULT 'active',
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `showing_time_id` (`showing_time_id`,`user_id`),
  KEY `fk_review_user` (`user_id`),
  CONSTRAINT `fk_review_showing_time` FOREIGN KEY (`showing_time_id`) REFERENCES `tbl_showing_time` (`showing_time_id`),
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`),
  CONSTRAINT `tbl_review_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_review`
--

LOCK TABLES `tbl_review` WRITE;
/*!40000 ALTER TABLE `tbl_review` DISABLE KEYS */;
INSERT INTO `tbl_review` VALUES (1,6,77,5,'jhajhaa','2025-07-11 19:47:10',NULL,'active'),(2,28,77,5,'good','2025-07-16 16:48:46','2025-07-17 09:54:58','active'),(15,7,77,4,'tệ','2025-07-17 11:03:14',NULL,'active');
/*!40000 ALTER TABLE `tbl_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_review_reply`
--

DROP TABLE IF EXISTS `tbl_review_reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_review_reply` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organizer_id` int DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `review_id` int NOT NULL,
  `status` enum('active','deleted') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `review_id` (`review_id`),
  CONSTRAINT `tbl_review_reply_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `tbl_review` (`review_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_review_reply`
--

LOCK TABLES `tbl_review_reply` WRITE;
/*!40000 ALTER TABLE `tbl_review_reply` DISABLE KEYS */;
INSERT INTO `tbl_review_reply` VALUES (1,1,'ok','2025-07-16 17:20:37.161859','2025-07-16 17:20:37.161859',2,'active'),(2,1,'mệt','2025-07-16 17:20:45.774284','2025-07-16 17:20:45.774284',2,'active');
/*!40000 ALTER TABLE `tbl_review_reply` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=458 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_seat`
--

LOCK TABLES `tbl_seat` WRITE;
/*!40000 ALTER TABLE `tbl_seat` DISABLE KEYS */;
INSERT INTO `tbl_seat` VALUES (1,1,'Standard','A1 1',30,30,80000.00),(2,1,'Standard','A1 2',66,30,80000.00),(3,1,'Standard','A1 3',102,30,80000.00),(4,1,'Standard','A1 4',138,30,80000.00),(5,1,'Standard','A1 5',174,30,80000.00),(6,1,'Standard','A1 6',210,30,80000.00),(7,1,'Standard','A1 7',246,30,80000.00),(8,1,'Standard','A1 8',282,30,80000.00),(9,1,'Standard','A1 9',318,30,80000.00),(10,1,'Standard','A1 10',354,30,80000.00),(11,1,'Standard','A1 11',30,66,80000.00),(12,1,'Standard','A1 12',66,66,80000.00),(13,1,'Standard','A1 13',102,66,80000.00),(14,1,'Standard','A1 14',138,66,80000.00),(15,1,'Standard','A1 15',174,66,80000.00),(16,1,'Standard','A1 16',210,66,80000.00),(17,1,'Standard','A1 17',246,66,80000.00),(18,1,'Standard','A1 18',282,66,80000.00),(19,1,'Standard','A1 19',318,66,80000.00),(20,1,'Standard','A1 20',354,66,80000.00),(21,1,'Standard','A1 21',30,102,80000.00),(22,1,'Standard','A1 22',66,102,80000.00),(23,1,'Standard','A1 23',102,102,80000.00),(24,1,'Standard','A1 24',138,102,80000.00),(25,1,'Standard','A1 25',174,102,80000.00),(26,1,'Standard','A1 26',210,102,80000.00),(27,1,'Standard','A1 27',246,102,80000.00),(28,1,'Standard','A1 28',282,102,80000.00),(29,1,'Standard','A1 29',318,102,80000.00),(30,1,'Standard','A1 30',354,102,80000.00),(31,1,'Standard','A1 31',30,138,80000.00),(32,1,'Standard','A1 32',66,138,80000.00),(33,1,'Standard','A1 33',102,138,80000.00),(34,1,'Standard','A1 34',138,138,80000.00),(35,1,'Standard','A1 35',174,138,80000.00),(36,1,'Standard','A1 36',210,138,80000.00),(37,1,'Standard','A1 37',246,138,80000.00),(38,1,'Standard','A1 38',282,138,80000.00),(39,1,'Standard','A1 39',318,138,80000.00),(40,1,'Standard','A1 40',354,138,80000.00),(41,1,'Standard','A1 41',30,174,80000.00),(42,1,'Standard','A1 42',66,174,80000.00),(43,1,'Standard','A1 43',102,174,80000.00),(44,1,'Standard','A1 44',138,174,80000.00),(45,1,'Standard','A1 45',174,174,80000.00),(46,1,'Standard','A1 46',210,174,80000.00),(47,1,'Standard','A1 47',246,174,80000.00),(48,1,'Standard','A1 48',282,174,80000.00),(49,1,'Standard','A1 49',318,174,80000.00),(50,1,'Standard','A1 50',144,294,80000.00),(51,2,'VIP','VIP 1 1',30,30,120000.00),(52,2,'VIP','VIP 1 2',66,30,120000.00),(53,2,'VIP','VIP 1 3',102,30,120000.00),(54,2,'VIP','VIP 1 4',138,30,120000.00),(55,2,'VIP','VIP 1 5',174,30,120000.00),(56,2,'VIP','VIP 1 6',210,30,120000.00),(57,2,'VIP','VIP 1 7',246,30,120000.00),(58,2,'VIP','VIP 1 8',282,30,120000.00),(59,2,'VIP','VIP 1 9',318,30,120000.00),(60,2,'VIP','VIP 1 10',354,30,120000.00),(61,2,'VIP','Vip 2 1',30,90,120000.00),(62,2,'VIP','Vip 2 2',66,90,120000.00),(63,2,'VIP','Vip 2 3',102,90,120000.00),(64,2,'VIP','Vip 2 4',138,90,120000.00),(65,2,'VIP','Vip 2 5',174,90,120000.00),(66,2,'VIP','Vip 2 6',210,90,120000.00),(67,2,'VIP','Vip 2 7',246,90,120000.00),(68,2,'VIP','Vip 2 8',282,90,120000.00),(69,2,'VIP','Vip 2 9',318,90,120000.00),(70,2,'VIP','Vip 2 10',144,180,120000.00),(71,5,'VIP','Vip 1 1',30,30,120000.00),(72,5,'VIP','Vip 1 2',66,30,120000.00),(73,5,'VIP','Vip 1 3',102,30,120000.00),(74,5,'VIP','Vip 1 4',138,30,120000.00),(75,5,'VIP','Vip 1 5',174,30,120000.00),(76,5,'VIP','Vip 1 6',210,30,120000.00),(77,5,'VIP','Vip 1 7',246,30,120000.00),(78,5,'VIP','Vip 1 8',282,30,120000.00),(79,5,'VIP','Vip 1 9',318,30,120000.00),(80,5,'VIP','Vip 1 10',354,30,120000.00),(81,6,'VIP','A',30,120,120000.00),(82,17,'VIP','A',30,30,120000.00),(84,18,'VIP','a',30,30,120000.00),(85,9,'VIP','nhi',30,30,120000.00),(88,8,'VIP','a',30,30,120000.00),(89,10,'VIP','a',30,30,120000.00),(90,7,'VIP','Nhi',30,30,120000.00),(91,19,'VIP','A',120,120,120000.00),(92,20,'VIP','A 1',30,30,120000.00),(93,20,'VIP','A 2',66,30,120000.00),(94,20,'VIP','A 3',102,30,120000.00),(95,20,'VIP','A 4',138,30,120000.00),(96,20,'VIP','A 5',174,30,120000.00),(97,20,'VIP','A 6',210,30,120000.00),(98,20,'VIP','A 7',246,30,120000.00),(99,20,'VIP','A 8',282,30,120000.00),(100,20,'VIP','A 9',318,30,120000.00),(101,20,'VIP','A 10',354,30,120000.00),(102,21,'VIP','A 1',30,30,120000.00),(103,21,'VIP','A 2',66,30,120000.00),(104,21,'VIP','A 3',102,30,120000.00),(105,21,'VIP','A 4',138,30,120000.00),(106,21,'VIP','A 5',174,30,120000.00),(107,21,'VIP','A 6',210,30,120000.00),(108,21,'VIP','A 7',246,30,120000.00),(109,21,'VIP','A 8',282,30,120000.00),(110,21,'VIP','A 9',318,30,120000.00),(111,21,'VIP','A 10',354,30,120000.00),(112,21,'Standard','A 1',30,60,80000.00),(113,21,'Standard','A 2',66,60,80000.00),(114,21,'Standard','A 3',102,60,80000.00),(115,21,'Standard','A 4',138,60,80000.00),(116,21,'Standard','A 5',174,60,80000.00),(117,21,'Standard','A 6',210,60,80000.00),(118,21,'Standard','A 7',246,60,80000.00),(119,21,'Standard','A 8',282,60,80000.00),(120,21,'Standard','A 9',318,60,80000.00),(121,21,'Standard','A 10',354,60,80000.00),(122,22,'Premium','A',30,30,150000.00),(123,22,'Premium','A 1',30,60,150000.00),(124,22,'Premium','A 2',66,30,150000.00),(125,22,'Premium','A 3',102,30,150000.00),(126,22,'Premium','A 4',138,30,150000.00),(127,22,'Premium','A 5',174,30,150000.00),(128,22,'Premium','A 6',210,30,150000.00),(129,22,'Premium','A 7',246,30,150000.00),(130,22,'Premium','A 8',282,30,150000.00),(131,22,'Premium','A 9',318,30,150000.00),(132,22,'Premium','A 10',354,30,150000.00),(133,23,'VIP','A',30,30,120000.00),(134,23,'VIP','A 1',30,90,120000.00),(135,23,'VIP','A 2',66,30,120000.00),(136,23,'VIP','A 3',102,30,120000.00),(137,23,'VIP','A 4',138,30,120000.00),(138,23,'VIP','A 5',174,30,120000.00),(139,23,'VIP','A 6',210,30,120000.00),(140,23,'VIP','A 7',246,30,120000.00),(141,23,'VIP','A 8',282,30,120000.00),(142,23,'VIP','A 9',318,30,120000.00),(143,23,'VIP','A 10',354,30,120000.00),(144,25,'VIP','A 1',30,30,120000.00),(145,25,'VIP','A 2',66,30,120000.00),(146,25,'VIP','A 3',102,30,120000.00),(147,25,'VIP','A 4',138,30,120000.00),(148,25,'VIP','A 5',174,30,120000.00),(149,25,'VIP','A 6',210,30,120000.00),(150,25,'VIP','A 7',246,30,120000.00),(151,25,'VIP','A 8',282,30,120000.00),(152,25,'VIP','A 9',318,30,120000.00),(153,25,'VIP','A 10',354,30,120000.00),(154,28,'VIP','A 1',30,30,120000.00),(155,28,'VIP','A 2',66,30,120000.00),(156,28,'VIP','A 3',102,30,120000.00),(157,28,'VIP','A 4',138,30,120000.00),(158,28,'VIP','A 5',174,30,120000.00),(159,28,'VIP','A 6',210,30,120000.00),(160,28,'VIP','A 7',246,30,120000.00),(161,28,'VIP','A 8',282,30,120000.00),(162,28,'VIP','A 9',318,30,120000.00),(163,28,'VIP','A 10',354,30,120000.00),(164,28,'B','B 1',30,60,2000.00),(165,28,'B','B 2',66,60,2000.00),(166,28,'B','B 3',102,60,2000.00),(167,28,'B','B 4',138,60,2000.00),(168,28,'B','B 5',174,60,2000.00),(169,28,'B','B 6',210,60,2000.00),(170,28,'B','B 7',246,60,2000.00),(171,28,'B','B 8',282,60,2000.00),(172,28,'B','B 9',318,60,2000.00),(173,28,'B','B 10',84,120,2000.00),(174,29,'VIP','A 1',30,30,120000.00),(175,29,'VIP','A 2',66,30,120000.00),(176,29,'VIP','A 3',102,30,120000.00),(177,29,'VIP','A 4',138,30,120000.00),(178,29,'VIP','A 5',174,30,120000.00),(179,29,'VIP','A 6',210,30,120000.00),(180,29,'VIP','A 7',246,30,120000.00),(181,29,'VIP','A 8',282,30,120000.00),(182,29,'VIP','A 9',318,30,120000.00),(183,29,'VIP','A 10',354,30,120000.00),(184,29,'VIP','A 11',30,66,120000.00),(185,29,'VIP','A 12',66,66,120000.00),(186,29,'VIP','A 13',102,66,120000.00),(187,29,'VIP','A 14',138,66,120000.00),(188,29,'VIP','A 15',174,66,120000.00),(189,29,'VIP','A 16',210,66,120000.00),(190,29,'VIP','A 17',246,66,120000.00),(191,29,'VIP','A 18',282,66,120000.00),(192,30,'VIP','A 1',30,30,120000.00),(193,30,'VIP','A 2',66,30,120000.00),(194,30,'VIP','A 3',162,270,120000.00),(195,30,'VIP','A 4',438,270,120000.00),(196,30,'VIP','A 5',174,30,120000.00),(197,30,'VIP','A 6',210,30,120000.00),(198,30,'VIP','A 7',246,30,120000.00),(199,30,'VIP','A 8',282,30,120000.00),(200,30,'VIP','A 9',318,30,120000.00),(201,30,'VIP','A 10',654,60,120000.00),(202,30,'VIP','B 1',30,90,120000.00),(203,30,'VIP','B 2',66,270,120000.00),(204,30,'VIP','B 3',72,360,120000.00),(205,30,'VIP','B 4',0,360,120000.00),(206,30,'VIP','B 5',174,30,120000.00),(207,30,'VIP','B 6',210,30,120000.00),(208,30,'VIP','B 7',246,30,120000.00),(209,30,'VIP','B 8',282,30,120000.00),(210,30,'VIP','B 9',408,270,120000.00),(211,30,'VIP','B 10',504,270,120000.00),(212,31,'VIP','A 1',30,30,120000.00),(213,31,'VIP','A 2',66,30,120000.00),(214,31,'VIP','A 3',102,30,120000.00),(215,31,'VIP','A 4',138,30,120000.00),(216,31,'VIP','A 5',174,30,120000.00),(217,31,'VIP','A 6',210,30,120000.00),(218,31,'VIP','A 7',246,30,120000.00),(219,31,'VIP','A 8',282,30,120000.00),(220,31,'VIP','A 9',318,30,120000.00),(221,31,'VIP','A 10',354,30,120000.00),(222,32,'VIP','A 1',30,30,120000.00),(223,32,'VIP','A 2',66,30,120000.00),(224,32,'VIP','A 3',102,30,120000.00),(225,32,'VIP','A 4',138,30,120000.00),(226,32,'VIP','A 5',174,30,120000.00),(227,32,'VIP','A 6',210,30,120000.00),(228,32,'VIP','A 7',246,30,120000.00),(229,32,'VIP','A 8',282,30,120000.00),(230,32,'VIP','A 9',318,30,120000.00),(231,32,'VIP','A 10',354,30,120000.00),(252,34,'VIP','A 1',30,30,120000.00),(253,34,'VIP','A 2',66,30,120000.00),(254,34,'VIP','A 3',102,30,120000.00),(255,34,'VIP','A 4',138,30,120000.00),(256,34,'VIP','A 5',174,30,120000.00),(257,34,'VIP','A 6',210,30,120000.00),(258,34,'VIP','A 7',246,30,120000.00),(259,34,'VIP','A 8',282,30,120000.00),(260,34,'VIP','A 9',318,30,120000.00),(261,34,'VIP','A 10',144,210,120000.00),(262,34,'Cui','b 1',30,120,60000.00),(263,34,'Cui','b 2',66,120,60000.00),(264,34,'Cui','b 3',102,120,60000.00),(265,34,'Cui','b 4',138,120,60000.00),(266,34,'Cui','b 5',174,120,60000.00),(267,35,'Regular','A1',40,40,500000.00),(268,35,'Regular','A2',40,80,500000.00),(269,35,'Regular','A3',40,120,500000.00),(270,35,'Regular','B1',80,40,500000.00),(271,35,'Regular','B2',80,80,500000.00),(272,35,'Regular','B3',80,120,500000.00),(273,35,'Regular','C1',120,40,500000.00),(274,35,'Regular','C2',120,80,500000.00),(275,35,'Regular','C3',120,120,500000.00),(276,35,'Regular','D1',160,40,500000.00),(277,35,'Regular','D2',160,80,500000.00),(278,35,'Regular','D3',160,120,500000.00),(279,36,'VIP','A1',310,30,2000000.00),(280,36,'Regular','B1',380,30,800000.00),(281,36,'Regular','C1',420,30,800000.00),(282,36,'Regular','D1',460,30,800000.00),(283,36,'VIP','A2',340,70,2000000.00),(284,36,'Regular','B2',380,70,800000.00),(285,36,'Regular','C2',420,70,800000.00),(286,36,'Regular','D2',460,70,800000.00),(287,36,'VIP','A3',340,110,2000000.00),(288,36,'Regular','B3',380,110,800000.00),(289,38,'Standard','A 1',30,30,80000.00),(290,38,'Standard','A 2',66,30,80000.00),(291,38,'Standard','A 3',102,30,80000.00),(292,38,'Standard','A 4',138,30,80000.00),(293,38,'Standard','A 5',174,30,80000.00),(294,38,'Standard','A 6',210,30,80000.00),(295,38,'Standard','A 7',246,30,80000.00),(296,38,'Standard','A 8',282,30,80000.00),(297,38,'Standard','A 9',318,30,80000.00),(298,38,'Standard','A 10',354,30,80000.00),(299,38,'Premium','T 1',150,60,150000.00),(300,38,'Premium','T 2',156,120,150000.00),(301,38,'Premium','T 3',162,180,150000.00),(302,38,'Premium','T 4',168,240,150000.00),(303,38,'Premium','T 5',174,300,150000.00),(304,38,'Premium','T 6',30,90,150000.00),(305,38,'Premium','T 7',36,150,150000.00),(306,38,'Premium','T 8',312,90,150000.00),(307,38,'Premium','T 9',318,150,150000.00),(308,38,'Premium','T 10',114,300,150000.00),(339,41,'Standard','A 1',30,30,80000.00),(340,41,'Standard','A 2',66,30,80000.00),(341,41,'Standard','A 3',102,30,80000.00),(342,41,'Standard','A 4',138,30,80000.00),(343,41,'Standard','A 5',174,30,80000.00),(344,41,'Standard','A 6',210,30,80000.00),(345,41,'Standard','A 7',246,30,80000.00),(346,41,'Standard','A 8',282,30,80000.00),(347,41,'Standard','A 9',318,30,80000.00),(348,41,'Standard','A 10',354,30,80000.00),(349,41,'Standard','A 11',30,96,80000.00),(350,41,'Standard','A 12',66,96,80000.00),(351,41,'Standard','A 13',102,96,80000.00),(352,41,'Standard','A 14',138,96,80000.00),(353,41,'Standard','A 15',174,96,80000.00),(354,41,'Standard','A 16',210,96,80000.00),(355,41,'Standard','A 17',246,96,80000.00),(356,41,'Standard','A 18',282,96,80000.00),(357,41,'Standard','A 19',318,96,80000.00),(358,41,'Standard','A 20',354,96,80000.00),(359,42,'VIP','A1',90,120,1000000.00),(360,42,'VIP','B1',160,120,1000000.00),(361,42,'VIP','C1',200,120,1000000.00),(362,42,'Regular','D1',180,60,400000.00),(363,42,'Regular','E1',280,120,400000.00),(364,42,'VIP','A2',120,40,1000000.00),(365,42,'VIP','B2',100,160,1000000.00),(366,42,'Regular','C2',200,160,400000.00),(367,42,'Regular','D2',240,160,400000.00),(368,42,'Regular','E2',100,220,400000.00),(369,42,'VIP','B3',220,20,1000000.00),(370,33,'Standard','A 1',30,30,80000.00),(371,33,'Standard','A 2',66,30,80000.00),(372,33,'Standard','A 3',102,30,80000.00),(373,33,'Standard','A 4',138,30,80000.00),(374,33,'Standard','A 5',174,30,80000.00),(375,33,'Standard','A 6',210,30,80000.00),(376,33,'Standard','A 7',246,30,80000.00),(377,33,'Standard','A 8',282,30,80000.00),(378,33,'Standard','A 9',318,30,80000.00),(379,33,'Standard','A 10',354,30,80000.00),(380,43,'VIP','A1',30,30,2000000.00),(381,43,'Regular','B1',70,30,1000000.00),(382,43,'Regular','C1',110,30,1000000.00),(383,43,'Regular','D1',150,30,1000000.00),(384,43,'Regular','E1',190,30,1000000.00),(385,43,'VIP','A2',240,160,2000000.00),(386,43,'Regular','B2',70,70,1000000.00),(387,43,'Regular','C2',110,70,1000000.00),(388,43,'Regular','D2',150,70,1000000.00),(389,43,'Regular','E2',190,70,1000000.00),(390,43,'VIP','F2',140,190,2000000.00),(391,44,'VIP','A 1',30,30,120000.00),(392,44,'VIP','A 2',66,30,120000.00),(393,44,'VIP','A 3',102,30,120000.00),(394,44,'VIP','A 4',138,30,120000.00),(395,44,'VIP','A 5',174,30,120000.00),(396,44,'VIP','A 6',210,30,120000.00),(397,44,'VIP','A 7',246,30,120000.00),(398,44,'VIP','A 8',282,30,120000.00),(399,44,'VIP','A 9',318,30,120000.00),(400,44,'VIP','A 10',354,30,120000.00),(401,44,'VIP','A 11',30,66,120000.00),(402,44,'VIP','A 12',66,66,120000.00),(403,44,'VIP','A 13',102,66,120000.00),(404,44,'VIP','A 14',138,66,120000.00),(405,44,'VIP','A 15',174,66,120000.00),(406,44,'VIP','A 16',210,66,120000.00),(407,44,'VIP','A 17',246,66,120000.00),(408,45,'VIP','A 1',20,20,120000.00),(409,45,'VIP','A 2',60,20,120000.00),(410,45,'VIP','A 3',100,20,120000.00),(411,45,'VIP','A 4',140,20,120000.00),(412,45,'VIP','A 5',180,20,120000.00),(413,45,'VIP','A 6',220,20,120000.00),(414,45,'VIP','A 7',260,20,120000.00),(415,45,'VIP','A 8',300,20,120000.00),(416,45,'VIP','A 9',340,20,120000.00),(417,45,'VIP','A 10',380,20,120000.00),(418,45,'VIP','A 11',420,20,120000.00),(419,45,'VIP','A 12',460,20,120000.00),(420,45,'VIP','A 13',500,20,120000.00),(421,45,'VIP','A 14',540,20,120000.00),(422,45,'VIP','A 15',580,20,120000.00),(423,45,'VIP','A 16',620,20,120000.00),(424,45,'VIP','A 17',660,20,120000.00),(425,45,'VIP','A 18',700,20,120000.00),(426,45,'VIP','A 19',740,20,120000.00),(427,45,'VIP','A 20',780,20,120000.00),(428,45,'VIP','A 21',820,20,120000.00),(429,45,'VIP','A 22',860,20,120000.00),(430,45,'VIP','A 23',900,20,120000.00),(431,45,'VIP','A 24',160,120,120000.00),(432,45,'VIP','A 25',200,120,120000.00),(433,45,'VIP','A 26',20,100,120000.00),(434,45,'VIP','A 27',60,100,120000.00),(435,45,'VIP','A 28',160,160,120000.00),(436,45,'VIP','A 29',1140,20,120000.00),(437,45,'VIP','A 30',1180,20,120000.00),(438,45,'VIP','A 31',20,60,120000.00),(439,45,'VIP','A 32',60,60,120000.00),(440,45,'VIP','A 33',100,60,120000.00),(441,45,'VIP','A 34',140,60,120000.00),(442,45,'VIP','A 35',180,60,120000.00),(443,45,'VIP','A 36',220,60,120000.00),(444,45,'VIP','A 37',260,60,120000.00),(445,45,'VIP','A 38',300,60,120000.00),(446,45,'VIP','A 39',340,60,120000.00),(447,45,'VIP','A 40',380,60,120000.00),(448,45,'VIP','A 41',420,60,120000.00),(449,45,'VIP','A 42',460,60,120000.00),(450,45,'VIP','A 43',500,60,120000.00),(451,45,'VIP','A 44',540,60,120000.00),(452,45,'VIP','A 45',580,60,120000.00),(453,45,'VIP','A 46',620,60,120000.00),(454,45,'VIP','A 47',660,60,120000.00),(455,45,'VIP','A 48',700,60,120000.00),(456,45,'VIP','A 49',740,60,120000.00),(457,45,'VIP','A 50',780,60,120000.00);
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
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`showing_time_id`),
  KEY `event_id` (`event_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `tbl_showing_time_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`),
  CONSTRAINT `tbl_showing_time_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `tbl_address` (`address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_showing_time`
--

LOCK TABLES `tbl_showing_time` WRITE;
/*!40000 ALTER TABLE `tbl_showing_time` DISABLE KEYS */;
INSERT INTO `tbl_showing_time` VALUES (1,1,1,'2025-06-27 11:42:00','2025-06-29 11:42:00','2025-06-19 11:42:00','2025-06-27 11:42:00','seat','ACTIVE'),(2,2,2,'2025-06-28 12:59:00','2025-06-29 12:59:00','2025-06-19 12:59:00','2025-06-22 12:59:00','seat','ACTIVE'),(3,3,3,'2025-06-28 13:10:00','2025-06-29 13:10:00','2025-06-19 13:10:00','2025-06-20 13:10:00','zone','ACTIVE'),(4,4,4,'2025-06-20 13:36:00','2025-06-21 13:36:00','2025-06-19 13:36:00','2025-06-20 01:36:00','zone','ACTIVE'),(5,5,5,'2025-06-21 23:16:00','2025-06-22 23:16:00','2025-06-19 23:16:00','2025-06-20 23:16:00','both','ACTIVE'),(6,6,6,'2025-07-07 07:33:00','2025-07-08 13:00:00','2025-07-03 15:33:00','2025-07-08 15:33:00','seat','ACTIVE'),(7,8,7,'2025-07-10 16:11:00','2025-07-12 16:11:00','2025-07-04 16:11:00','2025-07-06 16:11:00','seat','ACTIVE'),(8,8,8,'2025-07-10 16:11:00','2025-07-12 16:11:00','2025-07-04 16:11:00','2025-07-06 16:11:00','seat','ACTIVE'),(9,8,9,'2025-07-10 16:11:00','2025-07-12 16:11:00','2025-07-04 16:11:00','2025-07-06 16:11:00','seat','ACTIVE'),(10,8,10,'2025-07-10 16:11:00','2025-07-12 16:11:00','2025-07-04 16:11:00','2025-07-06 16:11:00','seat','ACTIVE'),(11,10,11,'2025-07-26 16:34:00','2025-07-27 16:34:00','2025-07-04 16:34:00','2025-07-08 16:34:00','seat','ACTIVE'),(12,10,12,'2025-07-26 16:34:00','2025-07-27 16:34:00','2025-07-04 16:34:00','2025-07-08 16:34:00','seat','ACTIVE'),(13,10,13,'2025-07-26 16:34:00','2025-07-27 16:34:00','2025-07-04 16:34:00','2025-07-08 16:34:00','seat','ACTIVE'),(14,10,14,'2025-07-26 16:34:00','2025-07-27 16:34:00','2025-07-04 16:34:00','2025-07-08 16:34:00','seat','ACTIVE'),(15,11,15,'2025-07-18 16:36:00','2025-07-19 16:36:00','2025-07-04 16:36:00','2025-07-05 16:36:00','seat','ACTIVE'),(16,11,16,'2025-07-18 16:36:00','2025-07-19 16:36:00','2025-07-04 16:36:00','2025-07-05 16:36:00','seat','ACTIVE'),(17,11,17,'2025-07-18 16:36:00','2025-07-19 16:36:00','2025-07-04 16:36:00','2025-07-05 16:36:00','seat','ACTIVE'),(18,12,18,'2025-07-10 16:53:00','2025-07-11 16:53:00','2025-07-04 16:53:00','2025-07-10 16:53:00','seat','ACTIVE'),(19,13,19,'2025-07-11 20:09:00','2025-07-12 20:09:00','2025-07-05 20:09:00','2025-07-08 20:09:00','seat','ACTIVE'),(20,14,20,'2025-07-23 12:06:00','2025-07-24 12:06:00','2025-07-06 12:12:00','2025-07-07 12:06:00','seat','ACTIVE'),(21,15,21,'2025-07-24 17:23:00','2025-07-25 17:24:00','2025-07-06 12:19:00','2025-07-07 12:15:00','seat','ACTIVE'),(22,16,22,'2025-07-23 12:35:00','2025-07-24 12:22:00','2025-07-06 12:59:00','2025-07-07 12:22:00','seat','ACTIVE'),(23,17,23,'2025-07-31 11:02:00','2025-08-01 11:02:00','2025-07-08 11:08:00','2025-07-09 11:02:00','seat','ACTIVE'),(24,17,23,'2025-08-06 11:02:00','2025-08-07 11:02:00','2025-07-15 11:02:00','2025-07-16 11:02:00','zone','ACTIVE'),(25,18,24,'2025-07-24 11:13:00','2025-07-25 11:13:00','2025-07-08 11:29:00','2025-07-09 11:13:00','seat','ACTIVE'),(26,19,25,'2025-07-18 19:10:00','2025-07-19 19:10:00','2025-07-10 19:10:00','2025-07-17 12:10:00','zone','ACTIVE'),(27,20,26,'2025-07-23 15:26:00','2025-07-24 15:26:00','2025-07-14 15:27:00','2025-07-18 15:27:00','zone','ACTIVE'),(28,21,27,'2025-07-15 15:40:00','2025-07-15 17:40:00','2025-07-14 15:40:00','2025-07-15 15:38:00','seat','ACTIVE'),(29,21,27,'2025-07-25 15:41:00','2025-07-26 15:41:00','2025-07-17 15:41:00','2025-07-19 15:41:00','seat','ACTIVE'),(30,22,28,'2025-07-24 21:57:00','2025-07-25 21:57:00','2025-07-15 21:57:00','2025-07-17 21:57:00','seat','ACTIVE'),(31,23,29,'2025-07-23 12:49:00','2025-07-24 12:49:00','2025-07-16 12:49:00','2025-07-18 12:49:00','seat','ACTIVE'),(32,24,30,'2025-07-18 13:54:00','2025-07-19 13:54:00','2025-07-16 13:54:00','2025-07-17 13:54:00','seat','ACTIVE'),(33,25,31,'2025-07-19 09:56:00','2025-07-19 15:56:00','2025-07-17 09:56:00','2025-07-18 09:56:00','seat','ACTIVE'),(34,26,32,'2025-07-24 10:14:00','2025-07-25 10:14:00','2025-07-17 10:17:00','2025-07-20 10:14:00','seat','ACTIVE'),(35,27,33,'2025-07-18 17:17:00','2025-07-19 13:17:00','2025-07-17 13:17:00','2025-07-18 13:17:00','seat','ACTIVE'),(36,28,34,'2025-07-24 13:29:00','2025-07-25 13:29:00','2025-07-17 13:36:00','2025-07-18 13:29:00','both','ACTIVE'),(37,29,35,'2025-07-31 14:03:00','2025-08-01 14:03:00','2025-07-17 13:40:00','2025-07-17 20:35:00','zone','ACTIVE'),(38,30,36,'2025-07-29 16:55:00','2025-07-30 14:55:00','2025-07-24 16:56:00','2025-07-28 14:56:00','seat','ACTIVE'),(39,31,37,'2025-08-01 14:58:00','2025-08-02 14:58:00','2025-07-24 14:58:00','2025-07-26 14:58:00','zone','ACTIVE'),(40,32,38,'2025-07-31 15:05:00','2025-08-01 15:05:00','2025-07-24 15:05:00','2025-07-26 15:05:00','zone','ACTIVE'),(41,33,39,'2025-07-30 15:13:00','2025-07-31 15:13:00','2025-07-24 15:13:00','2025-07-26 15:13:00','seat','ACTIVE'),(42,34,40,'2025-07-29 16:27:00','2025-07-30 16:27:00','2025-07-24 16:27:00','2025-07-26 16:27:00','seat','ACTIVE'),(43,35,41,'2025-08-01 21:06:00','2025-08-02 21:06:00','2025-07-24 21:06:00','2025-07-26 21:06:00','seat','ACTIVE'),(44,36,42,'2025-08-02 22:17:00','2025-08-03 22:17:00','2025-07-25 22:17:00','2025-07-26 22:17:00','seat','ACTIVE'),(45,37,43,'2025-07-29 08:40:00','2025-07-29 10:40:00','2025-07-25 10:41:00','2025-07-27 10:41:00','both','ACTIVE'),(46,38,44,'2025-08-05 10:49:00','2025-08-06 10:49:00','2025-07-24 10:49:00','2025-07-27 10:49:00','seat','ACTIVE'),(47,39,45,'2025-07-27 11:31:00','2025-07-28 11:31:00','2025-07-25 11:31:00','2025-07-26 11:31:00','seat','ACTIVE');
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
-- Table structure for table `tbl_tracking_event_upcoming`
--

DROP TABLE IF EXISTS `tbl_tracking_event_upcoming`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_tracking_event_upcoming` (
  `tracking_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `tracking_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tracking_id`),
  UNIQUE KEY `unique_user_event` (`user_id`,`event_id`),
  KEY `fk_tracking_user` (`user_id`),
  KEY `fk_tracking_event` (`event_id`),
  CONSTRAINT `fk_tracking_event` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tracking_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_tracking_event_upcoming`
--

LOCK TABLES `tbl_tracking_event_upcoming` WRITE;
/*!40000 ALTER TABLE `tbl_tracking_event_upcoming` DISABLE KEYS */;
INSERT INTO `tbl_tracking_event_upcoming` VALUES (6,77,14,'2025-07-06 05:07:54'),(7,77,15,'2025-07-06 05:16:08'),(9,77,18,'2025-07-08 11:24:01'),(10,77,21,'2025-07-17 13:57:54'),(11,77,36,'2025-07-25 14:04:31');
/*!40000 ALTER TABLE `tbl_tracking_event_upcoming` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user`
--

LOCK TABLES `tbl_user` WRITE;
/*!40000 ALTER TABLE `tbl_user` DISABLE KEYS */;
INSERT INTO `tbl_user` VALUES (2,'$2a$10$vO4.s7XVuU4wXmzVmFkKvO3ycefMy2T8zyimUQDIazGmLMZGupmxa','Jane Smith',NULL,NULL,'0987654321','jane@example.com',1,20,'2025-05-28 14:07:14','2025-05-29 15:22:14','system','system',NULL),(3,'$2a$10$vO4.s7XVuU4wXmzVmFkKvO3ycefMy2T8zyimUQDIazGmLMZGupmxa','Administrator',NULL,NULL,'0111222333','admin@example.com',1,30,'2025-05-28 14:07:14','2025-05-29 15:22:14','system','system',NULL),(4,'$2a$10$vO4.s7XVuU4wXmzVmFkKvO3ycefMy2T8zyimUQDIazGmLMZGupmxa','User One',NULL,NULL,'0222333444','user1@example.com',1,15,'2025-05-28 14:07:14','2025-05-29 15:22:14','system','system',NULL),(5,'$2a$10$vO4.s7XVuU4wXmzVmFkKvO3ycefMy2T8zyimUQDIazGmLMZGupmxa','User Two',NULL,NULL,'0333444555','user2@example.com',1,25,'2025-05-28 14:07:14','2025-05-29 15:22:14','system','system',NULL),(28,'$2a$10$Yssv3tdJ3t5w.F2dcUiL3O6MDPG0d3YykgsOFnY.2NEeD4CicDfDy','levangiabao',NULL,'2004-06-03','0352039921','giabao362020114@gmail.com',1,0,'2025-05-29 16:13:29','2025-05-29 16:13:29',NULL,NULL,NULL),(36,'$2a$10$4Y46r7L8TNLRIpJDZFMEZeXNyjcgpVdbEpxr85XhHXWjehVjNoVuG','John Doe',NULL,'2000-01-01','0912345678','john.doe@example.com',1,0,'2025-06-01 08:34:29','2025-06-01 08:34:29',NULL,NULL,NULL),(39,'$2a$10$cKhy4bYP73NcjBJeJn8rveRdOJnz6nIzfR2H1sld1h8.kokp1zZha','Lê Văn Gia Bảo',NULL,'2025-06-01','0352038856','giabao362004@gmail.com',1,0,'2025-06-01 11:49:08','2025-06-01 11:49:08',NULL,NULL,NULL),(40,'$2a$10$XyYdC7.X7FfiONAkuUoRd.Oxly0bvwJDPYN1G9hO1INth..j7xq3.','Le Van Gia Bao',NULL,'2025-06-02','0352038856','giabao3620041@gmail.com',1,0,'2025-06-02 12:19:20','2025-06-02 12:19:20',NULL,NULL,NULL),(41,'$2a$10$jlbCIAZXHmOtbZc/b/12SuDfhETxRxtypvBwLVpqhc.ZQeA6T84/K','John Doe',NULL,'2000-01-01','0912345678','jane1@example.com',1,0,'2025-06-04 21:51:37','2025-06-04 21:51:37',NULL,NULL,NULL),(43,'$2a$10$IcJJOUDS/ztH4Ib9mcA0VOfMWSM1bp5.PTk83.pvDNPCJFakOU4.C','Le Van Gia Bao',NULL,'2025-06-04','0352038856','giabao1231@gmail.com',1,0,'2025-06-04 22:29:29','2025-06-04 22:29:29',NULL,NULL,NULL),(44,'$2a$10$5M5i9qoZBSIWSRa94Cce8.3bni3NFTGTWO4GJIPmVsrlAlfeQtCcu','Le Van Gia Bao',NULL,'2025-06-04','0914099824','giabaokk@gmail.com',1,0,'2025-06-04 22:43:06','2025-06-04 22:43:06',NULL,NULL,NULL),(45,'$2a$10$oG2Szjiy75fLRVR3agyu2OMN2od3r9xEU0mvGHYUw5nK9UXp032Fi','John Doe',NULL,'2000-01-01','0912345678','jan1e1@example.com',1,0,'2025-06-04 22:51:28','2025-06-04 22:51:28',NULL,NULL,NULL),(46,'$2a$10$TTKhkO6FY7iJ0ordbG2IB.cYcY9X6oODZBGGAZ708oIgxMQ9MOwMK','John Doe',NULL,'2000-01-01','0912345678','jan1e11@example.com',1,0,'2025-06-04 22:55:31','2025-06-04 22:55:31',NULL,NULL,NULL),(47,'$2a$10$NCYt1ZFjxPeT06TZXadGo.ZecGENgJ9l45FwC6B77HyN0FUHO5OMm','John Doe',NULL,'2000-01-01','0912345678','jan1e111@example.com',1,0,'2025-06-04 22:57:33','2025-06-04 22:57:33',NULL,NULL,NULL),(48,'$2a$10$fKl4Ga/wYMEBilUdZssHHOObfDSAjZGFYM1VsMiuAR/3LsCYC5yby','John Doe',NULL,'2000-01-01','0912345678','jan1e1111@example.com',1,0,'2025-06-04 23:01:33','2025-06-04 23:01:33',NULL,NULL,NULL),(49,'$2a$10$ZsqFhltopM2WVrc3iFJbL.wijn4XsJ5xKfgP07kuFTzM.ec5635f.','John Doe',NULL,'2000-01-01','0912345678','jacn1e1111@example.com',1,0,'2025-06-04 23:03:44','2025-06-04 23:03:44',NULL,NULL,NULL),(50,'$2a$10$cniLZMoPdjX2GIwjK.iZLeCXQsr7pKYP8V0O/mD6aONrYWuGSSjte','Le Van Gia Hoang',NULL,'2013-02-04','0935203991','giabaoz3620014@gmail.com',1,0,'2025-06-04 23:33:22','2025-06-04 23:33:22',NULL,NULL,NULL),(51,'$2a$10$6YjwJfnThneSYz/ksalIYOYGpE6clSMS2i0YghfGz6svmTCN/xElG','John Doe',NULL,'2000-01-01','0912345678','jacn1ze1111@example.com',1,0,'2025-06-04 23:34:17','2025-06-04 23:34:17',NULL,NULL,NULL),(52,'$2a$10$iJY0EEc3N7mR1Rp2f4c0deXj/FMHdJlx06zR6d2JwTVJRdAYF14RK','Le Van Gia Hoang',NULL,'2013-02-04','0935203991','giabao1z3620014@gmail.com',1,0,'2025-06-04 23:37:53','2025-06-04 23:37:53',NULL,NULL,NULL),(53,'$2a$10$zbz8kg5Cwd1X1Ng6GSYOn.kbY6RQKuS.TtC0TfLdlIXozv7nXThEO','Le Van Gia Hoang',NULL,'2013-02-04','0935203991','giabaao1z3620014@gmail.com',1,0,'2025-06-04 23:38:32','2025-06-04 23:38:32',NULL,NULL,NULL),(54,'$2a$10$uzM4lRulwpd3jBG5ameYNeXV4fHb59mq8wYY8MrKulceOatzu8iCu','Le Van Gia Hoang',NULL,'2013-02-04','0935203991','giabaao1zz3620014@gmail.com',1,0,'2025-06-04 23:41:56','2025-06-04 23:41:56',NULL,NULL,NULL),(55,'$2a$10$0/jbmLAyEAeFIEPKmZs97OL6.HytjOVnRL18CG9NvxWLR5rZanqY2','asdfasdfasdf',NULL,'2025-05-28','0352039912','giabaao@gmail.com',1,0,'2025-06-04 23:49:42','2025-06-04 23:49:42',NULL,NULL,NULL),(56,'$2a$10$oJJ.wpJXr1EZcEuw6LUR1eVjTEUjHU.3KoDHE3mn2T556EfcLHsn.','GiaBao',NULL,'2025-05-27','0912022321','giabaook@gmail.com',1,0,'2025-06-04 23:56:22','2025-06-04 23:56:22',NULL,NULL,NULL),(57,'$2a$10$0/zLtYb0osr8EGZ896EUaea2vEOOQ3QYPj/XSDaPLFkQkb9PUNQea','John Doe',NULL,'2000-01-01','0912345678','jacna1ze1111@example.com',1,0,'2025-06-04 23:57:19','2025-06-04 23:57:19',NULL,NULL,NULL),(58,'$2a$10$e2/KG4AgQmQ/RjfAcZQYCOREUypTPWb4agxcaFWtQw5/moA.ZdW3u','John Doe',NULL,'2000-01-01','0912345678','jacna1cze1111@example.com',1,0,'2025-06-05 00:02:39','2025-06-05 00:02:39',NULL,NULL,NULL),(59,'$2a$10$AiumAyqalcsMs9Ahwfx99.9xfsoGCv2D6wwJGzkEvQKfb9DN1JNrq','John Doe',NULL,'2000-01-01','0912345678','jacbna1cze1111@example.com',1,0,'2025-06-05 00:04:42','2025-06-05 00:04:42',NULL,NULL,NULL),(60,'$2a$10$xbeiaznQ5QFBgNGAIIdp4ef3gOnQRWyoHz2h.hYd1zZ81rbdOWy0C','John Doe',NULL,'2000-01-01','0912345678','jacbna1czxe1111@example.com',1,0,'2025-06-05 00:10:42','2025-06-05 00:10:42',NULL,NULL,NULL),(61,'$2a$10$mr7jgGbpV1tGEoVcEpTXxeiJ.Z1l6BGAkskQnARW9vb.ZXE.53t7W','John Doe',NULL,'2000-01-01','0912345678','jacbna1czxe111@example.com',1,0,'2025-06-05 00:11:15','2025-06-05 00:11:15',NULL,NULL,NULL),(62,'$2a$10$WgkA1UMMnkOfxhD1e.E/TuRxJ0o.CGfUDBVWej2Kkxm7I7k1aucpy','John Doe',NULL,'2000-01-01','0912345678','jacba1czxe111@example.com',1,0,'2025-06-05 00:17:20','2025-06-05 00:17:20',NULL,NULL,NULL),(63,'$2a$10$TErD2UNK.FHC9608vPNZsOOGB1RglXleGRFocsTW.8gEBPDASUgVW','Le Van Gia Bao',NULL,'2025-06-04','0352038856','giabcao362004@gmail.com',1,0,'2025-06-05 00:37:25','2025-06-05 00:37:25',NULL,NULL,NULL),(64,'GOOGLE','Bảo Lê','https://lh3.googleusercontent.com/a/ACg8ocK47Pq32UP3Dk6mnwbzf_Fb7Sb5ullD1BqzC1-81qWhiTad1TI=s96-c',NULL,NULL,'giabaoworking362004@gmail.com',1,0,'2025-06-08 17:05:01','2025-06-08 17:05:01',NULL,NULL,'117286615578928784419'),(65,'GOOGLE','Tw Trí','https://res.cloudinary.com/dbpchaamx/image/upload/v1752720316/avatars/user_65.jpg',NULL,NULL,'trikun2k4@gmail.com',1,0,'2025-06-10 15:21:49','2025-06-10 15:21:49',NULL,NULL,'106250994131249737773'),(66,'$2a$10$B7xxwcQmPZcvgLqA7mFNeebC6FlrxlgaTEHFvD9tf3xbcNAbWMPeO','ee',NULL,'2010-01-02','0836020944','gokun9x@gmail.com',1,0,'2025-06-10 16:35:42','2025-06-10 16:35:42',NULL,NULL,NULL),(72,'123456','John Doe','https://example.com/profile.jpg','1990-01-01','1234567890','admin32@example.com',1,0,'2025-06-10 10:13:47','2025-06-10 10:13:47',NULL,NULL,NULL),(73,'$2a$10$JMDuVPOoZqBsaZh/JLu4t.6IzhRNApLchIM64AHQU27QK1W2V9Mk6','ee',NULL,'2010-01-02','0836020944','gokun2k4@gmail.com',1,0,'2025-06-10 17:26:09','2025-06-10 17:26:09',NULL,NULL,NULL),(74,'GOOGLE','kk tri','https://res.cloudinary.com/dbpchaamx/image/upload/v1749734835/avatars/user_74.jpg',NULL,NULL,'trilearn11@gmail.com',1,20,'2025-06-12 15:59:15','2025-06-12 15:59:15',NULL,NULL,'118028385234479742417'),(75,'$2a$10$.dsCQDL4JQCkQ4pyM9R83ezQCKyY.MNxK5tec0//9SpLGmZThE8gm','Gia Bao',NULL,'2007-02-15','0914099213','giabao111@gmail.com',1,0,'2025-06-19 13:02:56','2025-06-19 13:02:56',NULL,NULL,NULL),(76,'$2a$10$nIlY6gtjn24lykKlN9qyxON5cwWKg8fvggxEzF1OA3a0zlpLrz63.','tri',NULL,'2024-01-19','0836020944','tritvvde181029@fpt.edu.vn',1,0,'2025-06-19 22:20:34','2025-06-19 22:20:34',NULL,NULL,NULL),(77,'GOOGLE','kun Tw','https://lh3.googleusercontent.com/a/ACg8ocL0Hn0_ZyxnF1NShmp1NNZ1jQqP_0Np-cbwkHy63Z-CWYlI0Q=s96-c',NULL,NULL,'twkun11@gmail.com',1,160,'2025-07-03 15:28:27','2025-07-03 15:28:27',NULL,NULL,'117966265490344660743'),(78,'GOOGLE','ATSH QLKS','https://lh3.googleusercontent.com/a/ACg8ocKM4W5BQ-FKZEEsBC-Ul-ltqMBtCFzFgumozPtto-FlLIfn0w=s96-c',NULL,NULL,'atshqlks@gmail.com',1,0,'2025-07-17 09:48:21','2025-07-17 09:48:21',NULL,NULL,'111557894029769562778');
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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_role`
--

LOCK TABLES `tbl_user_role` WRITE;
/*!40000 ALTER TABLE `tbl_user_role` DISABLE KEYS */;
INSERT INTO `tbl_user_role` VALUES (2,2,2),(3,3,1),(4,4,2),(5,5,1),(7,39,2),(8,40,2),(9,41,2),(10,43,2),(11,44,2),(12,45,2),(13,46,2),(14,47,2),(15,48,2),(16,49,2),(17,50,2),(18,51,2),(19,52,2),(20,53,2),(21,54,2),(22,55,2),(23,56,2),(24,57,2),(25,58,2),(26,59,2),(27,60,2),(28,61,2),(29,62,2),(30,63,2),(31,66,3),(32,73,1),(33,74,2),(34,75,2),(35,76,2),(36,65,2),(37,77,2),(38,78,2),(39,74,3);
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `is_used` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_voucher_id`),
  KEY `user_id` (`user_id`),
  KEY `voucher_id` (`voucher_id`),
  CONSTRAINT `tbl_user_voucher_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`),
  CONSTRAINT `tbl_user_voucher_ibfk_2` FOREIGN KEY (`voucher_id`) REFERENCES `tbl_voucher` (`voucher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_voucher`
--

LOCK TABLES `tbl_user_voucher` WRITE;
/*!40000 ALTER TABLE `tbl_user_voucher` DISABLE KEYS */;
INSERT INTO `tbl_user_voucher` VALUES (1,77,1,1),(2,77,2,1),(3,77,3,1),(4,77,11,1),(5,77,4,1),(6,77,5,0),(7,77,6,0);
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
  `status` int DEFAULT '1',
  PRIMARY KEY (`voucher_id`),
  UNIQUE KEY `voucher_code` (`voucher_code`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_voucher`
--

LOCK TABLES `tbl_voucher` WRITE;
/*!40000 ALTER TABLE `tbl_voucher` DISABLE KEYS */;
INSERT INTO `tbl_voucher` VALUES (1,'WELCOME10','Welcome Discount 10%','Giảm 10% cho khách hàng mới',0,10000.00,'2025-07-01','2025-12-31',1),(2,'SUMMER2025','Summer Sale 20%','Khuyến mãi hè 2025 - Giảm 20%',50,20000.00,'2025-07-01','2025-08-31',1),(3,'VIP50','VIP Discount 50K','Giảm trực tiếp 50,000đ cho khách VIP',100,50000.00,'2025-07-01','2025-12-31',1),(4,'FREESHIP','Free Shipping','Miễn phí vận chuyển cho đơn hàng bất kỳ',0,30000.00,'2025-07-01','2025-09-30',1),(5,'NEWYEAR2026','New Year 2026 Gift','Ưu đãi chào năm mới 2026',20,15000.00,'2025-12-15','2026-01-15',1),(6,'LOYAL100','Loyalty Bonus 100K','Thưởng khách hàng thân thiết 100K',200,100000.00,'2025-07-01','2025-12-31',1),(7,'FLASH5','Flash Sale 5%','Giảm 5% cho tất cả đơn hàng trong 1 ngày',0,5000.00,'2025-07-05','2025-07-05',1),(8,'BIRTHDAY','Birthday Gift 20K','Tặng 20K cho khách có sinh nhật trong tháng',0,20000.00,'2025-07-01','2025-12-31',1),(9,'REFERRAL','Referral Bonus','Ưu đãi cho khách giới thiệu bạn bè',30,30000.00,'2025-07-01','2025-12-31',1),(10,'BLACKFRIDAY','Black Friday Deal 30%','Ưu đãi Black Friday giảm 30%',0,30000.00,'2025-11-28','2025-11-28',1),(11,'NEWZLP','Chào 18/7','sử dụng 1 lần',10,50000.00,'2025-07-17','2025-07-19',1);
/*!40000 ALTER TABLE `tbl_voucher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_wishlist`
--

DROP TABLE IF EXISTS `tbl_wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_wishlist` (
  `wishlist_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wishlist_id`),
  UNIQUE KEY `user_id` (`user_id`,`event_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `tbl_wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`),
  CONSTRAINT `tbl_wishlist_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_wishlist`
--

LOCK TABLES `tbl_wishlist` WRITE;
/*!40000 ALTER TABLE `tbl_wishlist` DISABLE KEYS */;
INSERT INTO `tbl_wishlist` VALUES (14,74,19,'2025-07-13 15:55:34'),(17,74,20,'2025-07-14 10:06:12'),(18,74,17,'2025-07-14 10:23:40'),(19,74,21,'2025-07-14 11:08:11'),(24,77,20,'2025-07-16 14:53:06'),(27,77,31,'2025-07-25 06:57:16'),(28,77,32,'2025-07-25 06:57:17'),(38,77,30,'2025-07-27 11:28:48');
/*!40000 ALTER TABLE `tbl_wishlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_withdraw_request`
--

DROP TABLE IF EXISTS `tbl_withdraw_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_withdraw_request` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `organizer_id` int NOT NULL,
  `event_id` int NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `bank_account_name` varchar(100) NOT NULL,
  `bank_account_number` varchar(50) NOT NULL,
  `bank_name` varchar(100) NOT NULL,
  `note` text,
  `status` enum('PENDING','CONFIRMED','CANCELLED') DEFAULT 'PENDING',
  `rejection_reason` text,
  `requested_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `processed_at` datetime DEFAULT NULL,
  `showing_time_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `organizer_id` (`organizer_id`),
  KEY `event_id` (`event_id`),
  KEY `fk_showing_time` (`showing_time_id`),
  CONSTRAINT `fk_showing_time` FOREIGN KEY (`showing_time_id`) REFERENCES `tbl_showing_time` (`showing_time_id`),
  CONSTRAINT `tbl_withdraw_request_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `tbl_organizer` (`organizer_id`),
  CONSTRAINT `tbl_withdraw_request_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`),
  CONSTRAINT `tbl_withdraw_request_chk_1` CHECK ((`amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_withdraw_request`
--

LOCK TABLES `tbl_withdraw_request` WRITE;
/*!40000 ALTER TABLE `tbl_withdraw_request` DISABLE KEYS */;
INSERT INTO `tbl_withdraw_request` VALUES (4,1,6,120000.00,'Argibank3','213123123123123','ÂBC','hg','CANCELLED','\"không thích\"','2025-07-09 21:54:09','2025-07-09 22:01:44',6),(5,1,6,120000.00,'Argibank3','213123123123123','ÂBC','ád','PENDING',NULL,'2025-07-09 22:22:11',NULL,6),(6,1,21,1054000.00,'Argibank3','213123123123123','ÂBC','a','PENDING',NULL,'2025-07-17 14:08:00',NULL,28);
/*!40000 ALTER TABLE `tbl_withdraw_request` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_zone`
--

LOCK TABLES `tbl_zone` WRITE;
/*!40000 ALTER TABLE `tbl_zone` DISABLE KEYS */;
INSERT INTO `tbl_zone` VALUES (1,3,'VIP','Vip 1',0,149,150,120,110,120000.00),(2,3,'VIP','VIP 2',240,149,180,120,110,120000.00),(3,3,'Standard','VIP 3',30,0,360,90,110,80000.00),(4,4,'VIP','A',30,180,150,60,6,120000.00),(5,4,'Standard','a',30,60,90,60,6,80000.00),(6,5,'VIP','VIP 2',30,119,360,120,100,120000.00),(7,24,'Standard','A',0,180,800,270,1000,80000.00),(8,26,'VIP','A',30,120,240,150,100,120000.00),(9,27,'VIP','Vip1',0,90,240,60,100,120000.00),(10,27,'Standard','Vip2',240,90,90,60,100,80000.00),(11,27,'Cùi','Vip3',0,150,330,150,99,30000.00),(12,36,'CUi','Khu vip',60,89,90,210,10,70000.00),(13,37,'VIP','Khán đài A',0,60,90,210,100,120000.00),(14,37,'Standard','Khan Dai B',210,60,90,210,98,80000.00),(15,37,'Standard','Khan Dai C',0,0,300,60,100,80000.00),(16,37,'D','Khan Dai D',0,269,300,60,100,80000.00),(17,39,'Cùi','Nhà Nhi',180,180,120,210,99,80000.00),(18,39,'Premium','Nhà Phát',0,120,480,60,100,150000.00),(19,40,'VIP','A',0,60,360,210,100,120000.00);
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

-- Dump completed on 2025-07-27 19:08:22
