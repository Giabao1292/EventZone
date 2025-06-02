package com.example.backend.service.impl;

import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterPassword;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.TokenResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.PasswordResetToken;
import com.example.backend.model.Role;
import com.example.backend.model.Token;
import com.example.backend.model.User;
import com.example.backend.model.UserRole;
import com.example.backend.repository.PasswordResetTokenRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VerificationRepository;
import com.example.backend.service.AuthService;
import com.example.backend.service.JwtService;
import com.example.backend.service.TokenService;
import com.example.backend.service.UserService;
import com.example.backend.util.TokenType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

import static com.example.backend.util.TokenType.REFRESH_TOKEN;

@Slf4j
@Service
@RequiredArgsConstructor
public  class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final VerificationRepository verificationRepository;
    private final RoleRepository roleRepository;
    private final TokenService tokenService;
    private final PasswordResetTokenRepository tokenRepository;

    @Override
    public TokenResponse authenticate(LoginRequest request) {
        log.info("authenticate");
        User user =  userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new UsernameNotFoundException(request.getUsername()));
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        tokenService.save(Token.builder().accessToken(accessToken).refreshToken(refreshToken).username(user.getUsername()).build());

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .roles(user.getTblUserRoles().stream().map(userRole -> userRole.getRole().getRoleName()).collect(Collectors.toList()))
                .build();
    }
    @Override
    public TokenResponse register(RegisterPassword registerRequest) {
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

    @Override
    public TokenResponse refreshToken(String refreshToken){
        String username = jwtService.extractUsername(refreshToken, REFRESH_TOKEN);
        User user = userRepository.findByUsername(username).orElseThrow(()-> new ResourceNotFoundException("User not found"));
        String accessToken = jwtService.generateToken(user);
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .roles(user.getTblUserRoles().stream().map(role -> role.getRole().getRoleName()).collect(Collectors.toList()))
                .build();
    }
    private void validateRegisterRequest(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ResourceNotFoundException("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResourceNotFoundException("Email already exists");
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public boolean resetPasswordWithToken(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token);

        if (resetToken == null || resetToken.isExpired()) {
            return false;
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(resetToken); // xóa token sau khi dùng

        return true;
    }


}
