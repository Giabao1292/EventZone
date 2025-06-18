package com.example.backend.repository;

import com.example.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByCategory_CategoryId(int categoryId);

    @Query("SELECT DISTINCT e FROM Event e " +
            "LEFT JOIN FETCH e.tblShowingTimes st " +
            "LEFT JOIN FETCH st.address " +
            "LEFT JOIN FETCH st.seats s " +
            "LEFT JOIN FETCH st.zones z " +
            "WHERE e.id = :eventId")
    Optional<Event> findEventDetail(@Param("eventId") Integer eventId);


}
