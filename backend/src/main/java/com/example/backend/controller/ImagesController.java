package com.example.backend.controller;

import com.cloudinary.Cloudinary;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.service.ImageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/")
public class ImagesController {
    private final ImageService imageService;
    private final Cloudinary cloudinary;
    @PostMapping("/image")
    public ResponseData<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) throws IOException {
            String imageUrl = imageService.uploadImage(file,cloudinary);
            return new ResponseData<>(HttpStatus.OK.value(), "Upload hình ảnh thành công", imageUrl);
    }
}
