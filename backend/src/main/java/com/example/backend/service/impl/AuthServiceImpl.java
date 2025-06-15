package com.example.backend.service.impl;

import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.TokenResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.User;
import com.example.backend.model.UserTemp;
import com.example.backend.model.VerificationToken;
import com.example.backend.repository.*;
import com.example.backend.service.*;
import com.example.backend.validation.UserValidator;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.example.backend.util.TokenType.REFRESH_TOKEN;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository verificationTokenRepository;
    private final MailService mailService;
    private final UserTempRepository userTempRepository;
    private final UserTempService userTempService;
    private final UserValidator userValidator;
    @Override
    public TokenResponse authenticate(LoginRequest request) {
        log.info("authenticate");
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .roles(user.getTblUserRoles().stream().map(userRole -> userRole.getRole().getRoleName()).collect(Collectors.toList()))
                .build();
    }

    @Override
    public UserTemp register(RegisterRequest registerRequest) {
        userValidator.validateEmail(registerRequest.getEmail());
        UserTemp user = userTempService.saveUser(registerRequest);
        return user;
    }

    @Override
    public TokenResponse refreshToken(String refreshToken) {
        String username = jwtService.extractUsername(refreshToken, REFRESH_TOKEN);
        User user = userRepository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String accessToken = jwtService.generateToken(user);
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .roles(user.getTblUserRoles().stream().map(role -> role.getRole().getRoleName()).collect(Collectors.toList()))
                .build();
    }

    @Override
    public TokenResponse verifyTokenRegister(String verifyToken) {
        UserTemp user = userTempRepository.findByVerificationTokenAndTokenExpiryAfter(verifyToken, Instant.now()).orElseThrow(() -> new ResourceNotFoundException("Token đã hết hạn"));
        TokenResponse tokenResponse = userService.saveUser(user);
        userTempRepository.delete(user);
        return tokenResponse;
    }

    @Override
    public void handleForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy email"));

        String token = UUID.randomUUID().toString();

        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setEmail(user.getEmail());
        verificationToken.setToken(token);
        verificationToken.setExpiryDate(Instant.now().plusSeconds(15 * 60)); // hết hạn sau 15 phút
        verificationTokenRepository.save(verificationToken);

        try {
            mailService.sendResetPasswordEmail(user.getEmail(), token);  // gọi gửi mail reset password
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email đặt lại mật khẩu", e);
        }
    }


    @Override
    public void resetPassword(String token, String newPassword) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Token không hợp lệ"));

        if (verificationToken.getExpiryDate().isBefore(Instant.now())) { // ✅ Dùng Instant
            throw new RuntimeException("Token đã hết hạn");
        }

        User user = userRepository.findByEmail(verificationToken.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng tương ứng với token"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        verificationTokenRepository.delete(verificationToken);
    }
}
