package com.example.backend.repository;

import com.example.backend.model.Event;
import com.example.backend.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.model.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {

    // Kiểm tra đã có user - event trong wishlist chưa
    boolean existsByUserAndEvent(User user, Event event);

    // Tìm wishlist theo user và event
    Optional<Wishlist> findByUserAndEvent(User user, Event event);

    // Tìm toàn bộ wishlist của user
    List<Wishlist> findAllByUser(User user);

}
