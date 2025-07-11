CREATE TABLE tbl_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    redirect_path VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES tbl_user(user_id)
);
