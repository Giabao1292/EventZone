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
        String linkConfirm = "http://localhost:5173/verify-email?token=" + verifyToken;
        Map<String, Object> properties = new HashMap<>();
        properties.put("linkConfirm", linkConfirm);
        context.setVariables(properties);
        mimeMessageHelper.setTo(emailTo);
        mimeMessageHelper.setFrom(emailFrom);
        mimeMessageHelper.setSubject("Verify Your Email");
        mimeMessageHelper.setText(templateEngine.process("confirm-email.html", context), true);
        mailSender.send(messsage);
        log.info("Email has been sent successfully to {}", emailTo);
    }
}
