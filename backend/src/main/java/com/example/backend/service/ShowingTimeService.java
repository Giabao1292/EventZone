package com.example.backend.service;


import com.example.backend.dto.request.CreateMultipleShowingTimeRequest;
import com.example.backend.dto.request.UpdateShowingTimeRequest;
import com.example.backend.dto.response.LayoutDTO;
import com.example.backend.dto.response.ShowingTimeAdmin;
import com.example.backend.dto.response.ShowingTimeDTO;
import com.example.backend.model.ShowingTime;

import java.util.List;
import java.util.Optional;

public interface ShowingTimeService {
    List<ShowingTime> createMultipleShowingTimes(CreateMultipleShowingTimeRequest req);
    LayoutDTO getLayout(Integer id);
    ShowingTime updateShowingTime(int id, UpdateShowingTimeRequest req);
    ShowingTime createShowingTime(UpdateShowingTimeRequest req);
    List<ShowingTimeAdmin> getListShowingTime(int id);
    Optional<ShowingTimeAdmin> getShowingTimeById(int id);
    List<ShowingTimeDTO> getShowingTimesByEventId(int eventId);
}
