package com.example.backend.service;


import com.example.backend.dto.request.CreateMultipleShowingTimeRequest;
import com.example.backend.model.ShowingTime;

import java.util.List;

public interface ShowingTimeService {
    List<ShowingTime> createMultipleShowingTimes(CreateMultipleShowingTimeRequest req);
}
