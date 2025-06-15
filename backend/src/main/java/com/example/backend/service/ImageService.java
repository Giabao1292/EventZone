package com.example.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Service
public class ImageService {
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
}
