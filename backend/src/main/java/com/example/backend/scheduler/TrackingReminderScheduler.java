package com.example.backend.scheduler;

import com.example.backend.dto.projection.ReminderInfo;
import com.example.backend.model.Event;
import com.example.backend.model.TrackingEventUpcoming;
import com.example.backend.model.User;
import com.example.backend.model.ShowingTime;
import com.example.backend.repository.TrackingEventUpcomingRepository;
import com.example.backend.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class TrackingReminderScheduler {

    private final TrackingEventUpcomingRepository trackingRepo;
    private final MailService mailService;

    // 5 phuts quet 1 lan
    @Scheduled(fixedRate = 1 * 60 * 1000)
    public void checkAndSendReminders() {
        log.info("=== Bắt đầu quét reminder ===");
        List<ReminderInfo> allTracking = trackingRepo.getReminderInfo();
        log.info(">>> Tổng tracking: {}", allTracking.size());

        LocalDateTime now = LocalDateTime.now();

        for (ReminderInfo info : allTracking) {
            String eventTitle = info.getEventTitle();
            String email = info.getUserEmail();
            LocalDateTime startTime = info.getStartTime();
            LocalDateTime saleOpenTime = info.getSaleOpenTime();

            log.info(">>> Đang check: {} - startTime: {}, saleOpenTime: {}", eventTitle, startTime, saleOpenTime);

            sendReminderIfMatched(email, eventTitle, saleOpenTime, now, "bán vé");
            sendReminderIfMatched(email, eventTitle, startTime, now, "diễn ra");
        }
    }
    private void sendReminderIfMatched(String email, String eventTitle, LocalDateTime targetTime, LocalDateTime now, String type) {
        long minutesUntil = ChronoUnit.MINUTES.between(now, targetTime);
        log.info(">>> Còn {} phút đến {} của sự kiện '{}'", minutesUntil, type, eventTitle);

        if (minutesUntil == 1 || minutesUntil == 2) {
            try {
                mailService.sendSimpleReminder(email, eventTitle, type, targetTime);
                log.info(">>> Gửi nhắc {} sự kiện '{}' cho {}", type, eventTitle, email);
            } catch (Exception e) {
                log.error(">>> Lỗi gửi nhắc nhở: " + e.getMessage());
            }
        }
    }



}