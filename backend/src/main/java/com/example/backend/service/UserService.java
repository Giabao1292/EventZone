package com.example.backend.service;

import com.cloudinary.Cloudinary;
import com.example.backend.dto.request.ChangePasswordRequest;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.EventSummaryDTO;
import com.example.backend.dto.response.TokenResponse;
import com.example.backend.model.Event;
import com.example.backend.model.User;
import com.example.backend.model.UserTemp;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

public interface UserService {
    User findByUsername(String username);
    void updateProfileByUsername(String username, UserUpdateRequest request);
    String updateAvatar(String username, MultipartFile file, Cloudinary cloudinary) throws IOException;
    void changePassword(String username, ChangePasswordRequest request);
    TokenResponse saveUser(UserTemp user);
    void addToWishlist(String username, Integer eventId);
    void removeFromWishlist(String username, Integer eventId);
    Set<EventSummaryDTO> getWishlist(String email);
}