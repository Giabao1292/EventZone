
DROP TABLE IF EXISTS `tbl_withdraw_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_withdraw_request` (
                                        `id` bigint NOT NULL AUTO_INCREMENT,
                                        `organizer_id` int NOT NULL,
                                        `event_id` int NOT NULL,
                                        `amount` decimal(12,2) NOT NULL,
                                        `note` text,
                                        `status` enum('PENDING','CONFIRMED','CANCELLED') DEFAULT 'PENDING',
                                        `rejection_reason` text,
                                        `requested_at` datetime DEFAULT CURRENT_TIMESTAMP,
                                        `processed_at` datetime DEFAULT NULL,
                                        `showing_time_id` int DEFAULT NULL,
                                        `payment_id` int DEFAULT NULL,
                                        PRIMARY KEY (`id`),
                                        KEY `organizer_id` (`organizer_id`),
                                        KEY `event_id` (`event_id`),
                                        KEY `fk_showing_time` (`showing_time_id`),
                                        KEY `fk_withdraw_payment` (`payment_id`),
                                        CONSTRAINT `fk_showing_time` FOREIGN KEY (`showing_time_id`) REFERENCES `tbl_showing_time` (`showing_time_id`),
                                        CONSTRAINT `fk_withdraw_payment` FOREIGN KEY (`payment_id`) REFERENCES `tbl_user_bank_account` (`payment_id`),
                                        CONSTRAINT `tbl_withdraw_request_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `tbl_organizer` (`organizer_id`),
                                        CONSTRAINT `tbl_withdraw_request_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`),
                                        CONSTRAINT `tbl_withdraw_request_chk_1` CHECK ((`amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
