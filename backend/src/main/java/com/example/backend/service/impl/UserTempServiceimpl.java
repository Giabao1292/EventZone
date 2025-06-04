package com.example.backend.service.impl;

import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.model.UserTemp;
import com.example.backend.repository.UserTempRepository;
import com.example.backend.service.UserTempService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserTempServiceimpl implements UserTempService {
    private final PasswordEncoder passwordEncoder;
    private final UserTempRepository userTempRepository;

    @Override
    public UserTemp saveUser(RegisterRequest registerRequest) {
        UserTemp user = userTempRepository.findByEmail(registerRequest.getEmail()).orElse(new UserTemp());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setDateOfBirth(registerRequest.getDateOfBirth());
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setTokenExpiry(Instant.now().plusSeconds(60 * 60 * 24));
        userTempRepository.save(user);
        return user;
    }
}
