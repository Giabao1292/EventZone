UPDATE tbl_event_status
SET status_name = CASE status_id
                      WHEN 1 THEN 'DRAFT'
                      WHEN 2 THEN 'PENDING'
                      WHEN 6 THEN 'COMPLETED'
                      WHEN 7 THEN 'CANCELLED'
                      WHEN 3 THEN 'PUBLISHED'
                      WHEN 5 THEN 'ONGOING'
                      WHEN 4 THEN 'UPCOMING'
                      ELSE status_name
    END;
