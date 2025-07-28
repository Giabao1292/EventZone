package com.example.backend.repository;

import com.example.backend.dto.response.TicketSalesDTO;
import com.example.backend.model.Booking;
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
          OR (bs.status = 'HOLD' AND :now < DATE_ADD(b.created_datetime, INTERVAL 10 MINUTE))
      )
""", nativeQuery = true)
    List<Integer> findReservedSeatIds(
            @Param("showingTimeId") Integer showingTimeId,
            @Param("now") LocalDateTime now
    );

    @Query("""
    SELECT new com.example.backend.dto.response.TicketSalesDTO(
        e.id,
        e.eventTitle,
        COUNT(bs.id),
        SUM(bs.price * bs.quantity)
    )
    FROM BookingSeat bs
    JOIN bs.booking b
    JOIN b.showingTime st
    JOIN st.event e
    WHERE bs.status = 'BOOKED'
      AND e.organizer.id = :organizerId
      AND (:eventId IS NULL OR e.id = :eventId)
      AND (:fromDate IS NULL OR st.startTime >= :fromDate)
      AND (:toDate IS NULL OR st.startTime <= :toDate)
    GROUP BY e.id, e.eventTitle
""")
    List<TicketSalesDTO> getTicketSalesSummary(
            @Param("eventId") Integer eventId,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("organizerId") Integer organizerId
    );

    boolean existsBySeatIdAndStatusIn(Integer seatId, List<String> statuses);
}

