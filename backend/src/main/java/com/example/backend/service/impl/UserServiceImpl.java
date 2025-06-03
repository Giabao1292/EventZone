package com.example.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.dto.request.ChangePasswordRequest;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.Map;
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void updateProfileByUsername(String username, UserUpdateRequest request) {
        User user = findByUsername(username);
        user.setFullname(request.getFullname());
        user.setPhone(request.getPhone());
        user.setDateOfBirth(request.getDateOfBirth());
        userRepository.save(user);
    }
    @Override
    public String updateAvatar(String username, MultipartFile file, Cloudinary cloudinary) throws IOException {
        User user = findByUsername(username);

        // Upload to Cloudinary
        File tempFile = File.createTempFile("avatar-", file.getOriginalFilename());
        file.transferTo(tempFile);

        Map uploadResult = cloudinary.uploader().upload(tempFile, ObjectUtils.asMap(
                "folder", "avatars",
                "public_id", "user_" + user.getId(),
                "overwrite", true
        ));

        String imageUrl = (String) uploadResult.get("secure_url");
        user.setProfileUrl(imageUrl);
        userRepository.save(user);
        return imageUrl;
    }
    @Override
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalArgumentException("New password confirmation does not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

}