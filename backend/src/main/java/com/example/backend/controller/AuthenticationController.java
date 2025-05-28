package com.example.backend.controller;

import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.request.TokenRefreshRequest;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.dto.response.TokenResponse;
import com.example.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseData<TokenResponse> login(@RequestBody LoginRequest request){
        TokenResponse tokenResponse = authService.authenticate(request);
        return new ResponseData<>(HttpStatus.OK.value(),"Login successfully", tokenResponse);
    }
    @PostMapping("/register")
    public ResponseData<TokenResponse> register(@RequestBody RegisterRequest request){
        TokenResponse tokenResponse = authService.register(request);
        return null;
    }
//    @PostMapping("/refresh-token")
//    public ResponseData<TokenResponse> refreshToken(@RequestBody TokenRefreshRequest request) {
//        return ResponseEntity.ok(authService.refreshToken(request));
//    }
}
