-- Clean up invalid banner URLs
UPDATE tbl_event_ads 
SET banner_image_url = NULL 
WHERE banner_image_url IS NOT NULL 
  AND banner_image_url != '' 
  AND banner_image_url NOT LIKE 'http://%' 
  AND banner_image_url NOT LIKE 'https://%'; 