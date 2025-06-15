package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "tbl_booking_seat", indexes = {
        @Index(name = "booking_id", columnList = "booking_id"),
        @Index(name = "seat_id", columnList = "seat_id")
})
public class BookingSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_seat_id")
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    @JsonBackReference
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id")
    @JsonBackReference
    private Seat seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id")
    @JsonBackReference
    private Zone zone;
    @Column(name = "quantity", nullable = false, length = 100)
    private Integer quantity = 1;
    @Column(name = "price", nullable = false, length = 100)
    private BigDecimal price;
    @Column(name = "status", nullable = false, length = 100)
    private String status ;

}