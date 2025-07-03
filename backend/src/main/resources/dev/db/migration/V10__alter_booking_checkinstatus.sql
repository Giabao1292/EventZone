ALTER TABLE `event`.`tbl_booking`
    CHANGE COLUMN `checkin_status` `checkin_status` ENUM('CHECKED_IN', 'NOT_CHECKED_IN') NULL DEFAULT 'NOT_CHECKED_IN' ;
