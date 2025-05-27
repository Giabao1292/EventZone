package com.example.backend.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Date;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class, HttpMessageNotReadableException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse exceptionHandler(Exception e, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setMessage(processMessage(e));
        errorResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        errorResponse.setTimestamp(new Date());
        errorResponse.setError(error(e));
        String path = request.getDescription(false).replace("uri=", "");
        errorResponse.setPath(path);
        return errorResponse;
    }

    @ExceptionHandler({MethodArgumentTypeMismatchException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadRequestException(Exception e, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setMessage(e.getMessage());
        errorResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        errorResponse.setTimestamp(new Date());
        errorResponse.setError(e.getClass().getSimpleName());
        String path = request.getDescription(false).replace("uri=", "");
        errorResponse.setPath(path);
        return errorResponse;
    }

    public String error(Exception e) {
        if (e instanceof ConstraintViolationException) {
            return "Parameter Invalid";
        } else if (e instanceof MethodArgumentNotValidException) {
            return "PayLoad Invalid";
        } else if (e instanceof MethodArgumentTypeMismatchException) {
            return "Failed to convert parameter";
        } else if (e instanceof HttpMessageNotReadableException) {
            return "Enum Invalid";
        } else {
            return "";
        }
    }

    public String processMessage(Exception e) {
        String message = e.getMessage();
        int firstIndex = 0, lastIndex = 0;
        if (e instanceof ConstraintViolationException || e instanceof HttpMessageNotReadableException) {
            firstIndex = message.lastIndexOf(":") + 1;
            lastIndex = message.length() + 1;
        } else if (e instanceof MethodArgumentNotValidException || e instanceof MethodArgumentTypeMismatchException) {
            firstIndex = message.lastIndexOf("[");
            lastIndex = message.lastIndexOf("]");
        }

        message = message.substring(firstIndex + 1, lastIndex - 1);
        return message;
    }
}
