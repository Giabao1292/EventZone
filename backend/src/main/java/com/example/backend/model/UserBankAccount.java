package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "tbl_user_bank_account", indexes = {
        @Index(name = "user_id", columnList = "user_id")
})
public class UserBankAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id", nullable = false)
    private Integer paymentId;

    @Size(max = 255)
    @Column(name = "bank_name")
    private String bankName;

    @Size(max = 255)
    @Column(name = "account_number")
    private String accountNumber;

    @Size(max = 255)
    @Column(name = "holder_name")
    private String holderName;

    @ColumnDefault("0")
    @Column(name = "is_default")
    private Integer isDefault;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}