package com.example.backend.service.impl;

import com.example.backend.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {


    @Value("${jwt.secretKey}")
    private String secretKey;

    @Value("${jwt.limit.day}")
    private Integer limitDay;

    @Value("${jwt.limit.hour}")
    private Integer limitHour;
    @Override
    public String extractUsername(String token) {
        return extractClaimsFromToken(token, Claims::getSubject);
    }

    @Override
    public Boolean validate(String token, UserDetails userDetails) {
        String name = extractUsername(token);
        return name.equals(userDetails.getUsername());
    }

    @Override
    public String generateToken(UserDetails userDetails){
        return generateToken(new HashMap<>(), userDetails, limitHour);
    }

    @Override
    public String generateRefreshToken(UserDetails userDetails){
        return generateToken(new HashMap<>(), userDetails, limitDay);
    }

    public String generateToken(Map<String, Object> claims, UserDetails userDetails, Integer limitTime) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * limitTime))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .signWith(getKey())
                .compact();
    }

    public Key getKey() {
        byte[] encodedKey = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(encodedKey);
    }

    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private <T> T extractClaimsFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

}
