package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "tbl_seat")
@Getter @Setter
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showing_time_id")
    @JsonBackReference
    private ShowingTime showingTime;

    @Column(name = "type")
    private String type;
    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "seat_label", length = 10)
    private String seatLabel;
    @Column(name = "x", length = 10)
    private Integer x;
    @Column(name = "y", length = 10)
    private Integer y;
    @OneToMany(mappedBy = "seat", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<BookingSeat> bookingSeats = new HashSet<>();
}
