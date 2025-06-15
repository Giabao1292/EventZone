package com.example.backend.service.impl;

import com.example.backend.dto.request.LayoutRequest;
import com.example.backend.dto.request.SeatRequest;
import com.example.backend.dto.request.ZoneRequest;
import com.example.backend.model.Seat;
import com.example.backend.model.ShowingTime;
import com.example.backend.model.Zone;
import com.example.backend.repository.SeatRepository;
import com.example.backend.repository.ShowingTimeRepository;
import com.example.backend.repository.ZoneRepository;
import com.example.backend.service.LayoutService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LayoutServiceImpl implements LayoutService {

    private final ShowingTimeRepository showingTimeRepo;
    private final SeatRepository seatRepo;
    private final ZoneRepository zoneRepo;

    @Transactional
    @Override
    public void saveLayout(LayoutRequest request) {
        Optional<ShowingTime> optionalShowingTime = showingTimeRepo.findById(request.getShowing_time_id());
        if (optionalShowingTime.isEmpty()) {
            throw new RuntimeException("Showing time not found");
        }

        ShowingTime showingTime = optionalShowingTime.get();
        showingTime.setLayoutMode(request.getLayout_mode());

        // Clear old seats/zones if needed
        showingTime.getSeats().clear();
        showingTime.getZones().clear();

        for (SeatRequest seatDTO : request.getSeats()) {
            Seat seat = new Seat();
            seat.setSeatLabel(seatDTO.getLabel());
            seat.setX(seatDTO.getX());
            seat.setY(seatDTO.getY());
            seat.setType(seatDTO.getType());
            seat.setPrice(seatDTO.getPrice());
            seat.setShowingTime(showingTime);
            showingTime.getSeats().add(seat);
        }

        for (ZoneRequest zoneDTO : request.getZones()) {
            Zone zone = new Zone();
            zone.setZoneName(zoneDTO.getName());
            zone.setX(zoneDTO.getX());
            zone.setY(zoneDTO.getY());
            zone.setWidth(zoneDTO.getWidth());
            zone.setHeight(zoneDTO.getHeight());
            zone.setCapacity(zoneDTO.getCapacity());
            zone.setType(zoneDTO.getType());
            zone.setPrice(zoneDTO.getPrice());
            zone.setShowingTime(showingTime);
            showingTime.getZones().add(zone);
        }

        showingTimeRepo.save(showingTime);
    }
}
