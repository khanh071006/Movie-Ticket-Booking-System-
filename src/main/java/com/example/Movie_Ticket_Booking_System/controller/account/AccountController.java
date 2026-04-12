package com.example.Movie_Ticket_Booking_System.controller.account;

import com.example.Movie_Ticket_Booking_System.domain.dto.account.AccountRequestDTO;
import com.example.Movie_Ticket_Booking_System.domain.dto.response.ApiResponse;
import com.example.Movie_Ticket_Booking_System.domain.entity.Account;
import com.example.Movie_Ticket_Booking_System.service.account.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Account>> register(@Valid @RequestBody AccountRequestDTO dto) {

        // Gọi Service xử lý với DTO
        Account newAccount = this.accountService.handleRegister(dto);

        // Trả về ApiResponse chuẩn đã thống nhất
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Đăng ký tài khoản thành công", newAccount));
    }
}
