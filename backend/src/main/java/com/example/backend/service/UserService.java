package com.example.backend.service;

import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.UserResponseDTO;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {
    UserDetailsService getUserDetailsService();
}
