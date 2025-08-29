package com.example.backend.service;

import com.example.backend.dto.request.ChatMessageRequest;
import com.example.backend.dto.response.ChatConversationResponse;
import com.example.backend.dto.response.ChatMessageResponse;
import com.example.backend.model.ChatMessage;
import com.example.backend.model.Event;
import com.example.backend.model.User;
import com.example.backend.repository.ChatMessageRepository;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ChatMessageResponse sendMessage(ChatMessageRequest request, Principal principal) {
        User sender = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User receiver = userRepository.findById(request.getReceiverId().intValue())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        ChatMessage message = ChatMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .messageType(ChatMessage.MessageType.valueOf(request.getMessageType()))
                .eventId(request.getEventId())
                .read(false)
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(message);
        
        // Send via WebSocket
        ChatMessageResponse response = convertToResponse(savedMessage);
        messagingTemplate.convertAndSendToUser(
                receiver.getEmail(),
                "/queue/chat",
                response
        );
        
        return response;
    }

    public List<ChatConversationResponse> getUserConversations(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get all conversations grouped by partner only (no event separation)
        List<ChatConversationResponse> conversations = new ArrayList<>();
        
        // Get all messages for the user
        List<ChatMessage> allMessages = chatMessageRepository.findAll().stream()
                .filter(msg -> msg.getSender().getId().equals(user.getId()) || 
                              msg.getReceiver().getId().equals(user.getId()))
                .collect(Collectors.toList());
        
        log.info("🔍 All messages for user {}: {} messages", user.getId(), allMessages.size());
        
        // Group by partner only (ignore eventId)
        Map<Integer, List<ChatMessage>> conversationGroups = allMessages.stream()
                .collect(Collectors.groupingBy(msg -> {
                    return msg.getSender().getId().equals(user.getId()) ? 
                            msg.getReceiver().getId() : msg.getSender().getId();
                }));
        
        log.info("🔍 Conversation groups: {} groups", conversationGroups.size());
        for (Map.Entry<Integer, List<ChatMessage>> entry : conversationGroups.entrySet()) {
            Integer partnerId = entry.getKey();
            List<ChatMessage> messages = entry.getValue();
            ChatMessage lastMessage = messages.stream()
                    .max(Comparator.comparing(ChatMessage::getCreatedAt))
                    .orElse(null);
            log.info("🔍 Partner {}: {} messages, last message: '{}' at {}", 
                    partnerId, messages.size(), 
                    lastMessage != null ? lastMessage.getContent() : "null",
                    lastMessage != null ? lastMessage.getCreatedAt() : "null");
        }
        
        // Build conversation response for each partner
        for (Map.Entry<Integer, List<ChatMessage>> entry : conversationGroups.entrySet()) {
            Integer partnerId = entry.getKey();
            
            // Get the latest message from this conversation
            ChatMessage lastMessage = entry.getValue().stream()
                    .max(Comparator.comparing(ChatMessage::getCreatedAt))
                    .orElse(null);
            
            if (lastMessage != null) {
                conversations.add(buildConversationResponseFromMessage(user.getId(), partnerId, null, lastMessage));
            }
        }
        
        // Sort conversations by last message time (newest first)
        conversations.sort((c1, c2) -> {
            if (c1.getLastMessageTime() == null && c2.getLastMessageTime() == null) {
                return 0;
            }
            if (c1.getLastMessageTime() == null) {
                return 1;
            }
            if (c2.getLastMessageTime() == null) {
                return -1;
            }
            return c2.getLastMessageTime().compareTo(c1.getLastMessageTime());
        });
        
        // Debug log for conversation order
        log.info("🔍 Conversations sorted by last message time:");
        for (int i = 0; i < conversations.size(); i++) {
            ChatConversationResponse conv = conversations.get(i);
            log.info("  {}: {} - '{}' at {}", 
                    i + 1, conv.getPartnerName(), 
                    conv.getLastMessage(), conv.getLastMessageTime());
        }
        
        return conversations;
    }

    public Page<ChatMessageResponse> getConversationMessages(
            Long partnerId, 
            Integer eventId, 
            Principal principal, 
            int page, 
            int size) {
        
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.info("🔍 Getting messages for user {} with partner {}, page {}, size {}", 
                user.getId(), partnerId, page, size);

        // Debug: Check all messages between these users first
        List<ChatMessage> allMessagesBetweenUsers = chatMessageRepository.findAll().stream()
                .filter(msg -> (msg.getSender().getId().equals(user.getId()) && msg.getReceiver().getId().equals(partnerId.intValue())) ||
                              (msg.getSender().getId().equals(partnerId.intValue()) && msg.getReceiver().getId().equals(user.getId())))
                .sorted(Comparator.comparing(ChatMessage::getCreatedAt))
                .collect(Collectors.toList());
        
        log.info("🔍 All messages between user {} and partner {}: {} messages", 
                user.getId(), partnerId, allMessagesBetweenUsers.size());
        for (int i = 0; i < allMessagesBetweenUsers.size(); i++) {
            ChatMessage msg = allMessagesBetweenUsers.get(i);
            log.info("  {}: '{}' at {} (sender: {})", 
                    i + 1, msg.getContent(), msg.getCreatedAt(), msg.getSender().getId());
        }

        // Simplified logic: Always get messages in DESC order (newest first)
        // Page 0: Latest messages, Page 1+: Older messages
        Page<ChatMessage> messages;
        log.info("🔍 Getting messages for page {} (DESC order - newest first)", page);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        messages = chatMessageRepository.findConversationBetweenUsers(
                user.getId(), partnerId.intValue(), pageable);
            
        log.info("🔍 Found {} messages for page {}", messages.getContent().size(), page);
        for (int i = 0; i < messages.getContent().size(); i++) {
            ChatMessage msg = messages.getContent().get(i);
                log.info("  {}: '{}' at {} (sender: {})", 
                        i + 1, msg.getContent(), msg.getCreatedAt(), msg.getSender().getId());
        }

        log.info("🔍 Found {} messages", messages.getTotalElements());
        
        // Debug: Log all messages to verify order
        log.info("🔍 All messages in conversation:");
        for (int i = 0; i < messages.getContent().size(); i++) {
            ChatMessage msg = messages.getContent().get(i);
            log.info("  {}: '{}' at {} (sender: {})", 
                    i + 1, msg.getContent(), msg.getCreatedAt(), msg.getSender().getId());
        }

        return messages.map(this::convertToResponse);
    }

    @Transactional
    public void markMessagesAsRead(Long partnerId, Integer eventId, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Always mark messages for general chat (no event separation)
        chatMessageRepository.markMessagesAsRead(
            user.getId(), 
            partnerId.intValue()
        );
    }

    public Long getUnreadMessageCount(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return chatMessageRepository.countUnreadMessagesForUser(user.getId());
    }

    public Integer getAdminUserId() {
        List<User> adminUsers = userRepository.findUserByRoleName("ADMIN");
        if (adminUsers.isEmpty()) {
            throw new RuntimeException("No admin user found");
        }
        return adminUsers.get(0).getId(); // Return first admin user
    }

    public List<User> getOrganizers() {
        return userRepository.findUserByRoleName("ORGANIZER");
    }

    public Integer getOrganizerUserId(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (event.getOrganizer() == null) {
            throw new RuntimeException("Event has no organizer");
        }
        
        // Lấy user_id của organizer, không phải organizer_id
        if (event.getOrganizer().getUser() == null) {
            throw new RuntimeException("Organizer has no associated user");
        }
        
        return event.getOrganizer().getUser().getId();
    }

    @Transactional
    public ChatMessageResponse createSupportConversation(Long receiverId, String content, Principal principal) {
        log.info("🔍 Creating support conversation: receiverId={}, content='{}'", receiverId, content);
        
        User sender = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        log.info("🔍 Sender found: {} (ID: {})", sender.getFullName(), sender.getId());
        
        // Kiểm tra receiver có tồn tại không
        if (!userRepository.existsById(receiverId.intValue())) {
            log.error("🔍 Receiver with ID {} not found in database", receiverId);
            throw new RuntimeException("Receiver with ID " + receiverId + " not found in database");
        }
        
        User receiver = userRepository.findById(receiverId.intValue())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        log.info("🔍 Receiver found: {} (ID: {})", receiver.getFullName(), receiver.getId());

        // Validate that receiver is either admin or organizer
        boolean isAdmin = receiver.getTblUserRoles().stream()
                .anyMatch(role -> "ADMIN".equals(role.getRole().getRoleName()));
        boolean isOrganizer = receiver.getTblUserRoles().stream()
                .anyMatch(role -> "ORGANIZER".equals(role.getRole().getRoleName()));
        
        log.info("🔍 Receiver roles - isAdmin: {}, isOrganizer: {}", isAdmin, isOrganizer);
        
        if (!isAdmin && !isOrganizer) {
            log.error("🔍 Receiver {} is not admin or organizer", receiver.getFullName());
            throw new RuntimeException("Receiver must be admin or organizer");
        }

        ChatMessage message = ChatMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .messageType(ChatMessage.MessageType.TEXT)
                .eventId(null) // Support conversation doesn't need event context
                .read(false)
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(message);
        
        // Send via WebSocket
        ChatMessageResponse response = convertToResponse(savedMessage);
        messagingTemplate.convertAndSendToUser(
                receiver.getEmail(),
                "/queue/chat",
                response
        );
        
        log.info("🔍 Support conversation created: {} -> {} with content: '{}'", 
                sender.getFullName(), receiver.getFullName(), content);
        
        return response;
    }

    private ChatConversationResponse buildConversationResponseFromMessage(Integer userId, Integer partnerId, Integer eventId, ChatMessage lastMessage) {
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));

        // Debug log
        log.info("🔍 Building conversation for user {} with partner {}: senderId={}, content={}, time={}", 
                userId, partnerId, lastMessage.getSender().getId(), lastMessage.getContent(), lastMessage.getCreatedAt());

        // Get unread count for general chat (no event separation)
        Long unreadCount = chatMessageRepository.findAll().stream()
                .filter(msg -> msg.getReceiver().getId().equals(userId) &&
                             msg.getSender().getId().equals(partnerId) &&
                             !msg.isRead())
                .count();

        return ChatConversationResponse.builder()
                .partnerId(partnerId.longValue())
                .partnerName(partner.getFullName())
                .partnerAvatar(partner.getProfileUrl())
                .partnerRole(getUserRole(partner))
                .eventId(null) // No event separation
                .eventTitle(null) // No event title
                .lastMessage(lastMessage.getContent())
                .lastMessageSenderId(lastMessage.getSender().getId().longValue())
                .lastMessageTime(lastMessage.getCreatedAt())
                .lastMessageRead(lastMessage.isRead())
                .unreadCount(unreadCount)
                .build();
    }

    private ChatMessageResponse convertToResponse(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSender().getId().longValue())
                .senderName(message.getSender().getFullName())
                .senderAvatar(message.getSender().getProfileUrl())
                .receiverId(message.getReceiver().getId().longValue())
                .receiverName(message.getReceiver().getFullName())
                .receiverAvatar(message.getReceiver().getProfileUrl())
                .content(message.getContent())
                .messageType(message.getMessageType().name())
                .eventId(message.getEventId())
                .eventTitle(message.getEventId() != null ? 
                        eventRepository.findById(message.getEventId()).map(Event::getEventTitle).orElse(null) : null)
                .read(message.isRead())
                .createdAt(message.getCreatedAt())
                .build();
    }

    private String getUserRole(User user) {
        // Lấy role từ user, có thể cần điều chỉnh theo cấu trúc thực tế
        if (user.getTblUserRoles() != null && !user.getTblUserRoles().isEmpty()) {
            return user.getTblUserRoles().iterator().next().getRole().getRoleName();
        }
        return "USER"; // Default role
    }
} 