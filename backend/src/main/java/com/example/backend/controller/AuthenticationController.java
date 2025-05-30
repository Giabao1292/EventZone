package com.example.backend.controller;

import com.example.backend.component.GoogleTokenVerifier;
import com.example.backend.dto.request.GoogleLoginRequest;
import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.request.TokenRefreshRequest;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.dto.response.TokenResponse;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.*;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
public class AuthenticationController {
    private final MailService mailService;
    private final AuthService authService;
    private final GoogleAuthService googleAuthService;
    private final VerificationService verificationService;

    @PostMapping("/login")
    public ResponseData<TokenResponse> login(@Valid @RequestBody LoginRequest request){
        TokenResponse tokenResponse = authService.authenticate(request);
        return new ResponseData<>(HttpStatus.OK.value(),"Login successfully", tokenResponse);
    }
    @PostMapping("/register")
    public ResponseData<?> register(@Valid @RequestBody RegisterRequest request) throws MessagingException {
            UserResponseDTO userResponseDTO = authService.register(request);
            mailService.sendConfirmEmail(userResponseDTO.getEmail(), userResponseDTO.getVerifyToken());
            return new ResponseData<>(HttpStatus.CREATED.value(),"Register successfully. Please check your email");
    }
    @GetMapping("/verify-email")
    public ResponseData<TokenResponse> verifyEmail(@RequestParam(name = "token") String verifyToken){
        verificationService.validateToken(verifyToken);
        return new ResponseData<>(HttpStatus.OK.value(),"Verify email successfully");
    }
//    @PostMapping("/refresh-token")
//    public ResponseData<TokenResponse> refreshToken(@RequestBody TokenRefreshRequest request) {
//        return ResponseEntity.ok(authService.refreshToken(request));
//    }
    @PostMapping("/google")
    public ResponseData<TokenResponse> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
    TokenResponse tokenResponse = googleAuthService.loginWithGoogle(request.getIdToken());
    return new ResponseData<>(HttpStatus.OK.value(),"Login successfully", tokenResponse);
}

}
