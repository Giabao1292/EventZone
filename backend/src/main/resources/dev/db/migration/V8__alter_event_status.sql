-- Tạm tắt kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM tbl_event_status;

INSERT INTO tbl_event_status (status_id, status_name) VALUES (1, 'DRAFT');
INSERT INTO tbl_event_status (status_id, status_name) VALUES (2, 'PENDING');
INSERT INTO tbl_event_status (status_id, status_name) VALUES (3, 'REJECTED');
INSERT INTO tbl_event_status (status_id, status_name) VALUES (4, 'APPROVED');

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;
