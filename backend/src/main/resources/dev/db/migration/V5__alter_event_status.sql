UPDATE tbl_event_status
SET status_name = 'DRAFT' WHERE status_id = 1;

UPDATE tbl_event_status
SET status_name = 'PENDING' WHERE status_id = 2;

UPDATE tbl_event_status
SET status_name = 'REJECTED' WHERE status_id = 3;

UPDATE tbl_event_status
SET status_name = 'APPROVED' WHERE status_id = 4;
