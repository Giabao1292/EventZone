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

    public void sendResetPasswordEmail(String emailTo, String resetToken) throws MessagingException {
        log.info("Sending reset password email with token {}", resetToken);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(message, true, "UTF-8");

        Context context = new Context();
        Map<String, Object> properties = new HashMap<>();
        properties.put("resetToken", resetToken);
        properties.put("resetLink", "http://localhost:8080/auth/reset-password?token=" + resetToken);
        context.setVariables(properties);

        mimeMessageHelper.setTo(emailTo);
        mimeMessageHelper.setFrom(emailFrom);
        mimeMessageHelper.setSubject("Reset Your Password");
        mimeMessageHelper.setText(templateEngine.process("reset-password-email.html", context), true);

        mailSender.send(message);
        log.info("Reset password email has been sent successfully to {}", emailTo);
    }

}
