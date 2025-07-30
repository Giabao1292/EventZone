package com.example.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, Cloudinary cloudinary) throws IOException {
        // Tạo file tạm để upload
        File tempFile = File.createTempFile("upload-", file.getOriginalFilename());
        file.transferTo(tempFile);

        try {
            // Xác định resource type dựa trên content type
            String resourceType = "auto"; // Cloudinary sẽ tự động detect
            if (file.getContentType() != null) {
                if (file.getContentType().startsWith("video/")) {
                    resourceType = "video";
                } else if (file.getContentType().startsWith("image/")) {
                    resourceType = "image";
                }
            }

            // Upload lên Cloudinary với resource type phù hợp
            Map uploadResult = cloudinary.uploader().upload(tempFile, ObjectUtils.asMap(
                    "folder", "uploads",
                    "overwrite", true,
                    "resource_type", resourceType,
                    "public_id", "upload_" + UUID.randomUUID().toString().replace("-", "")
            ));

            // Trả về đường dẫn file
            return (String) uploadResult.get("secure_url");
        } finally {
            // Xóa file tạm sau khi upload xong
            if (tempFile.exists()) {
                tempFile.delete();
            }
        }
    }

    public String uploadQRCodeImage(byte[] imageBytes) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(
                imageBytes,
                ObjectUtils.asMap(
                        "resource_type", "image",
                        "folder", "uploads/qrcodes",
                        "public_id", "qrcodes/" + UUID.randomUUID(),
                        "overwrite", true
                )
        );

        return (String) uploadResult.get("public_id");
    }
    public String getQRCodeImageUrl(String publicId) {
        // Tạo URL từ public_id
        return cloudinary.url()
                .resourceType("image") // chỉ định loại resource là image
                .secure(true)          // dùng HTTPS
                .generate(publicId);
    }
}
