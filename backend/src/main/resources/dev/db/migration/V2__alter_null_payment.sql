ALTER TABLE `tbl_booking`
    CHANGE COLUMN `payment_method` `payment_method` ENUM('VNPAY', 'MOMO', 'PAYOS') NULL ;
