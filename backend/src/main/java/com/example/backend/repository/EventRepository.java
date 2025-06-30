package com.example.backend.repository;

import com.example.backend.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByCategory_CategoryId(int categoryId);

    @Query("SELECT DISTINCT e FROM Event e " +
            "LEFT JOIN FETCH e.tblShowingTimes st " +
            "LEFT JOIN FETCH st.address " +
            "LEFT JOIN FETCH st.seats s " +
            "LEFT JOIN FETCH st.zones z " +
            "WHERE e.id = :eventId")
    Optional<Event> findEventDetail(@Param("eventId") Integer eventId);

    Page<Event> findAll(Pageable pageable);

    List<Event> findByOrganizer_Id(int organizerId);


}
