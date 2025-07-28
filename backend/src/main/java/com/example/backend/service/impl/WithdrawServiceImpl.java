package com.example.backend.service.impl;

import com.example.backend.dto.request.WithdrawEligibleEventDTO;
import com.example.backend.dto.request.WithdrawRequestDTO;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.WithdrawService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@RequiredArgsConstructor
@Service
public class WithdrawServiceImpl implements WithdrawService {
    private static final Logger logger = LoggerFactory.getLogger(WithdrawServiceImpl.class);
    private final EventRepository eventRepository;

    private  final ShowingTimeRepository showingTimeRepository;

    private final  BookingRepository bookingRepository;
    private final UserBankAccountRepository userBankAccountRepository;
    private final WithdrawRequestRepository withdrawRequestRepository;
    private final OrganizerRepository organizerRepository;
    @Override
    @Transactional(readOnly = true)
    public List<WithdrawEligibleEventDTO> getEligibleEventsForWithdrawal(User user) {
        // Bước 1: Kiểm tra user và lấy Organizer
        logger.info("Bắt đầu xử lý cho user: {}", user.getEmail());
        Organizer organizer = user.getOrganizer();
        if (organizer == null) {
            logger.warn("User {} không có Organizer liên kết. Trả về danh sách rỗng.", user.getEmail());
            return new ArrayList<>();
        }
        logger.info("Tìm thấy Organizer ID: {}", organizer.getId());

        // Bước 2: Lấy danh sách sự kiện của Organizer
        List<Event> events = eventRepository.findByOrganizer_Id(organizer.getId());
        logger.info("Tìm thấy {} sự kiện cho Organizer ID: {}", events.size(), organizer.getId());

        // Bước 3: Xử lý từng sự kiện để lấy suất chiếu đủ điều kiện
        List<WithdrawEligibleEventDTO> eligibleEvents = new ArrayList<>();
        for (Event event : events) {
            logger.info("Xử lý sự kiện: {} (ID: {})", event.getEventTitle(), event.getId());

            // Lấy các suất chiếu đã kết thúc
            List<ShowingTime> completedShowings = showingTimeRepository
                    .findByEventIdAndEndTimeBefore(event.getId(), LocalDateTime.now());
            logger.info("Sự kiện ID: {} có {} suất chiếu đã kết thúc", event.getId(), completedShowings.size());

            // Xử lý từng suất chiếu
            for (ShowingTime showing : completedShowings) {
                logger.info("Kiểm tra suất chiếu ID: {}, kết thúc lúc: {}", showing.getId(), showing.getEndTime());

                // Tính doanh thu
                BigDecimal revenue = calculateRevenueForShowing(showing.getId());
                logger.info("Doanh thu của suất chiếu ID: {} là {}", showing.getId(), revenue);

                // Kiểm tra yêu cầu rút tiền đang chờ
                boolean hasPendingRequest = withdrawRequestRepository
                        .existsByShowingTimeIdAndStatus(showing.getId(), PaymentStatus.PENDING);
                logger.info("Suất chiếu ID: {} có yêu cầu rút tiền đang chờ: {}", showing.getId(), hasPendingRequest);

                // Kiểm tra điều kiện đủ điều kiện
                if (revenue.compareTo(BigDecimal.ZERO) > 0 && !hasPendingRequest) {
                    logger.info("Suất chiếu ID: {} đủ điều kiện rút tiền", showing.getId());
                    WithdrawEligibleEventDTO dto = new WithdrawEligibleEventDTO(
                            event.getId(),
                            event.getEventTitle(),
                            showing.getId(),
                            showing.getStartTime(),
                            showing.getEndTime(),
                            revenue
                    );
                    eligibleEvents.add(dto);
                } else {
                    logger.info("Suất chiếu ID: {} KHÔNG đủ điều kiện: doanh thu = {}, có yêu cầu đang chờ = {}",
                            showing.getId(), revenue, hasPendingRequest);
                }
            }
        }

        logger.info("Tổng cộng tìm thấy {} suất chiếu đủ điều kiện rút tiền", eligibleEvents.size());
        return eligibleEvents;
    }

    private BigDecimal calculateRevenueForShowing(Integer showingTimeId) {
        logger.info("Tính doanh thu cho suất chiếu ID: {}", showingTimeId);
        List<Booking> bookings = bookingRepository.findByShowingTimeIdAndPaymentStatus(showingTimeId, "CONFIRMED");
        logger.info("Tìm thấy {} booking với trạng thái PAID cho suất chiếu ID: {}", bookings.size(), showingTimeId);

        BigDecimal totalRevenue = bookings.stream()
                .map(booking -> {
                    logger.info("Booking ID: {}, finalPrice: {}", booking.getId(), booking.getFinalPrice());
                    return booking.getFinalPrice();
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        logger.info("Tổng doanh thu cho suất chiếu ID: {} là {}", showingTimeId, totalRevenue);
        return totalRevenue;
    }
    @Override
    @Transactional
    public WithdrawRequest createWithdrawRequest(User user, WithdrawRequestDTO requestDTO) {
        logger.info("Bắt đầu xử lý yêu cầu rút tiền cho user: {}", user.getEmail());

        // Kiểm tra Organizer
        Organizer organizer = user.getOrganizer();
        if (organizer == null) {
            logger.error("User {} không có Organizer liên kết", user.getEmail());
            throw new RuntimeException("User không có quyền tạo yêu cầu rút tiền");
        }

        // Kiểm tra sự kiện
        Event event = eventRepository.findById(requestDTO.getEventId())
                .orElseThrow(() -> {
                    logger.error("Không tìm thấy sự kiện ID: {}", requestDTO.getEventId());
                    return new RuntimeException("Sự kiện không tồn tại");
                });

        // Kiểm tra quyền sở hữu sự kiện
        if (!event.getOrganizer().getId().equals(organizer.getId())) {
            logger.error("User {} không có quyền truy cập sự kiện ID: {}", user.getEmail(), requestDTO.getEventId());
            throw new RuntimeException("Không có quyền truy cập sự kiện này");
        }

        // Kiểm tra suất chiếu
        ShowingTime showingTime = showingTimeRepository.findById(requestDTO.getShowingTimeId())
                .orElseThrow(() -> {
                    logger.error("Không tìm thấy suất chiếu ID: {}", requestDTO.getShowingTimeId());
                    return new RuntimeException("Suất chiếu không tồn tại");
                });

        // Kiểm tra suất chiếu thuộc sự kiện
        if (!showingTime.getEvent().getId().equals(event.getId())) {
            logger.error("Suất chiếu ID: {} không thuộc sự kiện ID: {}",
                    requestDTO.getShowingTimeId(), requestDTO.getEventId());
            throw new RuntimeException("Suất chiếu không thuộc sự kiện này");
        }

        // Kiểm tra thời gian kết thúc
        if (showingTime.getEndTime().isAfter(LocalDateTime.now())) {
            logger.error("Suất chiếu ID: {} chưa kết thúc", requestDTO.getShowingTimeId());
            throw new RuntimeException("Suất chiếu chưa kết thúc");
        }

        // Kiểm tra yêu cầu rút tiền đang chờ
        if (withdrawRequestRepository.existsByShowingTimeIdAndStatus(
                requestDTO.getShowingTimeId(), PaymentStatus.PENDING)) {
            logger.error("Đã tồn tại yêu cầu rút tiền đang chờ cho suất chiếu ID: {}",
                    requestDTO.getShowingTimeId());
            throw new RuntimeException("Đã tồn tại yêu cầu rút tiền đang chờ");
        }

        // Kiểm tra số tiền
        BigDecimal availableRevenue = calculateRevenueForShowing(requestDTO.getShowingTimeId());
        if (requestDTO.getAmount().compareTo(availableRevenue) > 0) {
            logger.error("Số tiền yêu cầu {} lớn hơn doanh thu khả dụng {} cho suất chiếu ID: {}",
                    requestDTO.getAmount(), availableRevenue, requestDTO.getShowingTimeId());
            throw new RuntimeException("Số tiền yêu cầu vượt quá doanh thu khả dụng");
        }

        // Tạo yêu cầu rút tiền
        WithdrawRequest withdrawRequest = new WithdrawRequest();
        UserBankAccount userBankAccount =  userBankAccountRepository.findByAccountNumberAndBankName(requestDTO.getBankAccountNumber(), requestDTO.getBankName());
        withdrawRequest.setOrganizer(organizer);
        withdrawRequest.setEvent(event);
        withdrawRequest.setShowingTime(showingTime);
        withdrawRequest.setAmount(requestDTO.getAmount());
        withdrawRequest.setUserBankAccount(userBankAccount);
        withdrawRequest.setNote(requestDTO.getNote());
        withdrawRequest.setStatus(PaymentStatus.PENDING);
        withdrawRequest.setRequestedAt(LocalDateTime.now());

        // Lưu yêu cầu
        WithdrawRequest savedRequest = withdrawRequestRepository.save(withdrawRequest);
        logger.info("Tạo yêu cầu rút tiền thành công. ID: {}", savedRequest.getId());

        return savedRequest;
    }
    @Override
    @Transactional
    public void approveWithdrawRequest(Integer requestId) {
        WithdrawRequest request = withdrawRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Yêu cầu không tồn tại"));
        if (request.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Yêu cầu đã được xử lý trước đó");
        }
        request.setStatus(PaymentStatus.CONFIRMED);
        request.setProcessedAt(LocalDateTime.now());
        withdrawRequestRepository.save(request);
    }

    @Override
    @Transactional
    public void rejectWithdrawRequest(Integer requestId, String reason) {
        WithdrawRequest request = withdrawRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Yêu cầu không tồn tại"));
        if (request.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Yêu cầu đã được xử lý trước đó");
        }
        request.setStatus(PaymentStatus.CANCELLED);
        request.setRejectionReason(reason);
        request.setProcessedAt(LocalDateTime.now());
        withdrawRequestRepository.save(request);
    }

    @Override
    public List<WithdrawRequestDTO> getProcessedRequests() {
        return withdrawRequestRepository.findByStatusIn(List.of(PaymentStatus.CONFIRMED, PaymentStatus.CANCELLED))
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    @Override
    public List<WithdrawRequestDTO> getAllRequests() {
        return withdrawRequestRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    @Override
    public List<WithdrawRequestDTO> getRequestsByUser(User user) {
        Organizer organizer = user.getOrganizer();
        if (organizer == null) {
            throw new RuntimeException("User không có organizer liên kết");
        }

        List<WithdrawRequest> requests = withdrawRequestRepository
                .findByOrganizerIdOrderByRequestedAtDesc(organizer.getId());

        return requests.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private WithdrawRequestDTO toDTO(WithdrawRequest r) {
        WithdrawRequestDTO dto = new WithdrawRequestDTO();
        UserBankAccount userBankAccount = r.getUserBankAccount();
        dto.setId(r.getId());
        dto.setAmount(r.getAmount());
        dto.setBankAccountName(userBankAccount.getBankName());
        dto.setBankAccountNumber(userBankAccount.getAccountNumber());
        dto.setBankName(userBankAccount.getBankName());
        dto.setNote(r.getNote());
        dto.setRequestedAt(r.getRequestedAt());
        dto.setProcessedAt(r.getProcessedAt());
        dto.setStatus(r.getStatus());
        dto.setRejectionReason(r.getRejectionReason());
        dto.setEventTitle(r.getEvent().getEventTitle());
        dto.setOrganizerName(r.getOrganizer().getOrgName());
        return dto;
    }
}