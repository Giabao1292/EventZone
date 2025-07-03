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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
