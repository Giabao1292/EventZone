ALTER TABLE tbl_voucher
    ADD COLUMN status int default 1;

INSERT INTO tbl_voucher (voucher_code, voucher_name, description, required_points, discount_amount, valid_from, valid_until, status)
VALUES
    ('WELCOME10', 'Welcome Discount 10%', 'Giảm 10% cho khách hàng mới', 0, 10000.00, '2025-07-01', '2025-12-31', 1),
    ('SUMMER2025', 'Summer Sale 20%', 'Khuyến mãi hè 2025 - Giảm 20%', 50, 20000.00, '2025-07-01', '2025-08-31', 1),
    ('VIP50', 'VIP Discount 50K', 'Giảm trực tiếp 50,000đ cho khách VIP', 100, 50000.00, '2025-07-01', '2025-12-31', 1),
    ('FREESHIP', 'Free Shipping', 'Miễn phí vận chuyển cho đơn hàng bất kỳ', 0, 30000.00, '2025-07-01', '2025-09-30', 1),
    ('NEWYEAR2026', 'New Year 2026 Gift', 'Ưu đãi chào năm mới 2026', 20, 15000.00, '2025-12-15', '2026-01-15', 1),
    ('LOYAL100', 'Loyalty Bonus 100K', 'Thưởng khách hàng thân thiết 100K', 200, 100000.00, '2025-07-01', '2025-12-31', 1),
    ('FLASH5', 'Flash Sale 5%', 'Giảm 5% cho tất cả đơn hàng trong 1 ngày', 0, 5000.00, '2025-07-05', '2025-07-05', 1),
    ('BIRTHDAY', 'Birthday Gift 20K', 'Tặng 20K cho khách có sinh nhật trong tháng', 0, 20000.00, '2025-07-01', '2025-12-31', 1),
    ('REFERRAL', 'Referral Bonus', 'Ưu đãi cho khách giới thiệu bạn bè', 30, 30000.00, '2025-07-01', '2025-12-31', 1),
    ('BLACKFRIDAY', 'Black Friday Deal 30%', 'Ưu đãi Black Friday giảm 30%', 0, 30000.00, '2025-11-28', '2025-11-28', 1);