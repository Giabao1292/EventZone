package com.example.backend.repository;

import com.example.backend.model.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    @Query("SELECT cm FROM ChatMessage cm WHERE " +
           "(cm.sender.id = :userId1 AND cm.receiver.id = :userId2) OR " +
           "(cm.sender.id = :userId2 AND cm.receiver.id = :userId1)")
    Page<ChatMessage> findConversationBetweenUsers(
            @Param("userId1") Integer userId1, 
            @Param("userId2") Integer userId2, 
            Pageable pageable
    );
    
    @Query("SELECT cm FROM ChatMessage cm WHERE " +
           "((cm.sender.id = :userId1 AND cm.receiver.id = :userId2) OR " +
           "(cm.sender.id = :userId2 AND cm.receiver.id = :userId1)) " +
           "AND cm.eventId = :eventId")
    Page<ChatMessage> findConversationBetweenUsersForEvent(
            @Param("userId1") Integer userId1, 
            @Param("userId2") Integer userId2,
            @Param("eventId") Integer eventId,
            Pageable pageable
    );
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE " +
           "cm.receiver.id = :userId AND cm.read = false")
    Long countUnreadMessagesForUser(@Param("userId") Integer userId);
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE " +
           "cm.receiver.id = :userId AND cm.sender.id = :senderId AND cm.read = false")
    Long countUnreadMessagesFromSender(@Param("userId") Integer userId, @Param("senderId") Integer senderId);
    
    @Query("SELECT DISTINCT cm.sender.id FROM ChatMessage cm WHERE cm.receiver.id = :userId " +
           "UNION " +
           "SELECT DISTINCT cm.receiver.id FROM ChatMessage cm WHERE cm.sender.id = :userId")
    List<Integer> findUserConversationPartners(@Param("userId") Integer userId);
    
    @Modifying
    @Transactional
    @Query("UPDATE ChatMessage cm SET cm.read = true WHERE " +
           "cm.receiver.id = :receiverId AND cm.sender.id = :senderId AND cm.read = false")
    void markMessagesAsRead(@Param("receiverId") Integer receiverId, @Param("senderId") Integer senderId);
    
    @Modifying
    @Transactional
    @Query("UPDATE ChatMessage cm SET cm.read = true WHERE " +
           "cm.receiver.id = :receiverId AND cm.sender.id = :senderId AND cm.eventId = :eventId AND cm.read = false")
    void markMessagesAsReadForEvent(@Param("receiverId") Integer receiverId, @Param("senderId") Integer senderId, @Param("eventId") Integer eventId);
} 