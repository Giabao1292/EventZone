package com.example.backend.service.impl;

import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.TokenResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.model.UserRole;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VerificationRepository;
import com.example.backend.service.AuthService;
import com.example.backend.service.JwtService;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final VerificationRepository verificationRepository;
    private final RoleRepository roleRepository;

    @Override
    public TokenResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        User user =  userRepository.findByUsername(request.getUsername()).orElseThrow();
        return TokenResponse.builder()
                .accessToken(jwtService.generateToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .roles(user.getTblUserRoles().stream().map(userRole -> userRole.getRole().getRoleName()).collect(Collectors.toList()))
                .build();
    }
    @Override
    public TokenResponse register(RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullname(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setDateOfBirth(registerRequest.getDateOfBirth());
        Role roleUser = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(roleUser);
        user.getTblUserRoles().add(userRole);
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return TokenResponse.builder()
                .accessToken(jwtService.generateToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .roles(user.getTblUserRoles().stream().map(role -> role.getRole().getRoleName()).collect(Collectors.toList()))
                .build();
    }

    @Override
    public void validateRegister(RegisterRequest request){
        validateRegisterRequest(request);
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ResourceNotFoundException("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResourceNotFoundException("Email already exists");
        }
        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new ResourceNotFoundException("Phone already exists");
        }
    }
}
