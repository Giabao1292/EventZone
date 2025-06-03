package com.example.backend.service;

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

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@Service
public class MailService {
    @Value("${spring.mail.username}")
    private String emailFrom;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final MailProperties mailProperties;
    public void sendConfirmEmail(String emailTo, String verifyToken) throws MessagingException {
        log.info("Sending confirm email with verify code {}", verifyToken);
        MimeMessage messsage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(messsage, true, "UTF-8");
        Context context = new Context();
        Map<String, Object> properties = new HashMap<>();
        properties.put("verifyToken", verifyToken);
        context.setVariables(properties);
        mimeMessageHelper.setTo(emailTo);
        mimeMessageHelper.setFrom(emailFrom);
        mimeMessageHelper.setSubject("Verify Your Email");
        mimeMessageHelper.setText(templateEngine.process("confirm-email.html", context), true);
        mailSender.send(messsage);
        log.info("Email has been sent successfully to {}", emailTo);
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

}
