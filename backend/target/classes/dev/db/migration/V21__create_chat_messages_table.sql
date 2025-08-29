CREATE TABLE tbl_chat_messages (
    chat_message_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) NOT NULL,
    event_id INT,
    `read` BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id) REFERENCES tbl_user(user_id),
    FOREIGN KEY (receiver_id) REFERENCES tbl_user(user_id),
    FOREIGN KEY (event_id) REFERENCES tbl_event(event_id)
);

-- Index for better performance
CREATE INDEX idx_chat_messages_sender_receiver ON tbl_chat_messages(sender_id, receiver_id);
CREATE INDEX idx_chat_messages_created_at ON tbl_chat_messages(created_at);
CREATE INDEX idx_chat_messages_read ON tbl_chat_messages(`read`); 