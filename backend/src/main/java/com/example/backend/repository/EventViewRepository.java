package com.example.backend.repository;


import com.example.backend.model.EventView;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventViewRepository extends JpaRepository<EventView, Integer> {
}