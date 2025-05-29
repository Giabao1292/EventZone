package com.example.backend.service.impl;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.User;
import com.example.backend.model.VerificationToken;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VerificationRepository;
import com.example.backend.service.VerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class VerificationServiceImpl implements VerificationService {
    private final VerificationRepository verificationRepository;
    private final UserRepository userRepository;
    @Override
    public Boolean validateToken(String token) {
        VerificationToken verificationToken = verificationRepository.findByTokenAndExpiryDateAfter(token, Instant.now()).orElseThrow(() -> new ResourceNotFoundException("Token expired"));
        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        return true;
    }
}
