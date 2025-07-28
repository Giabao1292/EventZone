package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatConversationResponse {
    private Long partnerId;
    private String partnerName;
    private String partnerAvatar;
    private String partnerRole;
    private Integer eventId;
    private String eventTitle;
    private String lastMessage;
    private Long lastMessageSenderId;
    private LocalDateTime lastMessageTime;
    private boolean lastMessageRead;
    private Long unreadCount;
} 