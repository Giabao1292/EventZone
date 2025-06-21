package com.example.backend.repository;

import com.example.backend.model.BookingSeat;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, Integer> {
    @Query(value = """
    SELECT bs.seat_id FROM tbl_booking_seat bs
    JOIN tbl_booking b ON bs.booking_id = b.booking_id
    WHERE b.showing_time_id = :showingTimeId
      AND bs.status IN ('BOOKED', 'HOLD')
      AND (
          bs.status = 'BOOKED'
          OR (bs.status = 'HOLD' AND :now < DATE_ADD(b.created_datetime, INTERVAL 3 MINUTE))
      )
""", nativeQuery = true)
    List<Integer> findReservedSeatIds(
            @Param("showingTimeId") Integer showingTimeId,
            @Param("now") LocalDateTime now
    );
}
