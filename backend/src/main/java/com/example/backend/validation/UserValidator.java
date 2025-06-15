package com.example.backend.validation;

import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserValidator {
    private final UserRepository userRepository;
    public void validateEmail(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResourceNotFoundException("Email already exists");
        }
    }
}
