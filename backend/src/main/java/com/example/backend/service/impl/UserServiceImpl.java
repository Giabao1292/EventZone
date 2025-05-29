package com.example.backend.service.impl;

import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    @Override
    public UserDetailsService getUserDetailsService() {
        return username -> userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }
    @Override
    public void updateProfileByUsername(String username, UserUpdateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullname(request.getFullname());
        user.setPhone(request.getPhone());
        user.setDateOfBirth(request.getDateOfBirth()); // LocalDate đã parse tự động

        userRepository.save(user);
    }
}
