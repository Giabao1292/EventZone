package com.example.backend.service;

import com.example.backend.model.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import org.springframework.scheduling.annotation.Async;

@RequiredArgsConstructor
@Slf4j
@Service
public class MailService {
    @Value("${spring.mail.username}")
    private String emailFrom;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final ImageService imageService;
    public void sendConfirmEmail(UserTemp user) throws MessagingException {
        log.info("Sending confirm email with verify code {}", user.getVerificationToken());
        MimeMessage messsage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(messsage, true, "UTF-8");
        Context context = new Context();
        Map<String, Object> properties = new HashMap<>();
        String link = "http://localhost:5173/verify-email?verifyToken=" + user.getVerificationToken();
        properties.put("linkVerifyToken", link);
        properties.put("fullName", user.getFullName());
        context.setVariables(properties);
        mimeMessageHelper.setTo(user.getEmail());
        mimeMessageHelper.setFrom(emailFrom);
        mimeMessageHelper.setSubject("Verify Your Email");
        mimeMessageHelper.setText(templateEngine.process("confirm-email.html", context), true);
        mailSender.send(messsage);
        log.info("Email has been sent successfully to {}", user.getEmail());
    }

    public void sendResetPasswordEmail(String toEmail, String token) throws MessagingException {
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        String subject = "Đặt lại mật khẩu tài khoản của bạn";
        String content = "Xin chào,<br>"
                + "Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu.<br>"
                + "Vui lòng nhấn vào link bên dưới để đặt lại mật khẩu:<br>"
                + "<a href=\"" + resetLink + "\">Đặt lại mật khẩu</a><br>"
                + "Nếu bạn không yêu cầu, vui lòng bỏ qua email này.<br>"
                + "Cảm ơn!";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(message);
    }
    public void sendTrackingEventEmail(User user, Event event) throws MessagingException {
        Set<ShowingTime> showingTimes = event.getTblShowingTimes();

        Optional<ShowingTime> firstTime = showingTimes.stream()
                .sorted(Comparator.comparing(ShowingTime::getStartTime))
                .findFirst();


        if (firstTime.isEmpty()) {
            log.warn("Không tìm thấy lịch diễn cho sự kiện: {}", event.getEventTitle());
            return;
        }

        ShowingTime showingTime = firstTime.get();
        String eventTitle = event.getEventTitle();
        LocalDateTime saleOpenTime = showingTime.getSaleOpenTime();
        LocalDateTime startTime = showingTime.getStartTime();

        // Chuẩn bị nội dung bằng Thymeleaf
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        Context context = new Context();
        Map<String, Object> properties = new HashMap<>();
        properties.put("fullName", user.getFullName());
        properties.put("eventTitle", eventTitle);
        properties.put("saleOpenTime", saleOpenTime);
        properties.put("eventStartTime", startTime);
        context.setVariables(properties);
        helper.setTo(user.getEmail());
        helper.setFrom(emailFrom);
        helper.setSubject("Bạn vừa theo dõi sự kiện: " + eventTitle);
        helper.setText(templateEngine.process("follow-event-email.html", context), true);

        mailSender.send(message);
        log.info("Đã gửi email thông báo theo dõi sự kiện cho {}", user.getEmail());
    }
    public void sendSimpleReminder(String email, String eventTitle, String type, LocalDateTime time) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        Context context = new Context();
        Map<String, Object> properties = new HashMap<>();
        properties.put("fullName", "bạn"); // fallback nếu không có tên user
        properties.put("eventTitle", eventTitle);
        properties.put("reminderType", type.equals("bán vé") ? "mở bán vé" : "diễn ra");
        properties.put("reminderTime", time.format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy")));
        context.setVariables(properties);

        helper.setTo(email);
        helper.setFrom(emailFrom);
        helper.setSubject("Nhắc bạn sự kiện sắp " + (type.equals("bán vé") ? "mở bán vé" : "diễn ra"));
        helper.setText(templateEngine.process("reminder-follow-event.html", context), true);

        mailSender.send(message);
    }

    @Async
    public void sendRescheduleEmailAsync(String toEmail, String eventTitle, String oldStartTime,
                                         String oldEndTime, String newStartTime, String newEndTime) {
        log.info("sendRescheduleEmailAsync called for email: {}", toEmail);
        try {
            // Giả sử sendRescheduleEmail nhận 6 tham số (không có fullName)
            sendRescheduleEmail(toEmail, eventTitle, oldStartTime, oldEndTime, newStartTime, newEndTime);
            log.info("Reschedule email sent successfully to {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send reschedule email notification asynchronously", e);
        }
    }



    public void sendRescheduleEmail(String toEmail, String eventTitle, String oldStartTime,
                                    String oldEndTime, String newStartTime, String newEndTime) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        Context context = new Context();
        Map<String, Object> properties = new HashMap<>();

        // Nếu bạn có tên người dùng thì thêm vào context, hoặc để mặc định "Bạn"
        properties.put("fullName", "Bạn");  // Hoặc lấy từ param nếu có
        properties.put("eventTitle", eventTitle);
        properties.put("oldStartTime", oldStartTime);
        properties.put("oldEndTime", oldEndTime);
        properties.put("newStartTime", newStartTime);
        properties.put("newEndTime", newEndTime);
        context.setVariables(properties);

        helper.setTo(toEmail);
        helper.setFrom(emailFrom);
        helper.setSubject("[Thông báo] Suất chiếu đã dời lịch");
        helper.setText(templateEngine.process("reschedule-email.html", context), true);

        mailSender.send(message);
    }


    public void sendRejectRescheduleEmail(String toEmail, String fullName, String eventTitle, String rejectReason) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        Context context = new Context();
        context.setVariable("fullName", fullName);
        context.setVariable("eventTitle", eventTitle);
        context.setVariable("rejectReason", rejectReason);

        helper.setTo(toEmail);
        helper.setFrom(emailFrom);
        helper.setSubject("[Thông báo] Yêu cầu dời lịch bị từ chối");
        helper.setText(templateEngine.process("reject-reschedule-email.html", context), true);

        mailSender.send(message);
    }
    public void sendBookingConfirmationEmail(User user, Booking booking) {
        log.info("Sending booking confirmation email to {} for booking ID {}", user.getEmail(), booking.getId());
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            Map<String, Object> properties = new HashMap<>();
            properties.put("fullName", user.getFullName() != null ? user.getFullName() : "Khách hàng");
            properties.put("eventTitle", booking.getShowingTime().getEvent().getEventTitle());
            properties.put("bookingId", booking.getId());
            properties.put("bookingDate", booking.getCreatedDatetime().format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy")));
            properties.put("eventDate", booking.getShowingTime().getStartTime().format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy")));
            properties.put("finalPrice", booking.getFinalPrice());

            // Địa chỉ sự kiện
            String address = booking.getShowingTime().getAddress() != null
                    ? booking.getShowingTime().getAddress().getVenueName() + " - " + booking.getShowingTime().getAddress().getLocation()
                    : "Không rõ địa điểm";
            properties.put("address", address);

            // QR Code
            String qrImageUrl = imageService.getQRCodeImageUrl(booking.getQrPublicId());
            properties.put("qrImageUrl", qrImageUrl != null ? qrImageUrl : "");

            // Ghép thông tin ghế
            StringBuilder seatInfo = new StringBuilder();
            if (booking.getTblBookingSeats() != null && !booking.getTblBookingSeats().isEmpty()) {
                for (BookingSeat bs : booking.getTblBookingSeats()) {
                    String zone = bs.getZone() != null ? bs.getZone().getZoneName() : "Không rõ khu";
                    String seat = bs.getSeat() != null ? bs.getSeat().getSeatLabel() : "Không rõ ghế";
                    seatInfo.append(zone).append(" - Seat ").append(seat).append("<br/>");
                }
            } else {
                seatInfo.append("Không có thông tin ghế<br/>");
            }
            properties.put("seatInfo", seatInfo.toString());

            context.setVariables(properties);

            helper.setTo(user.getEmail());
            helper.setFrom(emailFrom);
            helper.setSubject("Xác nhận đặt vé - " + booking.getShowingTime().getEvent().getEventTitle());

            String emailContent = templateEngine.process("booking-confirmation-email.html", context);
            helper.setText(emailContent, true);

            mailSender.send(message);
            log.info("Email sent to {}", user.getEmail());

        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", user.getEmail(), e.getMessage(), e);
        }
    }

    public void sendApproveRescheduleToOrganizer(
            String toEmail, String fullName, String eventTitle,
            String oldStartTime, String oldEndTime, String newStartTime, String newEndTime) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        Context context = new Context();
        context.setVariable("fullName", fullName);
        context.setVariable("eventTitle", eventTitle);
        context.setVariable("oldStartTime", oldStartTime);
        context.setVariable("oldEndTime", oldEndTime);
        context.setVariable("newStartTime", newStartTime);
        context.setVariable("newEndTime", newEndTime);

        helper.setTo(toEmail);
        helper.setFrom(emailFrom);
        helper.setSubject("[Thông báo] Yêu cầu dời lịch đã được phê duyệt");
        helper.setText(templateEngine.process("approve-reschedule-organizer.html", context), true);

        mailSender.send(message);
    }



}
