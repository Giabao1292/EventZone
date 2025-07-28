package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class MessageService {
    
    @Autowired
    private MessageSource messageSource;
    
    public String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }
    
    public String getMessage(String code, Object... args) {
        return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
    }
    
    // Các phương thức tiện ích cho các thông báo thường dùng
    public String getUserNotFound() {
        return getMessage("user.not.found");
    }
    
    public String getEmailExists() {
        return getMessage("user.email.exists");
    }
    
    public String getInvalidCredentials() {
        return getMessage("user.invalid.credentials");
    }
    
    public String getPasswordIncorrect() {
        return getMessage("user.password.incorrect");
    }
    
    public String getPasswordMismatch() {
        return getMessage("user.password.mismatch");
    }
    
    public String getEventNotFound() {
        return getMessage("event.not.found");
    }
    
    public String getBookingNotFound() {
        return getMessage("booking.not.found");
    }
    
    public String getVoucherNotFound() {
        return getMessage("voucher.not.found");
    }
    
    public String getVoucherInactiveExpired() {
        return getMessage("voucher.inactive.expired");
    }
    
    public String getNotEnoughPoints() {
        return getMessage("voucher.not.enough.points");
    }
    
    public String getAlreadyRedeemed() {
        return getMessage("voucher.already.redeemed");
    }
    
    public String getInvalidPaymentMethod() {
        return getMessage("payment.invalid.method");
    }
    
    public String getSeatNotFound() {
        return getMessage("booking.seat.not.found");
    }
    
    public String getSeatTaken() {
        return getMessage("booking.seat.taken");
    }
    
    public String getZoneNotFound() {
        return getMessage("booking.zone.not.found");
    }
    
    public String getNotEnoughTickets() {
        return getMessage("booking.not.enough.tickets");
    }
    
    public String getShowingTimeNotFound() {
        return getMessage("booking.showing.time.not.found");
    }
    
    public String getRoleNotFound() {
        return getMessage("role.not.found");
    }
    
    public String getInvalidToken() {
        return getMessage("verification.invalid.token");
    }
    
    public String getMissingToken() {
        return getMessage("verification.missing.token");
    }
    
    public String getWrongCode() {
        return getMessage("verification.wrong.code");
    }
    
    public String getCodeExpired() {
        return getMessage("verification.code.expired");
    }
    
    public String getExpiredTime() {
        return getMessage("verification.expired.time");
    }
    
    public String getGoogleInvalidToken() {
        return getMessage("google.invalid.token");
    }
    
    public String getQrGenerationFailed() {
        return getMessage("qr.generation.failed");
    }
    
    public String getEmailResetFailed() {
        return getMessage("email.reset.failed");
    }
    
    public String getTokenExpired() {
        return getMessage("email.token.expired");
    }
    
    public String getCategoryNotFound() {
        return getMessage("category.not.found");
    }
    
    public String getOrganizerNotFound() {
        return getMessage("organizer.not.found");
    }
    
    public String getUploadFailed() {
        return getMessage("organizer.upload.failed");
    }
    
    public String getSystemError() {
        return getMessage("organizer.system.error");
    }
    
    public String getFieldNotFound(String fieldName) {
        return getMessage("error.not.found") + " trường '" + fieldName + "'";
    }
    
    public String getValidationError() {
        return getMessage("error.validation");
    }
    
    public String getUnauthorized() {
        return getMessage("error.unauthorized");
    }
    
    public String getForbidden() {
        return getMessage("error.forbidden");
    }
    
    public String getInternalError() {
        return getMessage("error.internal");
    }
    
    public String getBadRequest() {
        return getMessage("error.bad.request");
    }
} 