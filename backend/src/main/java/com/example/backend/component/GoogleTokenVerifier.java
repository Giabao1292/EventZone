package com.example.backend.component;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class GoogleTokenVerifier {
    private final GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifier() {
        verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList("GOOGLE_CLIENT_ID"))
                .build();
    }

    public GoogleIdToken.Payload verifyToken(String idTokenString) {
        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                return idToken.getPayload();
            }
        } catch (Exception e) {
            throw new RuntimeException("Invalid ID token", e);
        }
        throw new RuntimeException("Invalid ID token");
    }
}
