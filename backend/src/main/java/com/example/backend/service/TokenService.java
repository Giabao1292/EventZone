package com.example.backend.service;

import com.example.backend.model.Token;
import com.example.backend.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final TokenRepository tokenRepository;
    public int save(Token token){
        Optional<Token> optional = tokenRepository.findByUsername(token.getUsername());
        if(optional.isEmpty()){
            tokenRepository.save(token);
        }
        else{
            Token currentToken = optional.get();
            currentToken.setAccessToken(token.getAccessToken());
            currentToken.setRefreshToken(token.getRefreshToken());
            return currentToken.getTokenId();
        }
        return token.getTokenId();
    }
}
