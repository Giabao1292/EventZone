package com.example.backend.service;


import com.example.backend.dto.request.CreateMultipleShowingTimeRequest;
import com.example.backend.dto.response.LayoutDTO;
import com.example.backend.model.ShowingTime;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;
import java.util.Optional;

public interface ShowingTimeService {
    List<ShowingTime> createMultipleShowingTimes(CreateMultipleShowingTimeRequest req);
    LayoutDTO getLayout(Integer id);
}
