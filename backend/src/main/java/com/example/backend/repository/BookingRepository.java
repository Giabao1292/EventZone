package com.example.backend.repository;


import com.example.backend.dto.projection.RevenueBucketView;
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

import java.time.LocalDate;
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

    @Query("SELECT b.id FROM Booking b")
    Page<Long> findAllBookingId(Pageable pageable);

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

    List<Booking> findByUserEmailAndPaymentStatus(String email, String paymentStatus);

    boolean existsByShowingTime_IdAndUser_Id(Integer showingTimeId, Integer userId);

    List<Booking> findByUserIdAndPaymentStatus(Integer userId, String paymentStatus);


    @Query("SELECT b.showingTime.id FROM Booking b WHERE b.user.id = :userId AND b.paymentStatus = 'CONFIRMED'")
    List<Integer> findConfirmedShowingTimeIdsByUserId(@Param("userId") Integer userId);

    @Query(value = """
    SELECT bucket,
           SUM(ads)     AS ads,
           SUM(booking) AS booking
    FROM (
        SELECT DATE_FORMAT(b.created_datetime, :format) AS bucket,
               0 AS ads,
               CASE WHEN :type = 'ads' THEN 0
                    ELSE SUM(b.final_price) END AS booking
        FROM tbl_booking b
        WHERE b.payment_status = 'paid'
          AND b.created_datetime BETWEEN :from AND :to
        GROUP BY bucket

        UNION ALL

        SELECT DATE_FORMAT(e.created_at, :format) AS bucket,
               CASE WHEN :type = 'booking' THEN 0
                    ELSE SUM(e.total_price) END AS ads,
               0 AS booking
        FROM tbl_event_ads e
        WHERE e.status = 'APPROVED'
          AND e.created_at BETWEEN :from AND :to
        GROUP BY bucket
    ) t
    GROUP BY bucket
    ORDER BY bucket
    """, nativeQuery = true)
    List<RevenueBucketView> findRevenueInTimeSeries(@Param("format") String format,
                                                    @Param("type") String type,
                                                    @Param("from") LocalDate from,
                                                    @Param("to") LocalDate to);

    @Query("""
        SELECT DISTINCT b FROM Booking b LEFT JOIN FETCH b.showingTime st LEFT JOIN FETCH st.event e LEFT JOIN FETCH b.user u LEFT JOIN FETCH b.tblBookingSeats bs WHERE b.id IN :ids
       """)
    List<Booking> findAllBookingById(List<Long> ids);
}
