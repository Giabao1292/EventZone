package com.example.backend.service;

import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.TokenResponse;

public interface AuthService {
    TokenResponse authenticate(LoginRequest request);

    TokenResponse register(RegisterRequest request);
}
