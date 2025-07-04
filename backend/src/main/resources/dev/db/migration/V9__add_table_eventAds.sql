CREATE TABLE tbl_event_ads (
    id INT PRIMARY KEY AUTO_INCREMENT,

    event_id INT NOT NULL,
    organizer_id INT NOT NULL,

    -- Thời gian organizer yêu cầu quảng cáo
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    -- Thanh toán
    total_price DECIMAL(10, 2) NOT NULL,
    payment_gateway ENUM('PAYOS', 'VNPAY') NULL,
    payment_transaction_id VARCHAR(255) NULL,

    -- Trạng thái
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    rejection_reason TEXT,

    -- Refund tracking
    refund_status ENUM('NONE', 'REFUNDED', 'FAILED') DEFAULT 'NONE',
    refund_at DATETIME,

    -- Banner riêng nếu có
    banner_image_url VARCHAR(255),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (event_id) REFERENCES tbl_event(event_id),
    FOREIGN KEY (organizer_id) REFERENCES tbl_organizer(organizer_id)
);