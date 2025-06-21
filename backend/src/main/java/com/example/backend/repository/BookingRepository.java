package com.example.backend.repository;


import com.example.backend.model.Booking;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserId(Integer userId);

    default void deleteExpiredHolds(LocalDateTime expirationTime) {
        List<Booking> expiredBookings = findAllByPaymentStatusAndCreatedDatetimeBefore("HOLD", expirationTime);
        deleteAll(expiredBookings); // Hibernate sẽ xử lý cascade
    }

    List<Booking> findAllByPaymentStatusAndCreatedDatetimeBefore(String status, LocalDateTime time);
}
