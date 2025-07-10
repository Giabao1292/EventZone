package com.example.backend.repository;

import com.example.backend.model.ShowingTime;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShowingTimeRepository extends JpaRepository<ShowingTime,Integer> {
    @EntityGraph(attributePaths = {"seats", "zones"})
    Optional<ShowingTime> findWithLayoutById(Integer id);

    Optional<ShowingTime> findWithLayoutById(Long id);
    List<ShowingTime> findByEventIdAndEndTimeBefore(Integer eventId, LocalDateTime dateTime);
}
