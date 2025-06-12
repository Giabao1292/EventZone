
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

-- ****Tao them bang user_temp để lưu tạm thông tin người đăng ký***use event

CREATE TABLE tbl_user_temp (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    fullname VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    verification_token VARCHAR(100) NOT NULL,
    token_expiry DATETIME NOT NULL,
    UNIQUE KEY uniq_email_token (email, verification_token)
);

-- *** Xoá cột username, bây giờ username là email.
ALTER TABLE tbl_user
DROP COLUMN username;

-- chèn dữ liệu vào tbl_category
INSERT INTO tbl_category (category_name) VALUES
('Âm nhạc'),
('Thể thao'),
('Khác');




