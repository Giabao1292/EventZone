-- Migration để cập nhật organizer documents từ URL sang public_id
-- Chuyển đổi từ: https://res.cloudinary.com/dbpchaamx/image/upload/v1752736789/identity_docs/in4_organizer_74.jpg
-- Thành: identity_docs/in4_organizer_74

UPDATE tbl_organizer 
SET 
    id_card_front_url = CASE 
        WHEN id_card_front_url LIKE '%cloudinary.com%' 
        THEN SUBSTRING_INDEX(SUBSTRING_INDEX(id_card_front_url, '/upload/', -1), '.', 1)
        WHEN id_card_front_url LIKE 'v%/%' 
        THEN SUBSTRING_INDEX(id_card_front_url, '/', -1)
        ELSE id_card_front_url 
    END,
    id_card_back_url = CASE 
        WHEN id_card_back_url LIKE '%cloudinary.com%' 
        THEN SUBSTRING_INDEX(SUBSTRING_INDEX(id_card_back_url, '/upload/', -1), '.', 1)
        WHEN id_card_back_url LIKE 'v%/%' 
        THEN SUBSTRING_INDEX(id_card_back_url, '/', -1)
        ELSE id_card_back_url 
    END,
    business_license_url = CASE 
        WHEN business_license_url LIKE '%cloudinary.com%' 
        THEN SUBSTRING_INDEX(SUBSTRING_INDEX(business_license_url, '/upload/', -1), '.', 1)
        WHEN business_license_url LIKE 'v%/%' 
        THEN SUBSTRING_INDEX(business_license_url, '/', -1)
        ELSE business_license_url 
    END,
    org_logo_url = CASE 
        WHEN org_logo_url LIKE '%cloudinary.com%' 
        THEN SUBSTRING_INDEX(SUBSTRING_INDEX(org_logo_url, '/upload/', -1), '.', 1)
        WHEN org_logo_url LIKE 'v%/%' 
        THEN SUBSTRING_INDEX(org_logo_url, '/', -1)
        ELSE org_logo_url 
    END
WHERE 
    id_card_front_url LIKE '%cloudinary.com%' 
    OR id_card_back_url LIKE '%cloudinary.com%' 
    OR business_license_url LIKE '%cloudinary.com%' 
    OR org_logo_url LIKE '%cloudinary.com%'
    OR id_card_front_url LIKE 'v%/%'
    OR id_card_back_url LIKE 'v%/%'
    OR business_license_url LIKE 'v%/%'
    OR org_logo_url LIKE 'v%/%'; 