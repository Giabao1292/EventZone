package com.example.backend.repository;

import com.example.backend.model.UserBankAccount;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserBankAccountRepository extends JpaRepository<UserBankAccount, Integer> {

    List<UserBankAccount> findAllByUser_Email(String email);

    UserBankAccount findByIsDefaultIsAndUser_Email(Integer isDefault, String email);

    UserBankAccount findByAccountNumberAndBankName(@Size(max = 255) String accountNumber, @Size(max = 255) String bankName);
}
