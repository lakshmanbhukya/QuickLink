package com.quicklink.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex){
        Map<String,Object> errors = new HashMap<>();
        for(FieldError fieldError : ex.getBindingResult().getFieldErrors()){
            errors.put(fieldError.getField(),fieldError.getDefaultMessage());
        }
        Map<String,Object> body=Map.of(
                "status",400,
                "errors",errors,
                "timestamp", Instant.now()
        );
        return ResponseEntity.badRequest().body(body);
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleBadRequest(IllegalArgumentException ex){
        Map<String,Object> body = new HashMap<>();
        body.put("status", 400);
        body.put("errors", ex.getMessage() != null ? ex.getMessage() : "Invalid argument");
        body.put("timestamp", Instant.now());
        return ResponseEntity.badRequest().body(body);
    }
}

