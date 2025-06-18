package com.example.backend.scheduler;

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
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void checkAndSendReminders() {
        List<TrackingEventUpcoming> allTracking = trackingRepo.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (TrackingEventUpcoming tracking : allTracking) {
            Event event = tracking.getEvent();
            User user = tracking.getUser();

            Set<ShowingTime> showingTimes = event.getTblShowingTimes();
            Optional<ShowingTime> first = showingTimes.stream()
                    .sorted(Comparator.comparing(ShowingTime::getStartTime))
                    .findFirst();

            if (first.isEmpty()) continue;

            ShowingTime st = first.get();
            sendReminderIfMatched(user, event, st.getSaleOpenTime(), now, "bán vé");
            sendReminderIfMatched(user, event, st.getStartTime(), now, "diễn ra");
        }
    }

    private void sendReminderIfMatched(User user, Event event, LocalDateTime targetTime, LocalDateTime now, String type) {
        long hoursUntil = ChronoUnit.HOURS.between(now, targetTime);
        if (hoursUntil == 72 || hoursUntil == 24 || hoursUntil == 6) {
            try {
                mailService.sendReminderTrackingEventEmail(user, event, type, targetTime);
                log.info(" Gửi nhắc {} sự kiện '{}' cho {}", type, event.getEventTitle(), user.getEmail());
            } catch (Exception e) {
                log.error(" Lỗi gửi nhắc nhở: " + e.getMessage());
            }
        }
    }
}
