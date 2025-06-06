package com.example.backend.service;

import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.TokenResponse;
import com.example.backend.model.UserTemp;

public interface AuthService {
    TokenResponse authenticate(LoginRequest request);
    UserTemp register(RegisterRequest request);

    TokenResponse refreshToken(String refreshToken);

    TokenResponse verifyTokenRegister(String verifyToken);

    void handleForgotPassword(String email);

    void resetPassword(String token, String newPassword);
}
