package com.example.backend.service.impl;

import com.example.backend.dto.request.CreateMultipleShowingTimeRequest;
import com.example.backend.dto.request.ShowingTimeRequest;
import com.example.backend.dto.request.UpdateShowingTimeRequest;
import com.example.backend.dto.response.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.ShowingTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public  class ShowingTimeServiceImpl implements ShowingTimeService {

    private final ZoneRepository zoneRepo;

    private final SeatRepository seatRepo;

    private final ShowingTimeRepository showingTimeRepository;

    private final BookingSeatRepository bookingSeatRepo;

    private final EventRepository eventRepo;

    private final AddressRepository addressRepo;

    private final BookingRepository bookingRepo;


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

            result.add(showingTimeRepository.save(st));
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

    @Override
    public ShowingTime updateShowingTime(int id, UpdateShowingTimeRequest req) {
        // Tìm suất chiếu cần cập nhật
        ShowingTime st = showingTimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy suất chiếu id=" + id));

        // Validate các trường (tùy dự án, bạn có thể thêm nhiều kiểm tra hơn)
        if (req.getStartTime() == null || req.getEndTime() == null ||
                req.getSaleOpenTime() == null || req.getSaleCloseTime() == null) {
            throw new IllegalArgumentException("Các trường thời gian không được để trống");
        }
        if (!req.getStartTime().isBefore(req.getEndTime())) {
            throw new IllegalArgumentException("Start time phải trước end time");
        }
        if (!req.getSaleOpenTime().isBefore(req.getSaleCloseTime())) {
            throw new IllegalArgumentException("Sale open time phải trước sale close time");
        }
        if (!req.getSaleOpenTime().isBefore(req.getStartTime())) {
            throw new IllegalArgumentException("Sale open time phải trước start time");
        }
        if (!req.getSaleCloseTime().isBefore(req.getStartTime()) && !req.getSaleCloseTime().isEqual(req.getStartTime())) {
            throw new IllegalArgumentException("Sale close time phải trước hoặc bằng start time");
        }

        // Cập nhật thông tin
        st.setStartTime(req.getStartTime());
        st.setEndTime(req.getEndTime());
        st.setSaleOpenTime(req.getSaleOpenTime());
        st.setSaleCloseTime(req.getSaleCloseTime());
        st.setLayoutMode(req.getLayoutMode());

        // Lưu lại và trả về
        return showingTimeRepository.save(st);
    }


    @Override
    public List<ShowingTimeAdmin> getListShowingTime(int eventId) {
        // Lấy event từ repository
        Event event = eventRepo.findById(eventId).orElse(null);
        if (event == null) return List.of(); // Nếu không có event thì trả list rỗng

        // Lấy organizerId từ event (chính là người tạo event này)
        Integer organizerId = event.getOrganizer() != null ? event.getOrganizer().getId() : null;

        // Lấy danh sách suất chiếu từ event
        List<ShowingTime> showingTimes = event.getTblShowingTimes().stream().toList();

        // Map sang DTO
        return showingTimes.stream().map(showingTime -> ShowingTimeAdmin.builder()
                        .id(showingTime.getId())
                        .event_id(eventId)
                        .organizerId(organizerId) // <- Đúng chỗ này!
                        .startTime(showingTime.getStartTime())
                        .endTime(showingTime.getEndTime())
                        .saleOpenTime(showingTime.getSaleOpenTime())
                        .saleCloseTime(showingTime.getSaleCloseTime())
                        .build())
                .toList();
    }


    @Override
    public ShowingTime createShowingTime(UpdateShowingTimeRequest req) {
        // 1. Validate eventId (bổ sung trường eventId vào request nếu chưa có)
        if (req.getEventId() == null) throw new IllegalArgumentException("EventId is required");

        // 2. Lấy đối tượng Event
        Event event = eventRepo.findById(req.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found with id=" + req.getEventId()));

        // 3. Tạo ShowingTime mới và gán các trường
        ShowingTime st = new ShowingTime();
        st.setEvent(event); // <-- ĐÚNG!
        st.setStartTime(req.getStartTime());
        st.setEndTime(req.getEndTime());
        st.setSaleOpenTime(req.getSaleOpenTime());
        st.setSaleCloseTime(req.getSaleCloseTime());
        st.setLayoutMode(req.getLayoutMode());

        // ... Set các thuộc tính khác nếu có

        return showingTimeRepository.save(st);
    }

    @Override
    public Optional<ShowingTimeAdmin> getShowingTimeById(int id) {
        return showingTimeRepository.findById(id).map(st -> {
            ShowingTimeAdmin dto = new ShowingTimeAdmin();
            dto.setId(st.getId());
            dto.setEvent_id(st.getEvent().getId());
            // Nếu có organizer trong event, set vào
            dto.setOrganizerId(st.getEvent().getOrganizer() != null ? st.getEvent().getOrganizer().getId() : null);
            dto.setStartTime(st.getStartTime());
            dto.setEndTime(st.getEndTime());
            dto.setSaleOpenTime(st.getSaleOpenTime());
            dto.setSaleCloseTime(st.getSaleCloseTime());
            return dto;
        });
    }



    @Override
    public List<ShowingTimeDTO> getShowingTimesByEventId(int eventId) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy event id=" + eventId));

        List<ShowingTime> showingTimes = event.getTblShowingTimes().stream().toList();

        return showingTimes.stream()
                .map(st -> ShowingTimeDTO.builder()
                        .id(st.getId())
                        .startTime(st.getStartTime())
                        .endTime(st.getEndTime())
                        .saleOpenTime(st.getSaleOpenTime())
                        .saleCloseTime(st.getSaleCloseTime())
                        .layoutMode(st.getLayoutMode())
                        .address(new AddressDTO(
                                st.getAddress().getId(),
                                st.getAddress().getVenueName(),
                                st.getAddress().getLocation(),
                                st.getAddress().getCity()
                        ))
                        .status(st.getStatus() != null ? st.getStatus().name() : null) // <-- map status
                        .build())
                .collect(Collectors.toList());
    }




}




