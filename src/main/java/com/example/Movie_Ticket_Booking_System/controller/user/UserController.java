package com.example.Movie_Ticket_Booking_System.controller.user;

import com.example.Movie_Ticket_Booking_System.domain.dto.response.ApiResponse;
import com.example.Movie_Ticket_Booking_System.domain.entity.Account;
import com.example.Movie_Ticket_Booking_System.service.account.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final AccountService accountService;

    public UserController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Account>>> getUsers() {
        List<Account> users = this.accountService.handleGetUsers();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách người dùng thành công", users));
    }
}
