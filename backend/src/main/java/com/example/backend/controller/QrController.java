package com.example.backend.controller;

import com.cloudinary.Cloudinary;
import com.example.backend.model.Booking;
import com.example.backend.repository.BookingRepository;
import com.example.backend.service.BookingService;
import com.example.backend.service.ImageService;
import com.example.backend.service.QrCodeService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.Principal;
import java.util.Base64;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class QrController {
    private final Cloudinary cloudinary;
    private final BookingRepository bookingRepository;
    private final ImageService imageService;
    private final QrCodeService qrCodeService;

    @GetMapping("/{id}/qr-image")
    public ResponseEntity<String> getBookingQRImageBase64(@PathVariable Long id) throws IOException {
        Booking booking = bookingRepository.findById(id.intValue())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!booking.getUser().getUsername().equals(auth.getName())) {
            return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN).build();
        }

        String publicId = booking.getQrPublicId();
        String imageUrl = cloudinary.url().format("png").generate(publicId);

        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            byte[] imageBytes = inputStream.readAllBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            return ResponseEntity.ok("data:image/png;base64," + base64Image);
        }
    }
}