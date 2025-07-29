package com.example.backend.repository;

import com.example.backend.model.Organizer;
import com.example.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizerRepository extends JpaRepository<Organizer, Integer> {
    Optional<Organizer> findByUserId(int userId);

    Page<Organizer> findAll(Pageable pageable);

    Optional<Organizer> findByUser_Email(String email);

    @Query("SELECT o.id FROM Organizer o")
    Page<Integer> findAllOrganizerId(Pageable pageable);

    @Query("SELECT o FROM Organizer o LEFT JOIN FETCH o.orgType ot LEFT JOIN FETCH o.user u WHERE o.id in :ids")
    List<Organizer> findALlOrganizersByIds(List<Integer> ids);
    
    @Query("SELECT o FROM Organizer o LEFT JOIN FETCH o.user u WHERE o.id = :organizerId")
    Optional<Organizer> findByIdWithUser(@Param("organizerId") Integer organizerId);
}
