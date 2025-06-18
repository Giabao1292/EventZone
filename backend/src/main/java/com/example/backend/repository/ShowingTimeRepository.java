package com.example.backend.repository;

import com.example.backend.model.Address;
import com.example.backend.model.ShowingTime;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShowingTimeRepository extends JpaRepository<ShowingTime,Integer> {
    @EntityGraph(attributePaths = {"seats", "zones"})
    Optional<ShowingTime> findWithLayoutById(Long id);
}
