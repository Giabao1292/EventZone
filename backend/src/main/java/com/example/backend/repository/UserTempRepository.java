package com.example.backend.repository;

import com.example.backend.model.UserTemp;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.sql.ast.tree.expression.JdbcParameter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface UserTempRepository extends JpaRepository<UserTemp, Integer> {

    Optional<UserTemp> findByEmail(String email);

    Optional<UserTemp> findByVerificationTokenAndTokenExpiryAfter(@Size(max = 100) @NotNull String verificationToken, @NotNull Instant tokenExpiryAfter);
}
