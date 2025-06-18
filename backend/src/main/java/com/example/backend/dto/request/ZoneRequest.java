package com.example.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ZoneRequest {

    @JsonProperty("id")
    private Integer id;

    // nhận cả "name" và "zoneName"
    @JsonProperty("name")
    @JsonAlias("zoneName")
    private String name;

    private int x;
    private int y;
    private int width;
    private int height;
    private String type;
    private int price;
    private int capacity;

}
