package com.example.backend.service;

import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.TokenResponse;
import com.example.backend.dto.response.UserResponseDTO;

public interface AuthService {
    TokenResponse authenticate(LoginRequest request);
    UserResponseDTO register(RegisterRequest request);
}
