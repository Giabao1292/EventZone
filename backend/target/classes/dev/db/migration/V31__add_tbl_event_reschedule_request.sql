CREATE TABLE tbl_event_reschedule_request
(
    reschedule_request_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id              INT      NOT NULL,
    showing_time_id       INT      NOT NULL,
    old_start_time        DATETIME NOT NULL,
    old_end_time          DATETIME NOT NULL,
    requested_start_time  DATETIME NOT NULL,
    requested_end_time    DATETIME NOT NULL,
    requested_by_user_id  INT      NOT NULL,
    approved_by_user_id   INT,
    reason                TEXT,
    admin_note            TEXT,
    status_id             INT      NOT NULL,
    requested_at          DATETIME NOT NULL,
    responded_at          DATETIME,
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES tbl_event (event_id),
    CONSTRAINT fk_showing_time_reschedule FOREIGN KEY (showing_time_id) REFERENCES tbl_showing_time (showing_time_id),
    CONSTRAINT fk_requested_by FOREIGN KEY (requested_by_user_id) REFERENCES tbl_user (user_id),
    CONSTRAINT fk_approved_by FOREIGN KEY (approved_by_user_id) REFERENCES tbl_user (user_id),
    CONSTRAINT fk_status FOREIGN KEY (status_id) REFERENCES tbl_event_status (status_id)
);