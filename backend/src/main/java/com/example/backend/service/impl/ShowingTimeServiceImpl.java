package com.example.backend.service.impl;

import com.example.backend.dto.request.CreateMultipleShowingTimeRequest;
import com.example.backend.dto.request.ShowingTimeRequest;
import com.example.backend.model.Address;
import com.example.backend.model.Event;
import com.example.backend.model.ShowingTime;
import com.example.backend.repository.AddressRepository;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.ShowingTimeRepository;
import com.example.backend.service.ShowingTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ShowingTimeServiceImpl implements ShowingTimeService {

    private final ShowingTimeRepository showingTimeRepo;

    private final EventRepository eventRepo;

    private final AddressRepository addressRepo;

    @Override
    public List<ShowingTime> createMultipleShowingTimes(CreateMultipleShowingTimeRequest req) {
        // Validate address fields
        if (req.getVenueName() == null || req.getVenueName().isBlank()) {
            throw new IllegalArgumentException("Venue name must not be empty");
        }
        if (req.getLocation() == null || req.getLocation().isBlank()) {
            throw new IllegalArgumentException("Location must not be empty");
        }
        if (req.getCity() == null || req.getCity().isBlank()) {
            throw new IllegalArgumentException("City must not be empty");
        }

        // Validate event ID
        if (req.getEventId() == null) {
            throw new IllegalArgumentException("Event ID must not be null");
        }

        // Validate showing time list
        if (req.getShowingTimes() == null || req.getShowingTimes().isEmpty()) {
            throw new IllegalArgumentException("Showing times must not be empty");
        }

        // Check trùng dữ liệu trong danh sách
        Set<String> uniqueKeys = new HashSet<>();
        for (ShowingTimeRequest dto : req.getShowingTimes()) {
            if (dto.getStartTime() == null || dto.getEndTime() == null ||
                    dto.getSaleOpenTime() == null || dto.getSaleCloseTime() == null) {
                throw new IllegalArgumentException("All showing time fields must not be null");
            }

            if (!dto.getStartTime().isBefore(dto.getEndTime())) {
                throw new IllegalArgumentException("Start time must be before end time");
            }

            if (!dto.getSaleOpenTime().isBefore(dto.getSaleCloseTime())) {
                throw new IllegalArgumentException("Sale open time must be before sale close time");
            }

            if (!dto.getSaleOpenTime().isBefore(dto.getStartTime())) {
                throw new IllegalArgumentException("Sale open time must be before start time");
            }

            if (!dto.getSaleCloseTime().isBefore(dto.getStartTime()) && !dto.getSaleCloseTime().isEqual(dto.getStartTime())) {
                throw new IllegalArgumentException("Sale close time must be before or equal to start time");
            }

            // Tạo key duy nhất cho từng slot chiếu
            String key = dto.getStartTime().toString() + "|" + dto.getEndTime().toString()
                    + "|" + dto.getSaleOpenTime().toString() + "|" + dto.getSaleCloseTime().toString();

            if (!uniqueKeys.add(key)) {
                throw new IllegalArgumentException("Duplicate showing time found: " + key);
            }
        }

        // Lấy event
        Event event = eventRepo.findById(req.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + req.getEventId()));

        // Tạo mới address
        Address address = new Address();
        address.setVenueName(req.getVenueName().trim());
        address.setLocation(req.getLocation().trim());
        address.setCity(req.getCity().trim());
        address = addressRepo.save(address);

        // Lưu vào DB
        List<ShowingTime> result = new ArrayList<>();
        for (ShowingTimeRequest dto : req.getShowingTimes()) {
            ShowingTime st = new ShowingTime();
            st.setEvent(event);
            st.setAddress(address);
            st.setStartTime(dto.getStartTime());
            st.setEndTime(dto.getEndTime());
            st.setSaleOpenTime(dto.getSaleOpenTime());
            st.setSaleCloseTime(dto.getSaleCloseTime());
            st.setLayoutMode(dto.getLayoutMode());

            result.add(showingTimeRepo.save(st));
        }

        return result;
    }

}