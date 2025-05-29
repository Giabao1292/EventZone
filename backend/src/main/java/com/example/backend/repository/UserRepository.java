package com.example.backend.repository;

import com.example.backend.model.User;
import com.example.backend.repository.custom.UserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> , UserRepositoryCustom {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);

}
