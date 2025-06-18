package com.example.backend.service.impl;

import com.example.backend.dto.request.LayoutRequest;
import com.example.backend.dto.request.SeatRequest;
import com.example.backend.dto.request.ZoneRequest;
import com.example.backend.dto.response.LayoutDTO;
import com.example.backend.dto.response.SeatDTO;
import com.example.backend.dto.response.ZoneDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Seat;
import com.example.backend.model.ShowingTime;
import com.example.backend.model.Zone;
import com.example.backend.repository.SeatRepository;
import com.example.backend.repository.ShowingTimeRepository;
import com.example.backend.repository.ZoneRepository;
import com.example.backend.service.LayoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class LayoutServiceImpl implements LayoutService {

    private final ZoneRepository zoneRepo;
    private final SeatRepository seatRepo;
    private final ShowingTimeRepository stRepo;

    @Override
    public LayoutDTO getLayout(Integer showingTimeId) {
        // Lấy suất chiếu kèm thông tin event và địa điểm
        ShowingTime st = stRepo.findById(showingTimeId)
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
                        seat.isAvailable()
                ))
                .collect(Collectors.toList());


        // Build layout DTO
        LayoutDTO dto = new LayoutDTO();
        dto.setLayoutMode(st.getLayoutMode());
        dto.setZones(zones);
        dto.setSeats(seats);
        dto.setEventTitle(st.getEvent().getEventTitle());
        dto.setStartTime(st.getEvent().getStartTime());
        dto.setLocation(st.getAddress().getVenueName() + ", " + st.getAddress().getCity());
        return dto;
    }

    @Override
    public void saveLayout(LayoutRequest req) {
        Integer showingTimeId = req.getShowingTimeId();
        ShowingTime st = stRepo.findById(showingTimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy suất chiếu id=" + showingTimeId));

        // Cập nhật chế độ layout nếu có
        if (req.getLayoutMode() != null) {
            st.setLayoutMode(req.getLayoutMode());
        }

        // Xóa tất cả zones và seats cũ của suất chiếu này nếu có
        zoneRepo.deleteAll(zoneRepo.findByShowingTimeId(showingTimeId));
        seatRepo.deleteAll(seatRepo.findByShowingTimeId(showingTimeId));

        // Tạo mới zones từ request (nếu có)
        if (req.getZones() != null) {
            for (ZoneRequest zr : req.getZones()) {
                Zone zone = new Zone();
                zone.setShowingTime(st);
                zone.setZoneName(zr.getName());
                zone.setType(zr.getType());
                zone.setPrice(BigDecimal.valueOf(zr.getPrice()));
                zone.setX(zr.getX());
                zone.setY(zr.getY());
                zone.setWidth(zr.getWidth());
                zone.setHeight(zr.getHeight());
                zone.setCapacity(zr.getCapacity());
                zoneRepo.save(zone);
            }
        }

        // Tạo mới seats từ request (nếu có)
        if (req.getSeats() != null) {
            for (SeatRequest sr : req.getSeats()) {
                Seat seat = new Seat();
                seat.setSeatLabel(sr.getLabel());
                seat.setX(sr.getX());
                seat.setY(sr.getY());
                seat.setType(sr.getType());
                seat.setPrice(BigDecimal.valueOf(sr.getPrice()));
                seat.setShowingTime(st);
                seatRepo.save(seat);
            }
        }

        stRepo.save(st); // Lưu lại thay đổi cho suất chiếu
    }
}
