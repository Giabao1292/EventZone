package com.example.backend.service;

import com.cloudinary.Cloudinary;
import com.example.backend.dto.request.ChangePasswordRequest;
import com.example.backend.dto.request.UserRequestDTO;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.*;
import com.example.backend.model.User;
import com.example.backend.model.UserTemp;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
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

    PageResponse<UserResponseDTO> getListUser(Pageable pageable, String... search);

    void createUser(UserRequestDTO userRequestDTO);

    void updateUser(Integer id, UserRequestDTO userRequestDTO);

    void deleteUser(Integer id);

    void createRole(String role);

    List<RoleResponseDTO> getListRole();
}