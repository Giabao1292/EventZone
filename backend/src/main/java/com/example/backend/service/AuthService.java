package com.example.backend.service;

import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterPassword;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.TokenResponse;
import com.example.backend.model.User;

import java.util.Optional;

public interface AuthService {
    TokenResponse authenticate(LoginRequest request);
    TokenResponse register(RegisterPassword request);
    void validateRegister(RegisterRequest request);

    TokenResponse refreshToken(String refreshToken);
    Optional<User> findByEmail(String email);
    boolean resetPasswordWithToken(String token, String newPassword);
}
