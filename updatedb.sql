
ALTER TABLE tbl_user ADD COLUMN provider_id VARCHAR(255);

CREATE TABLE tbl_token (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    access_token TEXT,
    refresh_token TEXT
);
Drop TABLE tbl_verification_token;-- (Update email)
CREATE TABLE tbl_verification_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    expiry_date DATETIME(6) NOT NULL,
    INDEX expiry_date_idx (expiry_date)
);

ALTER TABLE user DROP COLUMN enabled;