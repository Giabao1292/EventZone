package com.example.backend.controller;

import com.example.backend.dto.request.GoogleLoginRequest;
import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.dto.response.TokenResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.UserTemp;
import com.example.backend.repository.UserTempRepository;
import com.example.backend.repository.VerificationRepository;
import com.example.backend.service.AuthService;
import com.example.backend.service.GoogleAuthService;
import com.example.backend.service.MailService;
import com.example.backend.service.VerificationService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
public class AuthenticationController {
    private final MailService mailService;
    private final AuthService authService;
    private final GoogleAuthService googleAuthService;
    private final UserTempRepository userTempRepository;

    @PostMapping("/login")
    public ResponseData<TokenResponse> login(@Valid @RequestBody LoginRequest request){
        TokenResponse tokenResponse = authService.authenticate(request);
        return new ResponseData<>(HttpStatus.OK.value(),"Login successfully", tokenResponse);
    }

    @PostMapping("/register")
    public ResponseData<?> register(@Valid @RequestBody RegisterRequest request) throws MessagingException {
            UserTemp userTemp = authService.register(request);
            mailService.sendConfirmEmail(userTemp);
            return new ResponseData<>(HttpStatus.CREATED.value(),"Please check your email to verify account");
    }

    @GetMapping("/verify-email")
    public ResponseData<TokenResponse> verifyEmail(@RequestParam(name = "verifyToken") String verifyToken) throws MessagingException {
        TokenResponse tokenResponse = authService.verifyTokenRegister(verifyToken);
        return new ResponseData<>(HttpStatus.OK.value(),"Verify email successfully", tokenResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseData<TokenResponse> refreshToken(HttpServletRequest request) {
        TokenResponse tokenResponse = authService.refreshToken((String)request.getHeader("X-Refresh-Token"));
        return new ResponseData<>(HttpStatus.OK.value(),"Refresh token successfully", tokenResponse);
    }

    @PostMapping("/google")
    public ResponseData<TokenResponse> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
    TokenResponse tokenResponse = googleAuthService.loginWithGoogle(request.getIdToken());
    return new ResponseData<>(HttpStatus.OK.value(),"Login successfully", tokenResponse);
    }

    @PostMapping("/resend-code")
    public ResponseData<?> resendCode(@RequestBody Map<String, Object> request) throws MessagingException {
        String email = request.get("email").toString();
        UserTemp userTemp = userTempRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Expired time, please register again!"));
        mailService.sendConfirmEmail(userTemp);
        return new ResponseData<>(HttpStatus.OK.value(),"Resend email successfully");
    }
    @PostMapping("/logout")
    public ResponseData<TokenResponse> logout(HttpServletRequest request) throws MessagingException {
        return null;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        authService.handleForgotPassword(email);
        return ResponseEntity.ok("Vui lòng kiểm tra email để đặt lại mật khẩu.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token,
                                           @RequestParam String newPassword) {
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Mật khẩu đã được cập nhật thành công.");
    }
}
