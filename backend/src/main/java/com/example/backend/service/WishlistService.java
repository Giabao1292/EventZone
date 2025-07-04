package com.example.backend.service;

import com.example.backend.model.Event;
import com.example.backend.model.User;
import com.example.backend.model.Wishlist;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    /**
     * Thêm sự kiện vào wishlist
     */
    public String addToWishlist(String username, Integer eventId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException("Event not found"));

        if (wishlistRepository.existsByUserAndEvent(user, event)) {
            return "Event already in wishlist.";
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .event(event)
                .build();

        wishlistRepository.save(wishlist);
        return "Added to wishlist.";
    }

    /**
     * Xóa sự kiện khỏi wishlist
     */
    public String removeFromWishlist(String username, Integer eventId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException("Event not found"));

        Wishlist wishlist = wishlistRepository.findByUserAndEvent(user, event)
                .orElseThrow(() -> new NoSuchElementException("Wishlist item not found"));

        wishlistRepository.delete(wishlist);
        return "Removed from wishlist.";
    }

    /**
     * Lấy toàn bộ wishlist của user
     */
    public List<Wishlist> getWishlist(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        return wishlistRepository.findAllByUser(user);
    }

    /**
     * Lấy danh sách sự kiện chưa kết thúc trong wishlist
     */
    public List<Event> getActiveWishlistEvents(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        return wishlistRepository.findAllByUser(user).stream()
                .map(Wishlist::getEvent)
                .filter(event -> event.getEndTime().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());
    }
}
