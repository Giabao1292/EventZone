package com.example.backend.service;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JwtService {
    String generate(UserDetails userDetails);
    String extractUsername(String token);
    Boolean validate(String token, UserDetails userDetails);
}
