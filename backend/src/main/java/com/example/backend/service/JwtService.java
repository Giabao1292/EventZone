package com.example.backend.service;

import com.example.backend.util.TokenType;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String generateToken(UserDetails userDetails);
    String generateRefreshToken(UserDetails userDetails);
    String extractUsername(String token, TokenType type);
}
