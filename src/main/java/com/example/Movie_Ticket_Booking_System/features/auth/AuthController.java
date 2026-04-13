package com.example.Movie_Ticket_Booking_System.features.auth;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.account.Account;
import com.example.Movie_Ticket_Booking_System.features.account.AccountService;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqRegisterDTO;
import com.example.Movie_Ticket_Booking_System.features.auth.dto.ResAuthDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AccountService accountService;

    public AuthController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<ResAuthDTO>> register(@Valid @RequestBody ReqRegisterDTO dto) {
        Account newAccount = this.accountService.handleRegister(dto);
        ResAuthDTO res = new ResAuthDTO(newAccount.getId(), newAccount.getEmail(), newAccount.getFullName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Đăng ký tài khoản thành công", res));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login() {
        // Placeholder for login logic
        return ResponseEntity.ok(ApiResponse.success("Login endpoint placeholder", null));
    }
}
