package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tbl_zone")
@Getter
@Setter
public class Zone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "zone_id")
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showing_time_id", nullable = false)
    @JsonBackReference
    private ShowingTime showingTime;

    @Column(name = "type")
    private String type;
    @Column(name = "price")
    private int price;

    @Column(name = "zone_name", length = 100)
    private String zoneName;

    @Column(name = "x")
    private Integer x;

    @Column(name = "y")
    private Integer y;

    @Column(name = "width")
    private Integer width;

    @Column(name = "height")
    private Integer height;

    @NotNull
    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<BookingSeat> bookingSeats = new HashSet<>();
}