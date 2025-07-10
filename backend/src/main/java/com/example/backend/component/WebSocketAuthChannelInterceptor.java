package com.example.backend.component;

import com.example.backend.service.JwtService;
import com.example.backend.service.impl.UserDetailService;
import com.example.backend.util.TokenType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailService userDetailService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            List<String> authorizationHeaders = accessor.getNativeHeader("Authorization");
            String token = null;
            if (authorizationHeaders != null && !authorizationHeaders.isEmpty()) {
                String fullToken = authorizationHeaders.get(0);
                if (fullToken != null && fullToken.startsWith("Bearer ")) {
                    token = fullToken.substring(7);
                } else {
                    token = fullToken;
                }
            }
            if (token != null) {
                String username = jwtService.extractUsername(token, TokenType.ACCESS_TOKEN);
                UserDetails userDetails = userDetailService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);
                accessor.setUser(authentication);
                System.out.println("WebSocket Connected & Authenticated for user: " + username);
            } else {
                System.err.println("Invalid or missing JWT token for WebSocket connection. Connection denied.");
            }
        }
        return message;
    }
}