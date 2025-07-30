package com.example.backend.repository;

import com.example.backend.dto.projection.RevenueBucketView;
import com.example.backend.dto.response.BuyerSummaryDTO;
import com.example.backend.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    @EntityGraph(attributePaths = {
            "tblBookingSeats",
            "tblBookingSeats.seat",
            "tblBookingSeats.zone",
            "showingTime",
            "showingTime.event",
            "showingTime.address"
    })
    List<Booking> findByUserId(Integer userId);

    @Query("""
            SELECT b FROM Booking b
            LEFT JOIN FETCH b.tblBookingSeats bs
            LEFT JOIN FETCH bs.seat
            LEFT JOIN FETCH bs.zone
            LEFT JOIN FETCH b.user
            LEFT JOIN FETCH b.showingTime st
            LEFT JOIN FETCH st.event
            LEFT JOIN FETCH st.address
            WHERE b.id = :bookingId
            """)
    Optional<Booking> findBookingWithAllDetails(@Param("bookingId") Integer bookingId);

    @EntityGraph(attributePaths = {
            "showingTime",
            "showingTime.event",
            "showingTime.address"
    })
    List<Booking> findByUserEmail(String email);

    default void deleteExpiredHolds(LocalDateTime expirationTime) {
        List<Booking> expiredBookings = findAllByPaymentStatusAndCreatedDatetimeBefore("HOLD", expirationTime);
        deleteAll(expiredBookings);
    }

    List<Booking> findAllByPaymentStatusAndCreatedDatetimeBefore(String status, LocalDateTime time);

    @Query("SELECT b.id FROM Booking b JOIN b.showingTime st JOIN st.event e WHERE e.id = :eventId AND st.startTime = :startTime")
    Page<Long> findBookingIdByEventId(Integer eventId, LocalDateTime startTime, Pageable pageable);

    @Query("""
                SELECT b.id
                FROM Booking b
                JOIN b.showingTime st
                JOIN st.event e
                JOIN e.organizer o
                WHERE (:orgName IS NULL OR o.orgName LIKE %:orgName%)
            """)
    Page<Long> findAllBookingId(String orgName, Pageable pageable);

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

    @Query("SELECT b.showingTime.id FROM Booking b WHERE b.user.id = :userId AND b.paymentStatus = :paymentStatus")
    List<Integer> findConfirmedShowingTimeIdsByUserId(@Param("userId") Integer userId,
                                                      @Param("paymentStatus") String paymentStatus);

    @Query("SELECT b FROM Booking b WHERE b.showingTime.id = :showingTimeId AND b.paymentStatus = :paymentStatus")
    List<Booking> findByShowingTimeIdAndPaymentStatus(@Param("showingTimeId") Integer showingTimeId,
                                                      @Param("paymentStatus") String paymentStatus);


    List<Booking> findByShowingTimeId(Integer showingTimeId);

    @Query("""
                SELECT new com.example.backend.dto.response.BuyerSummaryDTO(
                    u.fullName,
                    u.email,
                    u.phone,
                    e.eventTitle,
                    b.createdDatetime,
                    SUM(bs.quantity),
                    b.finalPrice
                )
                FROM Booking b
                JOIN b.user u
                JOIN b.tblBookingSeats bs
                JOIN b.showingTime st
                JOIN st.event e
                WHERE e.organizer.id = :organizerId
                  AND b.paymentStatus = 'CONFIRMED'
                GROUP BY u.fullName, u.email, u.phone, e.eventTitle, b.createdDatetime, b.finalPrice
            """)
    List<BuyerSummaryDTO> findBuyersByOrganizerId(@Param("organizerId") Integer organizerId);

    List<Booking> findByShowingTimeStartTimeAndShowingTimeEventIdAndPaymentStatus(LocalDateTime startTime, int eventId, String paymentStatus);

    @Query(value = """
            SELECT bucket,
                   SUM(ads)     AS ads,
                   SUM(booking) AS booking
            FROM (
                -- Doanh thu booking
                SELECT DATE_FORMAT(b.created_datetime, :format) AS bucket,
                       0 AS ads,
                       CASE WHEN :type = 'ads' THEN 0
                            ELSE SUM(b.final_price) END AS booking
                FROM tbl_booking b
                         JOIN tbl_showing_time st ON b.showing_time_id = st.showing_time_id
                         JOIN tbl_event e ON st.event_id = e.event_id
                         JOIN tbl_organizer o ON e.organizer_id = o.organizer_id
                WHERE b.payment_status = 'CONFIRMED'
                  AND b.paid_at BETWEEN :from AND :to
                  AND (:orgName IS NULL OR o.org_name LIKE CONCAT('%', :orgName, '%'))
                GROUP BY bucket
            
                UNION ALL
            
                -- Doanh thu quảng cáo
                SELECT DATE_FORMAT(ea.created_at, :format) AS bucket,
                       CASE WHEN :type = 'booking' THEN 0
                            ELSE SUM(ea.total_price) END AS ads,
                       0 AS booking
                FROM tbl_event_ads ea
                         JOIN tbl_organizer o ON ea.organizer_id = o.organizer_id
                WHERE ea.status = 'APPROVED'
                  AND ea.created_at BETWEEN :from AND :to
                  AND (:orgName IS NULL OR o.org_name LIKE CONCAT('%', :orgName, '%'))
                GROUP BY bucket
            ) t
            GROUP BY bucket
            ORDER BY bucket
            """, nativeQuery = true)
    List<RevenueBucketView> findRevenueInTimeSeries(
            @Param("orgName") String orgName,
            @Param("format") String format,
            @Param("type") String type,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);
    @Query("""
             SELECT DISTINCT b FROM Booking b LEFT JOIN FETCH b.showingTime st LEFT JOIN FETCH st.event e LEFT JOIN FETCH b.user u LEFT JOIN FETCH b.tblBookingSeats bs WHERE b.id IN :ids ORDER BY b.paidAt DESC 
            """)
    List<Booking> findAllBookingById(List<Long> ids);
}
