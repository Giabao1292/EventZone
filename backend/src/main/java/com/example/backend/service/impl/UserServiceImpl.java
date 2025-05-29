package com.example.backend.service.impl;

import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.User;
import com.example.backend.model.VerificationToken;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VerificationRepository;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    @Override
    public UserDetailsService getUserDetailsService() {
        return username -> userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }


}
