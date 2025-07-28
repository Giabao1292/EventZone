package com.example.backend.controller;

import com.example.backend.dto.request.ChatMessageRequest;
import com.example.backend.dto.response.ChatConversationResponse;
import com.example.backend.dto.response.ChatMessageResponse;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.model.User;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    
    private final ChatService chatService;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    @PostMapping("/send")
    public ResponseEntity<ResponseData<ChatMessageResponse>> sendMessage(
            @RequestBody ChatMessageRequest request,
            Principal principal) {
        try {
            ChatMessageResponse response = chatService.sendMessage(request, principal);
            return ResponseEntity.ok(new ResponseData<>(
                    HttpStatus.OK.value(),
                    "Message sent successfully",
                    response
            ));
        } catch (Exception e) {
            log.error("Error sending message: ", e);
            return ResponseEntity.badRequest().body(new ResponseData<>(
                    HttpStatus.BAD_REQUEST.value(),
                    "Error sending message: " + e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("/conversations")
    public ResponseEntity<ResponseData<List<ChatConversationResponse>>> getConversations(Principal principal) {
        try {
            List<ChatConversationResponse> conversations = chatService.getUserConversations(principal);
            return ResponseEntity.ok(new ResponseData<>(
                    HttpStatus.OK.value(),
                    "Conversations retrieved successfully",
                    conversations
            ));
        } catch (Exception e) {
            log.error("Error getting conversations: ", e);
            return ResponseEntity.badRequest().body(new ResponseData<>(
                    HttpStatus.BAD_REQUEST.value(),
                    "Error getting conversations: " + e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("/messages/{partnerId}")
    public ResponseEntity<ResponseData<Page<ChatMessageResponse>>> getMessages(
            @PathVariable Long partnerId,
            @RequestParam(required = false) Integer eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Principal principal) {
        try {
            Page<ChatMessageResponse> messages = chatService.getConversationMessages(
                    partnerId, eventId, principal, page, size);
            return ResponseEntity.ok(new ResponseData<>(
                    HttpStatus.OK.value(),
                    "Messages retrieved successfully",
                    messages
            ));
        } catch (Exception e) {
            log.error("Error getting messages: ", e);
            return ResponseEntity.badRequest().body(new ResponseData<>(
                    HttpStatus.BAD_REQUEST.value(),
                    "Error getting messages: " + e.getMessage(),
                    null
            ));
        }
    }

    @PostMapping("/mark-read/{partnerId}")
    public ResponseEntity<ResponseData<String>> markAsRead(
            @PathVariable Long partnerId,
            @RequestParam(required = false) Integer eventId,
            Principal principal) {
        try {
            chatService.markMessagesAsRead(partnerId, eventId, principal);
            return ResponseEntity.ok(new ResponseData<>(
                    HttpStatus.OK.value(),
                    "Messages marked as read successfully",
                    "OK"
            ));
        } catch (Exception e) {
            log.error("Error marking messages as read: ", e);
            return ResponseEntity.badRequest().body(new ResponseData<>(
                    HttpStatus.BAD_REQUEST.value(),
                    "Error marking messages as read: " + e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ResponseData<Long>> getUnreadCount(Principal principal) {
        try {
            Long count = chatService.getUnreadMessageCount(principal);
            return ResponseEntity.ok(new ResponseData<>(
                    HttpStatus.OK.value(),
                    "Unread count retrieved successfully",
                    count
            ));
        } catch (Exception e) {
            log.error("Error getting unread count: ", e);
            return ResponseEntity.badRequest().body(new ResponseData<>(
                    HttpStatus.BAD_REQUEST.value(),
                    "Error getting unread count: " + e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("/admin")
    public ResponseEntity<ResponseData<Integer>> getAdminUserId() {
        try {
            Integer adminUserId = chatService.getAdminUserId();
            return ResponseEntity.ok(new ResponseData<>(
                    HttpStatus.OK.value(),
                    "Admin user ID retrieved successfully",
                    adminUserId
            ));
        } catch (Exception e) {
            log.error("Error getting admin user ID: ", e);
            return ResponseEntity.badRequest().body(new ResponseData<>(
                    HttpStatus.BAD_REQUEST.value(),
                    "Error getting admin user ID: " + e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("/organizers")
    public ResponseEntity<ResponseData<List<User>>> getOrganizers() {
        try {
            List<User> organizers = chatService.getOrganizers();
            return ResponseEntity.ok(new ResponseData<>(
                    HttpStatus.OK.value(),
                    "Organizers retrieved successfully",
                    organizers
            ));
        } catch (Exception e) {
            log.error("Error getting organizers: ", e);
            return ResponseEntity.badRequest().body(new ResponseData<>(
                    HttpStatus.BAD_REQUEST.value(),
                    "Error getting organizers: " + e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("/organizer/{eventId}")
    public ResponseEntity<ResponseData<Integer>> getOrganizerUserId(@PathVariable Integer eventId) {
        try {
            log.info("🔍 Getting organizer for event ID: {}", eventId);
            
            // Kiểm tra event có tồn tại không
            if (!eventRepository.existsById(eventId)) {
                log.error("Event with ID {} not found", eventId);
                return ResponseEntity.badRequest().body(new ResponseData<>(
                        HttpStatus.BAD_REQUEST.value(),
                        "Event not found",
                        null
                ));
            }
            
            Integer organizerUserId = chatService.getOrganizerUserId(eventId);
            log.info("🔍 Found organizer ID: {}", organizerUserId);
            return ResponseEntity.ok(new ResponseData<>(
                    HttpStatus.OK.value(),
                    "Organizer user ID retrieved successfully",
                    organizerUserId
            ));
        } catch (Exception e) {
            log.error("Error getting organizer user ID for event {}: ", eventId, e);
            return ResponseEntity.badRequest().body(new ResponseData<>(
                    HttpStatus.BAD_REQUEST.value(),
                    "Error getting organizer user ID: " + e.getMessage(),
                    null
            ));
        }
    }

    // Test endpoint để kiểm tra
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Chat controller is working!");
    }

    // Debug endpoint để kiểm tra users và roles
    @GetMapping("/debug/users")
    public ResponseEntity<ResponseData<List<Map<String, Object>>>> debugUsers() {
        try {
            List<User> allUsers = userRepository.findAll();
            List<Map<String, Object>> userInfo = new ArrayList<>();
            
            for (User user : allUsers) {
                Map<String, Object> info = new HashMap<>();
                info.put("id", user.getId());
                info.put("fullName", user.getFullName());
                info.put("email", user.getEmail());
                
                List<String> roles = user.getTblUserRoles().stream()
                        .map(role -> role.getRole().getRoleName())
                        .collect(Collectors.toList());
                info.put("roles", roles);
                
                userInfo.add(info);
            }
            
            return ResponseEntity.ok(new ResponseData<>(
                    HttpStatus.OK.value(),
                    "Users debug info",
                    userInfo
            ));
        } catch (Exception e) {
            log.error("Error getting users debug info: ", e);
            return ResponseEntity.badRequest().body(new ResponseData<>(
                    HttpStatus.BAD_REQUEST.value(),
                    "Error: " + e.getMessage(),
                    null
            ));
        }
    }

    // Thêm endpoint để tạo cuộc trò chuyện hỗ trợ
    @PostMapping("/support")
    public ResponseEntity<ResponseData<ChatMessageResponse>> createSupportConversation(
            @RequestBody ChatMessageRequest request,
            Principal principal) {
        try {
            ChatMessageResponse response = chatService.createSupportConversation(
                    request.getReceiverId(), 
                    request.getContent(), 
                    principal
            );
            return ResponseEntity.ok(new ResponseData<>(
                    HttpStatus.OK.value(),
                    "Support conversation created successfully",
                    response
            ));
        } catch (Exception e) {
            log.error("Error creating support conversation: ", e);
            return ResponseEntity.badRequest().body(new ResponseData<>(
                    HttpStatus.BAD_REQUEST.value(),
                    "Error creating support conversation: " + e.getMessage(),
                    null
            ));
        }
    }

    // WebSocket message handler
    @MessageMapping("/chat")
    @SendTo("/topic/public")
    public ChatMessageResponse handleChatMessage(@Payload ChatMessageRequest request) {
        // This is for public chat if needed
        return null;
    }
} 