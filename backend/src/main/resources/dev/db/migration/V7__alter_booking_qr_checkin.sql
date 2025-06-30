-- Xoá cột cũ
ALTER TABLE tbl_booking
DROP COLUMN qr_code_data;

-- Thêm 4 cột mới
ALTER TABLE tbl_booking
    ADD COLUMN qr_token VARCHAR(255),
ADD COLUMN qr_publicId VARCHAR(255),
ADD COLUMN checkin_status VARCHAR(50),
ADD COLUMN checkin_time DATETIME;
