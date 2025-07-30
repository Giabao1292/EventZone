CREATE TABLE tbl_event_view (
    event_view_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES tbl_user(user_id),
    FOREIGN KEY (event_id) REFERENCES tbl_event(event_id)
);