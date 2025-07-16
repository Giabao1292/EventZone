package com.example.backend.util;

import com.example.backend.dto.request.EventHomeDTO;
import com.example.backend.dto.response.TopClientResponse;

import java.util.Comparator;

public class Comparable {
    public static Comparator<TopClientResponse> userComparator = new Comparator<TopClientResponse>() {
        @Override
        public int compare(TopClientResponse o1, TopClientResponse o2) {
            return o2.getExpenditure().compareTo(o1.getExpenditure());
        }
    };
    public static Comparator<EventHomeDTO> eventHomeDTOComparator = new Comparator<EventHomeDTO>() {
        @Override
        public int compare(EventHomeDTO o1, EventHomeDTO o2) {
            return Double.compare(o2.getLowestPrice(),o1.getLowestPrice());
        }
    };
}
