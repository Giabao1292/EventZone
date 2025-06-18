package com.example.backend.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import com.example.backend.model.UserTemp;
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
import com.example.backend.model.User;
import com.example.backend.model.Event;
import com.example.backend.model.ShowingTime;

@RequiredArgsConstructor
@Slf4j
@Service
public class MailService {
    @Value("${spring.mail.username}")
    private String emailFrom;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
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
    public void sendReminderTrackingEventEmail(User user, Event event, String type, LocalDateTime time) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        Context context = new Context();
        Map<String, Object> properties = new HashMap<>();
        properties.put("fullName", user.getFullName());
        properties.put("eventTitle", event.getEventTitle());
        properties.put("reminderType", type.equals("bán vé") ? "mở bán vé" : "diễn ra");
        properties.put("reminderTime", time.format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy")));

        context.setVariables(properties);

        helper.setTo(user.getEmail());
        helper.setFrom(emailFrom);
        helper.setSubject(" Nhắc bạn sự kiện sắp " + (type.equals("bán vé") ? "mở bán vé" : "diễn ra"));
        helper.setText(templateEngine.process("reminder-follow-event.html", context), true);

        mailSender.send(message);
    }



}
