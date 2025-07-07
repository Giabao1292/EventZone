ALTER TABLE tbl_review
    ADD COLUMN updated_at DATETIME NULL AFTER created_at,
    ADD COLUMN status ENUM('active', 'deleted') DEFAULT 'active' AFTER updated_at,
    ADD CONSTRAINT unique_event_user UNIQUE (event_id, user_id),
    ADD CONSTRAINT check_rating CHECK (rating BETWEEN 1 AND 5);
