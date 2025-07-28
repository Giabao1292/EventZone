package com.example.backend.exception;

import com.example.backend.service.MessageService;
import io.jsonwebtoken.JwtException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Date;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private MessageService messageService;

    // Xử lý lỗi validate @Valid cho DTO
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationError(MethodArgumentNotValidException ex, WebRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return buildErrorResponse(HttpStatus.BAD_REQUEST, messageService.getValidationError(), message, request);
    }
    //Xử lý lỗi @RequestParam, @PathVariabl không hợp lệ

    @ExceptionHandler({MethodArgumentTypeMismatchException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleTypeMismatch(MethodArgumentTypeMismatchException ex, WebRequest request) {
        String message = "Không thể chuyển đổi tham số '" + ex.getName() + "' sang kiểu dữ liệu yêu cầu";
        return buildErrorResponse(HttpStatus.BAD_REQUEST, messageService.getValidationError(), message, request);
    }

    // Xử lý lỗi vi phạm constraint (validate @RequestParam, @PathVariable)
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConstraintViolation(ConstraintViolationException ex, WebRequest request) {
        String message = ex.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .collect(Collectors.joining(", "));
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Vi phạm ràng buộc", message, request);
    }

    // Xử lý lỗi Enum hoặc JSON không đọc được
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleNotReadable(HttpMessageNotReadableException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "JSON không đúng định dạng hoặc Enum không hợp lệ", ex.getMostSpecificCause().getMessage(), request);
    }

    // Xử lý lỗi do bạn custom, ví dụ: username/email/phone đã tồn tại
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Lỗi tài nguyên", ex.getMessage(), request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadCredentials(Exception ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, messageService.getInvalidCredentials(), messageService.getPasswordIncorrect(), request);
    }
    @ExceptionHandler(JwtException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleJwtException(JwtException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, messageService.getUnauthorized(), ex.getMessage(), request);
    }
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleIllegalArgument(IllegalArgumentException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, messageService.getBadRequest(), ex.getMessage(), request);
    }

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleAuthenticationFailure(AuthenticationException ex, WebRequest request) {
        String message = switch (ex.getClass().getSimpleName()) {
            case "DisabledException" -> messageService.getMessage("user.account.disabled");
            case "LockedException" -> messageService.getMessage("user.account.locked");
            case "AccountExpiredException" -> messageService.getMessage("user.account.expired");
            case "CredentialsExpiredException" -> messageService.getMessage("user.credentials.expired");
            default -> messageService.getUserNotFound();
        };
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Lỗi xác thực", message, request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleAccessDenied(AccessDeniedException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, messageService.getForbidden(), "Bạn không có quyền truy cập dữ liệu này", request);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleAllUnhandled(Exception ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, messageService.getInternalError(), ex.getMessage(), request);
    }

    // Hàm helper để build JSON phản hồi
    private ErrorResponse buildErrorResponse(HttpStatus status, String error, String message, WebRequest request) {
        ErrorResponse err = new ErrorResponse();
        err.setTimestamp(new Date());
        err.setStatus(status.value());
        err.setError(error);
        err.setMessage(message);
        err.setPath(request.getDescription(false).replace("uri=", ""));
        return err;
    }
}
