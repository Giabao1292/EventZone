package com.example.backend.service;

import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterPassword;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.TokenResponse;

public interface AuthService {
    TokenResponse authenticate(LoginRequest request);
    TokenResponse register(RegisterPassword request);
    void validateRegister(RegisterRequest request);

    TokenResponse refreshToken(String refreshToken);
    void handleForgotPassword(String email);

    void resetPassword(String token, String newPassword);
}
