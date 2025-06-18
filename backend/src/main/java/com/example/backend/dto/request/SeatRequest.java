package com.example.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;


@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SeatRequest {

    @JsonProperty("id")
    private Integer id;

    @JsonProperty("label")
    @JsonAlias("seatLabel")
    private String label;

    private int x;
    private int y;

    @JsonProperty("type")
    @JsonAlias("seatType")
    private String type;

    @JsonProperty("price")
    @JsonAlias("seatPrice")
    private int price;

    private int capacity;
}

