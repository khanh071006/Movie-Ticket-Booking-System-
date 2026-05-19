package com.example.Movie_Ticket_Booking_System.domain.dto.response;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ApiResponseTest {

    @Test
    @DisplayName("Tạo ApiResponse thành công (success) với data")
    void testSuccess() {
        String data = "Test Data";
        ApiResponse<String> response = ApiResponse.success(data);

        assertEquals(200, response.getStatusCode());
        assertEquals("Success", response.getMessage());
        assertEquals(data, response.getData());
        assertNull(response.getError());
        assertNull(response.getDetails());
    }

    @Test
    @DisplayName("Tạo ApiResponse thành công (created) với data")
    void testCreated() {
        String data = "New Resource";
        ApiResponse<String> response = ApiResponse.created("Resource created", data);

        assertEquals(201, response.getStatusCode());
        assertEquals("Resource created", response.getMessage());
        assertEquals(data, response.getData());
        assertNull(response.getError());
    }

    @Test
    @DisplayName("Tạo ApiResponse báo lỗi BadRequest không có chi tiết")
    void testBadRequest() {
        ApiResponse<Void> response = ApiResponse.badRequest("Invalid input");

        assertEquals(400, response.getStatusCode());
        assertEquals("Invalid input", response.getMessage());
        assertEquals("Bad Request", response.getError());
        assertNull(response.getData());
        assertNull(response.getDetails());
    }

    @Test
    @DisplayName("Tạo ApiResponse báo lỗi BadRequest kèm danh sách chi tiết lỗi")
    void testBadRequestWithDetails() {
        List<String> errors = Arrays.asList("Email is required", "Password too short");
        ApiResponse<Void> response = ApiResponse.badRequest("Validation failed", errors);

        assertEquals(400, response.getStatusCode());
        assertEquals("Validation failed", response.getMessage());
        assertEquals("Bad Request", response.getError());
        assertEquals(errors, response.getDetails());
        assertEquals(2, response.getDetails().size());
    }

    @Test
    @DisplayName("Tạo ApiResponse báo lỗi NotFound")
    void testNotFound() {
        ApiResponse<Void> response = ApiResponse.notFound("User not found");

        assertEquals(404, response.getStatusCode());
        assertEquals("User not found", response.getMessage());
        assertEquals("Not Found", response.getError());
        assertNull(response.getData());
    }
}
