package com.example.Movie_Ticket_Booking_System.exception;

import com.example.Movie_Ticket_Booking_System.domain.dto.response.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

public class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    @DisplayName("Bắt lỗi ResourceNotFoundException và trả về 404")
    void testHandleResourceNotFound() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Account", "id", "123");
        ResponseEntity<ApiResponse<Void>> responseEntity = exceptionHandler.handleResourceNotFound(ex);

        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(404, responseEntity.getBody().getStatusCode());
        assertTrue(responseEntity.getBody().getMessage().contains("Account"));
        assertEquals("Not Found", responseEntity.getBody().getError());
    }

    @Test
    @DisplayName("Bắt lỗi DuplicateResourceException và trả về 409 Conflict")
    void testHandleDuplicateResource() {
        DuplicateResourceException ex = new DuplicateResourceException("Account", "email", "test@gmail.com");
        ResponseEntity<ApiResponse<Void>> responseEntity = exceptionHandler.handleDuplicateResource(ex);

        assertEquals(HttpStatus.CONFLICT, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(409, responseEntity.getBody().getStatusCode());
        assertTrue(responseEntity.getBody().getMessage().contains("test@gmail.com"));
        assertEquals("Conflict", responseEntity.getBody().getError());
    }

    @Test
    @DisplayName("Bắt lỗi hệ thống thông thường (Exception) và trả về 500")
    void testHandleGeneralException() {
        Exception ex = new Exception("Some unexpected error!");
        ResponseEntity<ApiResponse<Void>> responseEntity = exceptionHandler.handleGeneral(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(500, responseEntity.getBody().getStatusCode());
        assertEquals("Internal Server Error", responseEntity.getBody().getError());
        assertEquals("Đã xảy ra lỗi hệ thống, vui lòng thử lại sau", responseEntity.getBody().getMessage());
    }
}
