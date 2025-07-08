ALTER TABLE tbl_review
    ADD COLUMN showing_time_id INT,
    ADD CONSTRAINT fk_review_showing_time FOREIGN KEY (showing_time_id) REFERENCES tbl_showing_time(showing_time_id);
