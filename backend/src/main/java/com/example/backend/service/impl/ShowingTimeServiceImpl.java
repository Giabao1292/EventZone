package com.example.backend.service.impl;

import com.example.backend.dto.request.CreateMultipleShowingTimeRequest;
import com.example.backend.dto.request.ShowingTimeRequest;
import com.example.backend.dto.response.LayoutDTO;
import com.example.backend.dto.response.SeatDTO;
import com.example.backend.dto.response.ZoneDTO;
import com.example.backend.model.*;
import com.example.backend.repository.AddressRepository;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.ShowingTimeRepository;
import com.example.backend.service.ShowingTimeService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public  class ShowingTimeServiceImpl implements ShowingTimeService {

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

    @Override
    public LayoutDTO getLayout(Long id) {
        ShowingTime st = showingTimeRepo.findWithLayoutById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Không tìm thấy suất chiếu với id = " + id)
                );

        // Tạo LayoutDTO
        LayoutDTO dto = new LayoutDTO();
        dto.setLayoutMode(st.getLayoutMode());

        Event event = st.getEvent();
        if (event != null) {
            dto.setEventTitle(event.getEventTitle());
        }
        // --- LẤY startTime ---
        dto.setStartTime(st.getStartTime());

        // --- LẤY location từ Address ---
        Address address = st.getAddress();
        if (address != null) {
            dto.setLocation(address.getLocation());
            // Nếu muốn: dto.setLocation(address.getVenueName() + ", " + address.getLocation() + ", " + address.getCity());
        }

        List<SeatDTO> seatDtos = new ArrayList<>();
        for (Seat seat : st.getSeats()) {
            SeatDTO s = new SeatDTO();
            s.setId(seat.getId());
            s.setX(seat.getX());
            s.setY(seat.getY());
            s.setType(seat.getType());
            s.setPrice(seat.getPrice());
            s.setSeatLabel(seat.getSeatLabel());
            s.setAvailable(seat.isAvailable());
            // nếu SeatDTO có thêm field khác thì tiếp tục set ở đây
            seatDtos.add(s);
        }
        dto.setSeats(seatDtos);

        List<ZoneDTO> zoneDtos = new ArrayList<>();
        for (Zone zone : st.getZones()) {
            ZoneDTO z = new ZoneDTO();
            z.setId(zone.getId());
            z.setX(zone.getX());
            z.setY(zone.getY());
            z.setWidth(zone.getWidth());
            z.setHeight(zone.getHeight());
            z.setZoneName(zone.getZoneName());
            z.setType(zone.getType());
            z.setCapacity(zone.getCapacity());
            z.setPrice(zone.getPrice());
            // nếu ZoneDTO có thêm property, set tiếp ở đây
            zoneDtos.add(z);
        }
        dto.setZones(zoneDtos);

        return dto;
    }


}