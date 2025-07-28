package com.example.backend.controller;

import com.cloudinary.Cloudinary;
import com.example.backend.dto.request.*;
import com.example.backend.dto.response.*;
import com.example.backend.model.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRoleRepository;
import com.example.backend.service.JwtService;
import com.example.backend.service.UserBankAccountService;
import com.example.backend.service.UserService;
import com.example.backend.service.WishlistService;
import com.example.backend.util.TokenType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
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
    private final WishlistService wishlistService;
    private final UserBankAccountService userBankAccountService;

    // Helper method to extract and validate token
    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Thiếu hoặc định dạng token không hợp lệ");
        }
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token, TokenType.ACCESS_TOKEN);
        if (username == null) {
            throw new IllegalArgumentException("Token không hợp lệ");
        }
        return username;
    }

    @GetMapping("/profile")
    public ResponseData<UserDetailResponse> getProfile(HttpServletRequest request) {
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
        dto.setPoints(user.getScore());
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy thông tin hồ sơ thành công", dto);
    }


    @PutMapping("/profile")
    public ResponseData<UserDetailResponse> updateProfile(
            @RequestBody UserUpdateRequest updateRequest,
            HttpServletRequest request) {
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
        dto.setPoints(updatedUser.getScore());

        return new ResponseData<>(HttpStatus.OK.value(), "Cập nhật hồ sơ thành công", dto);
    }

    @PostMapping("/avatar")
    public ResponseData<String> updateAvatar(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) throws IOException {
        String username = extractToken(request);
        String imageUrl = userService.updateAvatar(username, file, cloudinary);
        return new ResponseData<>(HttpStatus.OK.value(), "Cập nhật avatar thành công", imageUrl);
    }

    @PutMapping("/change-password")
    public ResponseData<String> changePassword(
            @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest
    ) {
        String username = extractToken(httpRequest);
        userService.changePassword(username, request);
        return new ResponseData<>(HttpStatus.OK.value(), "Đổi mật khẩu thành công");
    }

    @PostMapping("/wishlist/{eventId}")
    public ResponseData<String> addToWishlist(
            @PathVariable Integer eventId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.addToWishlist(username, eventId);
        return new ResponseData<>(HttpStatus.OK.value(), "Đã thêm vào danh sách yêu thích");
    }

    @DeleteMapping("/wishlist/{eventId}")
    public ResponseData<String> removeFromWishlist(
            @PathVariable Integer eventId, HttpServletRequest request) {
        // giống add nhưng gọi removeToWishlist
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.removeFromWishlist(username, eventId);
        return new ResponseData<>(HttpStatus.OK.value(), "Đã xóa khỏi danh sách yêu thích");
    }

    @GetMapping("/wishlist")
    public ResponseData<Set<EventSummaryDTO>> getWishlist() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();      // đã hard-code hoặc lấy từ JWT
        Set<EventSummaryDTO> wishlist = userService.getWishlist(username);

        return new ResponseData<>(
                HttpStatus.OK.value(),
                "Wishlist fetched",
                wishlist
        );
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
    public ResponseData<?> updateUser(@PathVariable Integer id, @Valid @RequestBody UserRequestDTO userRequestDTO) {
        userService.updateUser(id, userRequestDTO);
        return new ResponseData<>(HttpStatus.OK.value(), "User updated successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseData<?> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Inactive user successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/roles")
    public ResponseData<?> getRoleName() {
        return new ResponseData<>(HttpStatus.OK.value(), "Get list user succesfully!", userService.getListRole());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/roles")
    public ResponseData<?> addRole(@RequestBody Map<String, Object> role) {
        userService.createRole(role.get("role").toString());
        return new ResponseData<>(HttpStatus.OK.value(), "Role created successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/top")
    public ResponseData<?> getTopBooking(Pageable pageable) {
        List<TopClientResponse> topClients = userService.getTopBooking(pageable);
        return new ResponseData<>(HttpStatus.OK.value(), "Top bookings fetched", topClients);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/banks")
    public ResponseData<?> getListBank(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<BankResponse> bankLists = userBankAccountService.getAllBank(email);
        return new ResponseData<>(HttpStatus.OK.value(), "Bank list fetched", bankLists);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @DeleteMapping("/banks/{bankId}")
    public ResponseData<?> deleteOrganizerBank(@PathVariable Integer bankId) {
        userBankAccountService.deleteBank(bankId);
        return new ResponseData<>(HttpStatus.OK.value(), "Bank deleted successfully");
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PostMapping("/banks")
    public ResponseData<?>  addBank(@RequestBody BankRequest bankRequest) {
        userBankAccountService.addBank(bankRequest);
        return new ResponseData<>(HttpStatus.OK.value(), "Bank added successfully");
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PatchMapping("/banks/{bankId}/default")
    public ResponseData<?> updateDefaultBank(@PathVariable Integer bankId){
        userBankAccountService.setDefault(bankId);
        return new ResponseData<>(HttpStatus.OK.value(), "Bank updated successfully");
    }
}