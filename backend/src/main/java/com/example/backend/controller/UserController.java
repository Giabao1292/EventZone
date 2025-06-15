package com.example.backend.controller;

import com.cloudinary.Cloudinary;
import com.example.backend.dto.request.ChangePasswordRequest;
import com.example.backend.dto.request.OnCreate;
import com.example.backend.dto.request.UserRequestDTO;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.*;
import com.example.backend.model.Event;
import com.example.backend.model.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRoleRepository;
import com.example.backend.service.JwtService;
import com.example.backend.service.UserService;
import com.example.backend.util.RoleName;
import com.example.backend.util.TokenType;
import jakarta.persistence.criteria.Path;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final Cloudinary cloudinary;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;

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

    @GetMapping("/profile")
    public ResponseData<UserDetailResponse> getProfile(HttpServletRequest request) {
        try {
            String username = extractToken(request);
            User user = userService.findByUsername(username);
            // Chuyển entity sang DTO
            UserDetailResponse dto = new UserDetailResponse();
            dto.setFullname(user.getFullName());
            dto.setEmail(user.getEmail());
            dto.setUsername(user.getUsername());
            dto.setPhone(user.getPhone());
            dto.setProfileUrl(user.getProfileUrl());
            dto.setDateOfBirth(user.getDateOfBirth());
            dto.setId(user.getId());
            return new ResponseData<>(HttpStatus.OK.value(), "Profile retrieved successfully", dto);
        } catch (IllegalArgumentException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        } catch (RuntimeException e) {
            return new ResponseData<>(HttpStatus.NOT_FOUND.value(), e.getMessage());
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Failed to get profile: " + e.getMessage());
        }
    }


    @PutMapping("/profile")
    public ResponseData<UserDetailResponse> updateProfile(
            @RequestBody UserUpdateRequest updateRequest,
            HttpServletRequest request) {
        try {
            String username = extractToken(request);
            userService.updateProfileByUsername(username, updateRequest);
            User updatedUser = userService.findByUsername(username);

            // Chuyển sang DTO
            UserDetailResponse dto = new UserDetailResponse();
            dto.setFullname(updatedUser.getFullName());
            dto.setEmail(updatedUser.getEmail());
            dto.setUsername(updatedUser.getUsername());
            dto.setProfileUrl(updatedUser.getProfileUrl());
            dto.setPhone(updatedUser.getPhone());
            dto.setDateOfBirth(updatedUser.getDateOfBirth());

            return new ResponseData<>(HttpStatus.OK.value(), "Profile updated successfully", dto);
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
    @PutMapping("/change-password")
    public ResponseData<String> changePassword(
            @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest
    ) {
        String username = extractToken(httpRequest);
        userService.changePassword(username, request);
        return new ResponseData<>(HttpStatus.OK.value(), "Password changed successfully");
    }

    @PostMapping("/wishlist/{eventId}")
    public ResponseData<String> addToWishlist(
            @PathVariable Integer eventId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            userService.addToWishlist(username, eventId);
            return new ResponseData<>(HttpStatus.OK.value(), "Added to wishlist");
        } catch (RuntimeException e) {
            return new ResponseData<>(HttpStatus.NOT_FOUND.value(), e.getMessage());
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/wishlist/{eventId}")
    public ResponseData<String> removeFromWishlist(
            @PathVariable Integer eventId, HttpServletRequest request) {
        // giống add nhưng gọi removeToWishlist
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            userService.removeFromWishlist(username, eventId);
            return new ResponseData<>(HttpStatus.OK.value(), "Removed from wishlist");
        } catch (RuntimeException e) {
            return new ResponseData<>(HttpStatus.NOT_FOUND.value(), e.getMessage());
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Failed: " + e.getMessage());
        }
    }

    @GetMapping("/wishlist")
    public ResponseData<Set<EventSummaryDTO>> getWishlist() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();      // đã hard-code hoặc lấy từ JWT
            Set<EventSummaryDTO> wishlist = userService.getWishlist(username);

            return new ResponseData<>(
                    HttpStatus.OK.value(),
                    "Wishlist fetched",
                    wishlist
            );

        } catch (RuntimeException e) {
            return new ResponseData<>(HttpStatus.NOT_FOUND.value(), e.getMessage());

        } catch (Exception e) {
            return new ResponseData<>(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Failed: " + e.getMessage()
            );
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseData<?> getListUser(Pageable pageable, @RequestParam(name = "search", required = false) String... search) {
        PageResponse<UserResponseDTO> userList = userService.getListUser(pageable, search);
        return new ResponseData<>(HttpStatus.OK.value(), "Get list user succesfully!", userList);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseData<?> createUser(@Validated(OnCreate.class) @Valid @RequestBody UserRequestDTO userRequestDTO) {
        userService.createUser(userRequestDTO);
        return new ResponseData<>(HttpStatus.OK.value(), "User created successfully");
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseData<?> updateUser(@PathVariable Integer id, @Valid @RequestBody UserRequestDTO userRequestDTO){
        userService.updateUser(id, userRequestDTO);
        return new ResponseData<>(HttpStatus.OK.value(), "User updated successfully");
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseData<?> deleteUser(@PathVariable Integer id){
        userService.deleteUser(id);
        return new ResponseData<>(HttpStatus.OK.value(), "User deleted successfully");
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/roles")
    public ResponseData<?> getRoleName() {
        return new ResponseData<>(HttpStatus.OK.value(), "Get list user succesfully!", userService.getListRole());
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/roles")
    public ResponseData<?> addRole(@RequestBody Map<String, Object> role){
        userService.createRole(role.get("role").toString());
        return new ResponseData<>(HttpStatus.OK.value(), "Role created successfully");
    }
}