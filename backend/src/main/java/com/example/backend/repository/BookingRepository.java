package com.example.backend.repository;


import com.example.backend.model.Booking;
import com.example.backend.model.PaymentStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    @EntityGraph(attributePaths = {
            "tblBookingSeats",
            "tblBookingSeats.seat",          // ⚠️ PHẢI CÓ DÒNG NÀY
            "tblBookingSeats.zone",          // nếu có zone
            "showingTime",
            "showingTime.event",
            "showingTime.address"
    })
    List<Booking> findByUserId(Integer userId);

    @EntityGraph(attributePaths = {
            "showingTime",
            "showingTime.event",
            "showingTime.address"
    })
    List<Booking> findByUserEmail(String email);

    default void deleteExpiredHolds(LocalDateTime expirationTime) {
        List<Booking> expiredBookings = findAllByPaymentStatusAndCreatedDatetimeBefore("HOLD", expirationTime);
        deleteAll(expiredBookings); // Hibernate sẽ xử lý cascade
    }

    List<Booking> findAllByPaymentStatusAndCreatedDatetimeBefore(String status, LocalDateTime time);

    @Query("SELECT b.id FROM Booking b JOIN b.showingTime st JOIN st.event e WHERE e.id = :eventId AND st.startTime = :startTime")
    Page<Long> findBookingIdByEventId(Integer eventId, LocalDateTime startTime, Pageable pageable);

    @Query("""
    SELECT DISTINCT b FROM Booking b
    LEFT JOIN FETCH b.tblBookingSeats bs
    LEFT JOIN FETCH bs.seat
    LEFT JOIN FETCH bs.zone
    LEFT JOIN FETCH b.user u
    LEFT JOIN FETCH u.tblReviews
    LEFT JOIN FETCH b.showingTime st
    LEFT JOIN FETCH st.event e
    LEFT JOIN FETCH u.organizer o
    WHERE b.id IN :ids
    """)
    List<Booking> findBookingById(@Param("ids") List<Long> ids);

    @EntityGraph(attributePaths = {"tblBookingSeats"})
    List<Booking> findByShowingTimeStartTimeAndShowingTimeEventId(LocalDateTime startTime, int eventId);

    List<Booking> findByUserEmailAndPaymentStatus(String email, PaymentStatus paymentStatus);

}
