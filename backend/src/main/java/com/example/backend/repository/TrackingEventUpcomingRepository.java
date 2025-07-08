package com.example.backend.repository;

import com.example.backend.dto.projection.ReminderInfo;
import com.example.backend.model.TrackingEventUpcoming;
import com.example.backend.model.User;
import com.example.backend.model.Event;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TrackingEventUpcomingRepository extends JpaRepository<TrackingEventUpcoming, Integer> {

    // Lấy tất cả tracking của một user
    List<TrackingEventUpcoming> findByUser(User user);

    // Kiểm tra một user đã theo dõi sự kiện đó chưa
    Optional<TrackingEventUpcoming> findByUserAndEvent(User user, Event event);

    // Xoá theo dõi của một user với sự kiện
    void deleteByUserAndEvent(User user, Event event);

    // Lấy danh sách tất cả sự kiện mà user đang theo dõi
    List<TrackingEventUpcoming> findAllByUser_Id(Integer userId);

    // Lấy danh sách user theo dõi một sự kiện cụ thể
    List<TrackingEventUpcoming> findAllByEvent_Id(Integer eventId);

    @EntityGraph(attributePaths = {"event", "event.tblShowingTimes", "user"})
    List<TrackingEventUpcoming> findAll();
    @Query("""
    SELECT 
        u.email AS userEmail,
        e.eventTitle AS eventTitle,
        st.startTime AS startTime,
        st.saleOpenTime AS saleOpenTime
    FROM TrackingEventUpcoming teu
    JOIN teu.user u
    JOIN teu.event e
    JOIN e.tblShowingTimes st
    WHERE 
        TIMESTAMPDIFF(MINUTE, CURRENT_TIMESTAMP, st.saleOpenTime) IN (1, 2)
        OR TIMESTAMPDIFF(MINUTE, CURRENT_TIMESTAMP, st.startTime) IN (1, 2)
""")
    List<ReminderInfo> getReminderInfo();

}