package com.example.backend.service.impl;

import com.example.backend.dto.request.CreateMultipleShowingTimeRequest;
import com.example.backend.dto.request.ShowingTimeRequest;
import com.example.backend.dto.response.LayoutDTO;
import com.example.backend.dto.response.SeatDTO;
import com.example.backend.dto.response.ZoneDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.ShowingTimeService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public  class ShowingTimeServiceImpl implements ShowingTimeService {

    private final ShowingTimeRepository showingTimeRepo;

    private final ZoneRepository zoneRepo;

    private final SeatRepository seatRepo;

    private final ShowingTimeRepository showingTimeRepository;

    private final BookingSeatRepository bookingSeatRepo;

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
    public LayoutDTO getLayout(Integer showingTimeId) {
        // Lấy suất chiếu
        ShowingTime st = showingTimeRepository.findById(showingTimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy suất chiếu id=" + showingTimeId));

        // Lấy danh sách zones
        List<ZoneDTO> zones = zoneRepo.findByShowingTimeId(showingTimeId)
                .stream()
                .map(z -> new ZoneDTO(
                        z.getId(),
                        z.getZoneName(),
                        z.getType(),
                        z.getPrice(),
                        z.getX(),
                        z.getY(),
                        z.getWidth(),
                        z.getHeight(),
                        z.getCapacity(),
                        z.getCapacity() != null && z.getCapacity() > 0
                ))
                .collect(Collectors.toList());

        // 🧠 Lấy danh sách các seat_id đang bị giữ hoặc đã đặt
        List<Integer> reservedSeatIds = bookingSeatRepo.findReservedSeatIds(showingTimeId, LocalDateTime.now());

        // Lấy danh sách seats
        List<SeatDTO> seats = seatRepo.findByShowingTimeId(showingTimeId)
                .stream()
                .map(seat -> new SeatDTO(
                        seat.getId(),
                        seat.getSeatLabel(),
                        seat.getType(),
                        seat.getPrice(),
                        seat.getX(),
                        seat.getY(),
                        !reservedSeatIds.contains(seat.getId()) // nếu chưa bị giữ thì available = true
                ))
                .collect(Collectors.toList());

        // Build LayoutDTO
        LayoutDTO dto = new LayoutDTO();
        dto.setLayoutMode(st.getLayoutMode());
        dto.setZones(zones);
        dto.setSeats(seats);
        dto.setEventTitle(st.getEvent().getEventTitle());
        dto.setStartTime(st.getEvent().getStartTime());
        dto.setLocation(st.getAddress().getVenueName() + ", " + st.getAddress().getCity());
        return dto;
    }
}