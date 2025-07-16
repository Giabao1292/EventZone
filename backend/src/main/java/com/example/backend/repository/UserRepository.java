package com.example.backend.repository;

import com.example.backend.model.User;
import com.example.backend.repository.custom.UserRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> , UserRepositoryCustom {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.organizer o LEFT JOIN FETCH u.tblUserRoles ur LEFT JOIN FETCH ur.role WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(String email);

    @Query("SELECT u.id from User u")
    Page<Long> findAllUserIds(Pageable pageable);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.organizer o LEFT JOIN FETCH u.tblUserRoles ur LEFT JOIN FETCH ur.role where u.id in :ids")
    List<User> findUsersToSearch(List<Long> ids);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.tblUserRoles tu LEFT JOIN FETCH tu.role r where r.roleName = :roleName")
    List<User> findUserByRoleName(String roleName);

    @Query("SELECT DISTINCT u.id FROM User u " +
            "JOIN  u.tblBookings b " +
            "GROUP BY u.id " +
            "ORDER BY sum(b.finalPrice) DESC ")
    List<Long> getTopClientIds(Pageable pageable);

    @Query("SELECT DISTINCT u FROM User u " +
            "JOIN FETCH u.tblBookings b " +
            "WHERE u.id IN :ids")
    List<User> getTopClienByIds(List<Long> ids);
}
