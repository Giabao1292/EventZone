package com.example.backend.controller;

import com.cloudinary.utils.StringUtils;
import com.example.backend.component.GoogleTokenVerifier;
import com.example.backend.dto.request.*;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.dto.response.TokenResponse;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.User;
import com.example.backend.model.VerificationToken;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VerificationRepository;
import com.example.backend.service.*;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
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
    private final VerificationRepository verificationRepository;

    @PostMapping("/login")
    public ResponseData<TokenResponse> login(@Valid @RequestBody LoginRequest request){
        TokenResponse tokenResponse = authService.authenticate(request);
        return new ResponseData<>(HttpStatus.OK.value(),"Login successfully", tokenResponse);
    }

    @PostMapping("/register")
    public ResponseData<?> register(@Valid @RequestBody RegisterRequest request) throws MessagingException {
            authService.validateRegister(request);
            String token = verificationService.generateToken();
            verificationService.save(request.getEmail(), token);
            mailService.sendConfirmEmail(request.getEmail(), token);
            return new ResponseData<>(HttpStatus.CREATED.value(),"Register successfully. Please check your email to verify account", request);
    }

    @PostMapping("/verify-email")
    public ResponseData<TokenResponse> verifyEmail(@Valid @RequestBody RegisterPassword userRegister, HttpServletRequest request) throws MessagingException {
        TokenResponse tokenResponse = new TokenResponse();
        if(verificationService.validateToken((String)request.getHeader("X-Verify-Token"), userRegister.getEmail())){
            tokenResponse = authService.register(userRegister);
        }
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
    public ResponseData<TokenResponse> resendCode(@RequestBody Map<String, Object> request) throws MessagingException {
        TokenResponse tokenResponse = new TokenResponse();
        String email = request.get("email").toString();
        mailService.sendConfirmEmail(email, verificationService.resendToken(email));
        return new ResponseData<>(HttpStatus.OK.value(),"Resend email successfully");
    }

    @PostMapping("/logout")
    public ResponseData<TokenResponse> logout(HttpServletRequest request) throws MessagingException {
        return null;
    }

    @PostMapping("/forgot-password")
    public ResponseData<?> forgotPassword(@RequestBody ForgotPasswordRequest request) throws MessagingException {
        Optional<User> userOptional = authService.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return new ResponseData<>(HttpStatus.NOT_FOUND.value(), "Email not found", null);
        }

        String resetToken = verificationService.generateToken(); // có thể tái sử dụng hàm này
        verificationService.saveResetToken(userOptional.get(), resetToken); // bạn cần tạo hàm lưu token

        mailService.sendResetPasswordEmail(request.getEmail(), resetToken);

        return new ResponseData<>(HttpStatus.OK.value(), "Reset password email sent", null);
    }

    @PostMapping("/reset-password")
    public ResponseData<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean success = authService.resetPasswordWithToken(request.getToken(), request.getNewPassword());
        if (!success) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Invalid or expired token", null);
        }

        return new ResponseData<>(HttpStatus.OK.value(), "Password reset successfully", null);
    }

}
