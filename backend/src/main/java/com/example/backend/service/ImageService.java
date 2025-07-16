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
        File tempFile = File.createTempFile("image-", file.getOriginalFilename());
        file.transferTo(tempFile);

        // Upload lên Cloudinary
        Map uploadResult = cloudinary.uploader().upload(tempFile, ObjectUtils.asMap(
                "folder", "uploads",
                "overwrite", true,
                "resource_type", "auto"
        ));

        // Xóa file tạm sau khi upload xong
        tempFile.delete();

        // Trả về đường dẫn ảnh
        return (String) uploadResult.get("secure_url");
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
