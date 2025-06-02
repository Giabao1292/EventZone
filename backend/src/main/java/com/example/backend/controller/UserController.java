package com.example.backend.controller;

import com.cloudinary.Cloudinary;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.model.User;
import com.example.backend.service.JwtService;
import com.example.backend.service.UserService;
import com.example.backend.util.TokenType;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final Cloudinary cloudinary;

    // Helper method to extract and validate token
    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid token format");
        }
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token, TokenType.ACCESS_TOKEN);
        if (username == null) {
            throw new IllegalArgumentException("Invalid token");
        }
        return username;
    }

    @GetMapping
    public ResponseData<User> getProfile(HttpServletRequest request) {
        try {
            String username = extractToken(request);
            User user = userService.findByUsername(username);
            return new ResponseData<>(HttpStatus.OK.value(), "Profile retrieved successfully", user);
        } catch (IllegalArgumentException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        } catch (RuntimeException e) {
            return new ResponseData<>(HttpStatus.NOT_FOUND.value(), e.getMessage());
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Failed to get profile: " + e.getMessage());
        }
    }

    @PutMapping
    public ResponseData<User> updateProfile(
            @RequestBody UserUpdateRequest updateRequest,
            HttpServletRequest request
    ) {
        try {
            String username = extractToken(request);
            userService.updateProfileByUsername(username, updateRequest);
            User updatedUser = userService.findByUsername(username);
            return new ResponseData<>(HttpStatus.OK.value(), "Profile updated successfully", updatedUser);
        } catch (IllegalArgumentException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        } catch (RuntimeException e) {
            return new ResponseData<>(HttpStatus.NOT_FOUND.value(), e.getMessage());
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error updating profile: " + e.getMessage());
        }
    }

    @PostMapping("/avatar")
    public ResponseData<String> updateAvatar(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) {
        try {
            String username = extractToken(request);
            String imageUrl = userService.updateAvatar(username, file, cloudinary);
            return new ResponseData<>(HttpStatus.OK.value(), "Avatar updated successfully", imageUrl);
        } catch (IllegalArgumentException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        } catch (RuntimeException e) {
            return new ResponseData<>(HttpStatus.NOT_FOUND.value(), e.getMessage());
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Failed to upload avatar: " + e.getMessage());
        }
    }
}