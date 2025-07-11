CREATE TABLE tbl_withdraw_request (
                                  id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                  organizer_id INT NOT NULL,
                                  event_id INT NOT NULL,

                                  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),

    -- Thông tin ngân hàng
                                  bank_account_name VARCHAR(100) NOT NULL,      -- Tên chủ tài khoản
                                  bank_account_number VARCHAR(50) NOT NULL,     -- Số tài khoản
                                  bank_name VARCHAR(100) NOT NULL,              -- Tên ngân hàng (VD: Vietcombank, BIDV, ...)

                                  note TEXT,

                                  status ENUM('PENDING', 'CONFIRMED', 'REJECTED') DEFAULT 'PENDING',
                                  rejection_reason TEXT,

                                  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                  processed_at DATETIME,

                                  FOREIGN KEY (organizer_id) REFERENCES tbl_organizer(organizer_id),
                                  FOREIGN KEY (event_id) REFERENCES tbl_event(event_id)
);
