package com.example.backend.service;

import com.example.backend.dto.response.NotificationResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Booking;
import com.example.backend.model.Notification;
import com.example.backend.model.User;
import com.example.backend.repository.NotificationRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    private final UserRepository userRepository;

    public void sendNotificationToUser(String username, NotificationResponse notification) {
        log.info(">>> Sending to username = {}", username);
        log.info(">>> Principal usernames: {}", SecurityContextHolder.getContext().getAuthentication().getName());
        messagingTemplate.convertAndSendToUser(username, "/queue/notifications", notification);
    }

    public void notifyRoleApproved(User user) {
        NotificationResponse dto = NotificationResponse.builder()
                .title("Bạn đã trở thành Organizer!")
                .content("Tài khoản của bạn đã được phê duyệt trở thành người tổ chức sự kiện.")
                .redirectPath("/register-organizer").build();
        sendNotificationToUser(user.getUsername(), dto);
        Notification entity = createNotification(user, dto);
        notificationRepository.save(entity);
    }

    public void notifyRoleRejected(User user) {
        NotificationResponse dto = NotificationResponse.builder()
                .title("Yêu cầu trở thành Organizer đã bị từ chối")
                .content("Rất tiếc! Tài khoản của bạn không đủ điều kiện để trở thành người tổ chức sự kiện.")
                .redirectPath("/register-organizer")
                .build();
        sendNotificationToUser(user.getUsername(), dto);
        Notification entity = createNotification(user, dto);
        notificationRepository.save(entity);
    }

    public void notifyOrganizerRegistration(User requester) {
        NotificationResponse dto = NotificationResponse.builder()
                .title("Yêu cầu xét duyệt Organizer")
                .content("Người dùng " + requester.getFullName() + " (" + requester.getEmail() + ") vừa yêu cầu trở thành nhà tổ chức sự kiện.")
                .redirectPath("/admin/organizers")
                .build();

        List<User> adminUsers = userRepository.findUserByRoleName("ADMIN");

        for (User admin : adminUsers) {
            sendNotificationToUser(admin.getUsername(), dto);
            Notification entity = createNotification(admin, dto);
            notificationRepository.save(entity);
        }
    }

    private static Notification createNotification(User user, NotificationResponse dto) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(dto.getTitle());
        notification.setContent(dto.getContent());
        notification.setRedirectPath(dto.getRedirectPath());
        notification.setIsRead(Boolean.FALSE);
        notification.setCreatedAt(Instant.now());
        return notification;
    }

    public List<NotificationResponse> getAllNotifications(String username) {
        User user = userService.findByUsername(username);
        return user.getTblNotifications().stream().map(notification -> NotificationResponse.builder()
                .id(notification.getId())
                .isRead(notification.getIsRead())
                .title(notification.getTitle())
                .content(notification.getContent())
                .redirectPath(notification.getRedirectPath())
                .createdAt(notification.getCreatedAt())
                .build()).toList();
    }

    public Integer countUnread(String username) {
        User user = userService.findByUsername(username);
        return user.getTblNotifications().stream().filter(notify -> !notify.getIsRead()).toList().size();
    }

    public void readNotify(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);

    }

    public void readAll(String username) {
        User user = userService.findByUsername(username);
        user.getTblNotifications().stream().filter(notification -> !notification.getIsRead())
                .forEach(notification -> {
                    notification.setIsRead(true);
                    notificationRepository.save(notification);
                });
    }

    public void delete(Long id) {
        notificationRepository.deleteById(id);
    }

    public void deleteAllRead(String username) {
        User user = userService.findByUsername(username);
        List<Long> listIds = user.getTblNotifications().stream().filter(Notification::getIsRead).map(Notification::getId).toList();
        notificationRepository.deleteAllById(listIds);
    }

    public void notifyRescheduleToBuyers(List<User> buyers, String eventTitle, String oldStart, String oldEnd, String newStart, String newEnd, String redirectPath) {
        String title = "Thông báo dời lịch suất chiếu";
        String content = "Suất chiếu của sự kiện '" + eventTitle + "' bạn đã mua đã thay đổi thời gian. Vui lòng kiểm tra lại lịch mới.";

        for (User user : buyers) {
            NotificationResponse dto = NotificationResponse.builder()
                    .title(title)
                    .content(content)
                    .redirectPath(redirectPath)
                    .build();
            sendNotificationToUser(user.getUsername(), dto);
            Notification entity = createNotification(user, dto);
            notificationRepository.save(entity);
        }
    }

    // Thông báo cho organizer khi yêu cầu DỜI LỊCH của họ được duyệt
    public void notifyRescheduleApproved(User organizer, String eventTitle, String oldStart, String oldEnd, String newStart, String newEnd, String redirectPath) {
        String title = "Yêu cầu dời lịch đã được phê duyệt";
        String content = "Yêu cầu dời lịch suất chiếu của sự kiện '" + eventTitle + "' đã được admin phê duyệt.\n"
                + "Thời gian cũ: " + oldStart + " - " + oldEnd + "\n"
                + "Thời gian mới: " + newStart + " - " + newEnd;

        NotificationResponse dto = NotificationResponse.builder()
                .title(title)
                .content(content)
                .redirectPath(redirectPath)
                .build();
        sendNotificationToUser(organizer.getUsername(), dto);
        Notification entity = createNotification(organizer, dto);
        notificationRepository.save(entity);
    }
    public void notifyBookingConfirmation(User user, Booking booking) {
        String eventTitle = booking.getShowingTime().getEvent().getEventTitle();
        NotificationResponse dto = NotificationResponse.builder()
                .title("Đặt vé thành công")
                .content(String.format("Bạn đã đặt vé thành công cho sự kiện %s. Vui lòng kiểm tra email để xem chi tiết vé.", eventTitle))
                .redirectPath("/booking-history")
                .build();
        sendNotificationToUser(user.getUsername(), dto);
        Notification entity = createNotification(user, dto);
        notificationRepository.save(entity);
    }


    // Thông báo cho organizer khi yêu cầu dời lịch BỊ TỪ CHỐI
    public void notifyRescheduleRejected(User organizer, String eventTitle, String rejectReason, String redirectPath) {
        NotificationResponse dto = NotificationResponse.builder()
                .title("Yêu cầu dời lịch bị từ chối")
                .content("Yêu cầu dời lịch cho sự kiện '" + eventTitle + "' đã bị từ chối.\nLý do: " + rejectReason)
                .redirectPath(redirectPath)
                .build();
        sendNotificationToUser(organizer.getUsername(), dto);
        Notification entity = createNotification(organizer, dto);
        notificationRepository.save(entity);
    }








}
