package com.example.Movie_Ticket_Booking_System.features.auth;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.account.Account;
import com.example.Movie_Ticket_Booking_System.features.account.AccountService;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqRegisterDTO;
import com.example.Movie_Ticket_Booking_System.features.auth.dto.ReqLoginDTO;
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
    private final AuthService authService;

    public AuthController(AccountService accountService, AuthService authService) {
        this.accountService = accountService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<ResAuthDTO>> register(@Valid @RequestBody ReqRegisterDTO dto) {
        Account newAccount = this.accountService.handleRegister(dto);
        // Trả về DTO, không có token vì đây là đăng ký
        ResAuthDTO res = new ResAuthDTO(null, newAccount);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Đăng ký tài khoản thành công", res));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<ResAuthDTO>> login(@Valid @RequestBody ReqLoginDTO dto) {
        ResAuthDTO res = authService.handleLogin(dto);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", res));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Object>> verifyOtp(@Valid @RequestBody com.example.Movie_Ticket_Booking_System.features.auth.dto.ReqVerifyOtpDTO dto) {
        try {
            accountService.handleVerifyOtp(dto.getEmail(), dto.getOtpCode());
            return ResponseEntity.ok(ApiResponse.success("Xác thực tài khoản thành công", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
