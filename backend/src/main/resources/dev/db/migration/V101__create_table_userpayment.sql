CREATE TABLE tbl_user_bank_account(
	payment_id int auto_increment primary key,
    bank_name varchar(255),
    account_number varchar(255),
	holder_name varchar(255),
    is_default INT DEFAULT 0,
    user_id int not null,
    FOREIGN KEY(user_id) references event.tbl_user(user_id)
)