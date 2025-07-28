package com.example.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.dto.request.ChangePasswordRequest;
import com.example.backend.dto.request.UserRequestDTO;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.JwtService;
import com.example.backend.service.UserService;
import com.example.backend.validation.UserValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static com.example.backend.util.Comparable.userComparator;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final EventRepository eventRepository;
    private final SearchCriteriaRepository searchCriteriaRepository;
    private final UserValidator userValidator;
    private final UserRoleRepository userRoleRepository;
    private final WishlistRepository wishlistRepository;

    @Override
    public User findByUsername(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void updateProfileByUsername(String email, UserUpdateRequest request) {
        User user = findByUsername(email);
        user.setFullName(request.getFullname());
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

        Map uploadResult = cloudinary.uploader().upload(tempFile, ObjectUtils.asMap("folder", "avatars", "public_id", "user_" + user.getId(), "overwrite", true));

        String imageUrl = (String) uploadResult.get("secure_url");
        user.setProfileUrl(imageUrl);
        userRepository.save(user);
        return imageUrl;
    }

    @Override
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không đúng");
        }
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalArgumentException("Xác nhận mật khẩu mới không khớp");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public TokenResponse saveUser(UserTemp userTemp) {
        User user = new User();
        user.setFullName(userTemp.getFullName());
        user.setPhone(userTemp.getPhone());
        user.setDateOfBirth(userTemp.getDateOfBirth());
        user.setEmail(userTemp.getEmail());
        user.setPassword(userTemp.getPassword());
        Role roleUser = roleRepository.findByRoleName("USER").orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(roleUser);
        user.getTblUserRoles().add(userRole);
        userRepository.save(user);
        return TokenResponse.builder().accessToken(jwtService.generateToken(user)).refreshToken(jwtService.generateRefreshToken(user)).roles(user.getTblUserRoles().stream().map(role -> role.getRole().getRoleName()).collect(Collectors.toList())).build();
    }


    @Override
    public void addToWishlist(String username, Integer eventId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sự kiện"));

        // Kiểm tra đã tồn tại trong wishlist chưa
        if (wishlistRepository.existsByUserAndEvent(user, event)) {
            throw new IllegalStateException("Sự kiện đã có trong danh sách yêu thích");
        }

        // Tạo Wishlist mới
        Wishlist wishlistItem = Wishlist.builder()
                .user(user)
                .event(event)
                .build();
        wishlistRepository.save(wishlistItem);
    }

    @Transactional
    @Override
    public void removeFromWishlist(String username, Integer eventId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sự kiện"));

        Wishlist wishlist = wishlistRepository.findByUserAndEvent(user, event)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mục trong danh sách yêu thích"));

        wishlistRepository.delete(wishlist);  // <-- Xoá trực tiếp từ repository
    }


    @Override
    public Set<EventSummaryDTO> getWishlist(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        List<Wishlist> wishlistItems = wishlistRepository.findAllByUser(user);

        return wishlistItems.stream()
                .map(Wishlist::getEvent)
                .map(EventSummaryDTO::new)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private Page<User> findAllUser(Pageable pageable) {
        Page<Long> listUserIds = userRepository.findAllUserIds(pageable);
        return new PageImpl<User>(userRepository.findUsersToSearch(listUserIds.getContent()), pageable, listUserIds.getTotalElements());
    }
    @Override
    public PageResponse<UserResponseDTO> getListUser(Pageable pageable, String... search) {
        Page<User> users = search != null && search.length != 0 ? searchCriteriaRepository.searchUsers(pageable, search) : findAllUser(pageable);
        List<UserResponseDTO> userResponse = users.getContent().stream().map(user -> {
            return UserResponseDTO.builder()
                    .id(user.getId())
                    .fullName(user.getFullName())
                    .phone(user.getPhone())
                    .dateOfBirth(user.getDateOfBirth())
                    .email(user.getEmail())
                    .score(user.getScore())
                    .status(user.getStatus())
                    .roles(user.getTblUserRoles().stream().map(userRole -> userRole.getRole().getRoleName()).collect(Collectors.toSet()))
                    .build();
        }).collect(Collectors.toList());
        return PageResponse.<UserResponseDTO>builder().content(userResponse).size(users.getSize()).number(users.getNumber()).totalPages(users.getTotalPages()).totalElements((int) users.getTotalElements()).build();
    }

    @Override
    public void createUser(UserRequestDTO userRequestDTO) {
        userValidator.validateEmail(userRequestDTO.getEmail());
        User user = User.builder().email(userRequestDTO.getEmail()).phone(userRequestDTO.getPhone()).password(passwordEncoder.encode(userRequestDTO.getPassword())).dateOfBirth(userRequestDTO.getDateOfBirth()).fullName(userRequestDTO.getFullName()).status(userRequestDTO.getStatus()).build();
        //Luu De lay id
        userRepository.save(user);
        Set<UserRole> userRoles = new HashSet<>();
        for (String role : userRequestDTO.getRoles()) {
            Role roleEntity = roleRepository.findByRoleName(role).orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò"));
            UserRole userRole = new UserRole();
            userRole.setUser(user);
            userRole.setRole(roleEntity);
            userRoles.add(userRole);
        }
        user.setTblUserRoles(userRoles);
        userRepository.save(user);
    }
    @Transactional
    @Override
    public void updateUser(Integer id, UserRequestDTO userRequestDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        if(!user.getEmail().equals(userRequestDTO.getEmail())){
            userValidator.validateEmail(userRequestDTO.getEmail());
        }
        user.setPhone(userRequestDTO.getPhone());
        user.setFullName(userRequestDTO.getFullName());
        user.setDateOfBirth(userRequestDTO.getDateOfBirth());
        user.setEmail(userRequestDTO.getEmail());
        user.setStatus(userRequestDTO.getStatus());
        Set<UserRole> currentUserRoles = user.getTblUserRoles();
        Set<String> currentRoleName = currentUserRoles.stream().map(userRole -> userRole.getRole().getRoleName()).collect(Collectors.toSet());
        Set<String> requestRoleName = new HashSet<>(userRequestDTO.getRoles());
        Set<String> roleToAdd = new HashSet<>(requestRoleName);
        Set<String> roleToRemove = new HashSet<>(currentRoleName);
        roleToAdd.removeAll(currentRoleName);
        roleToRemove.removeAll(requestRoleName);
        roleToAdd.forEach(roleName ->{
            UserRole userRole = new UserRole();
            Role role = roleRepository.findByRoleName(roleName).get();
            userRole.setUser(user);
            userRole.setRole(role);
            userRoleRepository.save(userRole);
        });
        Set<UserRole> userRoleToRemove = currentUserRoles.stream().filter(userRole -> roleToRemove.contains(userRole.getRole().getRoleName())).collect(Collectors.toSet());
        userRoleToRemove.forEach(roleName ->{
            userRoleRepository.deleteUserRoleByUserIdAndRoleId(roleName.getUser().getId(), roleName.getRole().getId());
        });
        userRepository.save(user);
    }

    @Override
    public void deleteUser(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(0);
        userRepository.save(user);
    }
    @Override
    public void createRole(String roleName){
        Role role = new Role();
        role.setRoleName(roleName);
        roleRepository.save(role);
    }
    @Override
    public List<RoleResponseDTO> getListRole(){
        return roleRepository.findAll().stream()
                .map(role -> RoleResponseDTO.builder()
                        .roleName(role.getRoleName()).build()).toList();
    }


    @Override
    public List<TopClientResponse> getTopBooking(Pageable pageable) {
        List<Long> pageIds = userRepository.getTopClientIds(pageable);
        List<User> users = userRepository.getTopClienByIds(pageIds);
        List<TopClientResponse> topClients = new ArrayList<>(users.stream().map(user -> TopClientResponse.builder()
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .profileUrl(user.getProfileUrl())
                        .numberOfBookings(user.getTblBookings().size())
                        .expenditure(user.getTblBookings().stream()
                                .map(Booking::getFinalPrice)
                                .reduce(BigDecimal.ZERO, BigDecimal::add))
                        .status(user.getStatus())
                        .build())
                .toList());
        topClients.sort(userComparator);
        return topClients;
    }
}