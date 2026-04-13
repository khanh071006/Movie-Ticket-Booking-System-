package com.example.Movie_Ticket_Booking_System.features.account;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ResAccountDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResAccountDTO>>> getAccounts() {
        List<Account> accounts = this.accountService.handleGetAccounts();
        List<ResAccountDTO> resAccounts = accounts.stream()
                .map(account -> new ResAccountDTO(account.getId(), account.getEmail(), account.getFullName(), account.getPhone()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài khoản thành công", resAccounts));
    }
}
