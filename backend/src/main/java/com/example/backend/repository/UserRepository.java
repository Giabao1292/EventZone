package com.example.backend.repository;

import com.example.backend.dto.response.EventSummaryDTO;
import com.example.backend.model.User;
import com.example.backend.repository.custom.UserRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, Integer> , UserRepositoryCustom {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    Page<User> findAll(Pageable pageable);
}
