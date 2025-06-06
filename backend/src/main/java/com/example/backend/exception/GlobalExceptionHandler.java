package com.example.backend.exception;

import jakarta.validation.ConstraintViolationException;
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

    // Xử lý lỗi validate @Valid cho DTO
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationError(MethodArgumentNotValidException ex, WebRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Parameter Invalid", message, request);
    }
    //Xử lý lỗi @RequestParam, @PathVariabl không hợp lệ


    @ExceptionHandler({MethodArgumentTypeMismatchException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleTypeMismatch(MethodArgumentTypeMismatchException ex, WebRequest request) {
        String message = "Failed to convert parameter '" + ex.getName() + "' to required type";
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Parameter Invalid", message, request);
    }

    // Xử lý lỗi vi phạm constraint (validate @RequestParam, @PathVariable)
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConstraintViolation(ConstraintViolationException ex, WebRequest request) {
        String message = ex.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .collect(Collectors.joining(", "));
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Constraint Violation", message, request);
    }

    // Xử lý lỗi Enum hoặc JSON không đọc được
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleNotReadable(HttpMessageNotReadableException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Malformed JSON or Enum Invalid", ex.getMostSpecificCause().getMessage(), request);
    }

    // Xử lý lỗi do bạn custom, ví dụ: username/email/phone đã tồn tại
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Resource Error", ex.getMessage(), request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadCredentials(Exception ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Credentials", "Wrong username or password", request);
    }
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleIllegalArgument(IllegalArgumentException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Illegal Argument", ex.getMessage(), request);
    }

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleAuthenticationFailure(AuthenticationException ex, WebRequest request) {
        String message = switch (ex.getClass().getSimpleName()) {
            case "DisabledException" -> "Your account is not activated";
            case "LockedException" -> "Your account is locked";
            case "AccountExpiredException" -> "Your account has expired";
            case "CredentialsExpiredException" -> "Your credentials have expired";
            default -> "Account not found";
        };
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Authentication Error", message, request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleAccessDenied(AccessDeniedException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Access denied", "You don't have permission to access this data", request);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleAllUnhandled(Exception ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", ex.getMessage(), request);
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
