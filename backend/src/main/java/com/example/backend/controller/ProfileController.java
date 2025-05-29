package com.example.backend.controller;

import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.JwtService; // Nếu bạn dùng JwtService thay vì JwtUtils
import com.example.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtService jwtService; // Đổi tên từ JwtUtils thành JwtService nếu cần

    @GetMapping
    public ResponseData<?> getProfile(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return new ResponseData(HttpStatus.BAD_REQUEST.value(), "Missing token in Authorization header, or token is not prefixed with 'Bearer");
            }
            String token = authHeader.substring(7); // Bỏ chữ "Bearer "
            String username = jwtService.extractUsername(token); // Gọi hàm từ JwtService

            Optional<User> optionalUser = userRepository.findByUsername(username);
            if (optionalUser.isEmpty()) {
                return new ResponseData<>(HttpStatus.NOT_FOUND.value(), "User not found");
            }
            User user = optionalUser.get();
            return new ResponseData<>(HttpStatus.OK.value(),"Login successfully", user);
        } catch (Exception e) {
            return new ResponseData(HttpStatus.BAD_REQUEST.value(), "Failed to get profile: " + e.getMessage() );
        }
    }
    @PutMapping("")
    public ResponseData<?> updateProfile(
            @RequestBody UserUpdateRequest updateRequest,
            HttpServletRequest request
    ) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return new ResponseData<>(HttpStatus.UNAUTHORIZED.value(), "Missing or invalid token format");
            }

            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);

            // Cập nhật thông tin user
            userService.updateProfileByUsername(username, updateRequest);

            // Lấy lại thông tin user sau khi cập nhật
            Optional<User> optionalUser = userRepository.findByUsername(username);
            if (optionalUser.isEmpty()) {
                return new ResponseData<>(HttpStatus.NOT_FOUND.value(), "User not found after update");
            }

            return new ResponseData<>(HttpStatus.OK.value(), "Profile updated successfully", optionalUser.get());
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error updating profile: " + e.getMessage());
        }
    }


}
