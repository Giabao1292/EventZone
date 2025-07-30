SET FOREIGN_KEY_CHECKS = 0;

-- Xóa bảng
DROP TABLE tbl_review;

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;
CREATE TABLE IF NOT EXISTS tbl_review (
                                          review_id INT AUTO_INCREMENT PRIMARY KEY,
                                          showing_time_id INT NOT NULL,
                                          user_id INT NOT NULL,
                                          rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TINYTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL,
    status ENUM('active', 'deleted') DEFAULT 'active',
    UNIQUE (showing_time_id, user_id),
    CONSTRAINT fk_review_showing_time FOREIGN KEY (showing_time_id)
    REFERENCES tbl_showing_time(showing_time_id),
    CONSTRAINT fk_review_user FOREIGN KEY (user_id)
    REFERENCES tbl_user(user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
