package com.example.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.dto.request.ChangePasswordRequest;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.EventSummaryDTO;
import com.example.backend.dto.response.TokenResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.JwtService;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.LinkedHashSet;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final EventRepository eventRepository;

    @Override
    public User findByUsername(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void updateProfileByUsername(String email, UserUpdateRequest request) {
        User user = findByUsername(email);
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
        User user = userRepository.findByEmail(username)
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

    @Override
    public TokenResponse saveUser(UserTemp userTemp) {
        User user = new User();
        user.setFullname(userTemp.getFullName());
        user.setPhone(userTemp.getPhone());
        user.setDateOfBirth(userTemp.getDateOfBirth());
        user.setEmail(userTemp.getEmail());
        user.setPassword(userTemp.getPassword());
        Role roleUser = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(roleUser);
        user.getTblUserRoles().add(userRole);
        userRepository.save(user);
        return TokenResponse.builder()
                .accessToken(jwtService.generateToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .roles(user.getTblUserRoles().stream().map(role -> role.getRole().getRoleName()).collect(Collectors.toList()))
                .build();
    }


    @Override
    public void addToWishlist(String username, Integer eventId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (user.getWishlist().add(event)) {
            userRepository.save(user);
        }
    }

    @Override
    public void removeFromWishlist(String username, Integer eventId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (user.getWishlist().remove(event)) {
            userRepository.save(user);
        }
    }

    @Override
    public Set<EventSummaryDTO> getWishlist(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getWishlist()
                .stream()
                .map(EventSummaryDTO::new)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

}