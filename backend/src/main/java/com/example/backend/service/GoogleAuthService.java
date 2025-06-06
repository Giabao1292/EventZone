package com.example.backend.service;

import com.example.backend.dto.response.TokenResponse;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;


    public TokenResponse loginWithGoogle(String idToken) {
        GoogleIdToken.Payload payload = verify(idToken);
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user = optionalUser.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullname(name);
            newUser.setProfileUrl(pictureUrl);
            newUser.setProviderId(payload.getSubject()); // Google user ID
            newUser.setPassword("GOOGLE"); // placeholder password
            // Gán role default nếu cần, ví dụ role USER
            // newUser.addRole(roleRepository.findByName("ROLE_USER"));
            return userRepository.save(newUser);
        });

        String token = jwtService.generateToken(user);
        return TokenResponse.builder()
                .accessToken(token)
                .refreshToken("refresh_token")
                .roles(user.getTblUserRoles().stream().map(role -> role.getRole().getRoleName()).toList())
                .build();
    }

    private GoogleIdToken.Payload verify(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(List.of(googleClientId))
                    .build();
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) throw new RuntimeException("Invalid ID Token");
            return idToken.getPayload();
        } catch (Exception e) {
            throw new RuntimeException("Google ID token verification failed", e);
        }
    }
}
