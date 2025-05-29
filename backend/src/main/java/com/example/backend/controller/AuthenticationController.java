package com.example.backend.controller;

import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.request.TokenRefreshRequest;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.dto.response.TokenResponse;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.service.AuthService;
import com.example.backend.service.MailService;
import com.example.backend.service.UserService;
import com.example.backend.service.VerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
public class AuthenticationController {
    private final MailService mailService;
    private final AuthService authService;
    private final UserService userService;
    private final VerificationService verificationService;

    @PostMapping("/login")
    public ResponseData<TokenResponse> login(@Valid @RequestBody LoginRequest request){

        try {
            TokenResponse tokenResponse = authService.authenticate(request);
            return new ResponseData<>(HttpStatus.OK.value(),"Login successfully", tokenResponse);
        } catch (Exception e) {
            return new ResponseData(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @PostMapping("/register")
    public ResponseData<?> register(@Valid @RequestBody RegisterRequest request){
        try {
            UserResponseDTO userResponseDTO = authService.register(request);
            mailService.sendConfirmEmail(userResponseDTO.getEmail(), userResponseDTO.getVerifyToken());
            return new ResponseData<>(HttpStatus.CREATED.value(),"Register successfully. Please check your email");
        } catch (Exception e) {
            return new ResponseData(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @GetMapping("/verify-email")
    public ResponseData<TokenResponse> verifyEmail(@RequestParam(name = "token") String verifyToken){
        try{
            verificationService.validateToken(verifyToken);
            return new ResponseData<>(HttpStatus.OK.value(),"Verify email successfully");
        }
        catch (Exception e){
            return new ResponseData(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
//    @PostMapping("/refresh-token")
//    public ResponseData<TokenResponse> refreshToken(@RequestBody TokenRefreshRequest request) {
//        return ResponseEntity.ok(authService.refreshToken(request));
//    }
}
