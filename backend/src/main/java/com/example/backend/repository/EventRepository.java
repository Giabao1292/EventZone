package com.example.backend.repository;

import com.example.backend.dto.projection.EventMinPriceProjection;
import com.example.backend.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByCategory_CategoryId(int categoryId);
    List<Event> findByStatus_StatusName(String statusName); // "APPROVED"

    @Query("SELECT DISTINCT e FROM Event e " +
            "LEFT JOIN FETCH e.tblShowingTimes st " +
            "LEFT JOIN FETCH st.address " +
            "LEFT JOIN FETCH st.seats s " +
            "LEFT JOIN FETCH st.zones z " +
            "WHERE e.id = :eventId")

    Optional<Event> findEventDetail(@Param("eventId") Integer eventId);

    @EntityGraph(attributePaths = {"status", "category"})
    List<Event> findAll();


    List<Event> findByOrganizer_Id(int organizerId);

    List<Event> findByOrganizer_IdAndStatus_Id(Integer organizerId, Integer statusId);

    @Query("SELECT e.id FROM Event e " +
            "LEFT JOIN e.status s " +
            "WHERE s.statusName != 'DRAFT'")
    Page<Integer> findAllEventIds(Pageable pageable);

    @Query("SELECT DISTINCT e FROM Event e LEFT JOIN FETCH e.status s" +
            " LEFT JOIN FETCH e.organizer o" +
            " LEFT JOIN FETCH e.category c" +
            " LEFT JOIN FETCH e.tblShowingTimes tst" +
            " LEFT JOIN FETCH tst.address a" +
            " LEFT JOIN FETCH o.orgType ot" +
            " WHERE e.id in :ids" +
            " ORDER by e.createdAt DESC")
    List<Event> findAllEventByIds(List<Integer> ids);

    @Query(value = """
    SELECT 
        e.event_id AS eventId,
        LEAST(
            COALESCE((
                SELECT MIN(s.price)
                FROM tbl_showing_time st
                JOIN tbl_seat s ON st.showing_time_id = s.showing_time_id
                WHERE st.event_id = e.event_id
            ), 9999999999),

            COALESCE((
                SELECT MIN(z.price)
                FROM tbl_showing_time st
                JOIN tbl_zone z ON st.showing_time_id = z.showing_time_id
                WHERE st.event_id = e.event_id
            ), 9999999999)
        ) AS minPrice
    FROM tbl_event e
    WHERE e.event_id IN (:eventIds)
    """, nativeQuery = true)
    List<EventMinPriceProjection> findMinPriceByEventIds(List<Long> eventIds);

    @Query("SELECT DISTINCT e FROM Event e " +
            "LEFT JOIN FETCH e.tblShowingTimes st " +
            "LEFT JOIN FETCH st.seats s " +
            "WHERE e.status.statusName = 'APPROVED'")
    List<Event> findApprovedEventsWithShowingsAndSeats();

    List<Event> findByCategory_CategoryIdAndStatus_StatusName(int categoryId, String statusName);

    // Ví dụ JPQL
    @Query("SELECT e FROM Event e JOIN e.tblShowingTimes st WHERE " +
            "( :categoryId IS NULL OR e.category.categoryId = :categoryId ) " +
            "AND ( :search IS NULL OR LOWER(e.eventTitle) LIKE LOWER(CONCAT('%', :search, '%')) ) " +
            "AND (st.endTime < CURRENT_TIMESTAMP) " +
            "AND e.status.statusName = 'APPROVED' " +
            "GROUP BY e")
    Page<Event> findEndedEvents(@Param("search") String search, @Param("categoryId") Integer categoryId, Pageable pageable);

    @Query("SELECT DISTINCT e FROM Event e" +
            " LEFT JOIN e.status s" +
            " LEFT JOIN e.tblShowingTimes tst" +
            " LEFT JOIN tst.bookings b" +
            " LEFT JOIN b.tblBookingSeats bs" +
            " WHERE s.statusName = 'APPROVED'" +
            " GROUP BY e " +
            " ORDER BY count(bs.id) DESC")
    List<Event> getTopEventsIds(Pageable pageable);

    @Query("SELECT DISTINCT e FROM Event e " +
            "JOIN e.tblShowingTimes st " +
            "JOIN st.reviews r " +
            "WHERE r.status = 'ACTIVE' " +
            "ORDER BY e.createdAt DESC")
    List<Event> findEventsWithReviews();

    @Query("SELECT DISTINCT e FROM Event e " +
            "JOIN e.tblShowingTimes st " +
            "JOIN st.reviews r " +
            "WHERE e.organizer.id = :organizerId " +
            "AND r.status = 'ACTIVE' " +
            "ORDER BY e.createdAt DESC")
    List<Event> findMyEventsWithReviews(@Param("organizerId") int organizerId);
}
