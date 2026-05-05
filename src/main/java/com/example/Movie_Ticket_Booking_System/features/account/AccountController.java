package com.example.Movie_Ticket_Booking_System.features.account;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqCreateAccountDTO;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqUpdateAccountDTO;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ResAccountDTO;
import com.example.Movie_Ticket_Booking_System.features.role.AccountRole;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    private ResAccountDTO mapToResDTO(Account account) {
        Set<String> roles = account.getAccountRoles() != null ?
                account.getAccountRoles().stream()
                        .map(accountRole -> accountRole.getRole().getName())
                        .collect(Collectors.toSet())
                : null;
        return new ResAccountDTO(account.getId(), account.getEmail(), account.getFullName(), account.getPhone(), roles);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResAccountDTO>>> getAccounts() {
        List<Account> accounts = this.accountService.handleGetAccounts();
        List<ResAccountDTO> resAccounts = accounts.stream()
                .map(this::mapToResDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài khoản thành công", resAccounts));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResAccountDTO>> createAccount(@Valid @RequestBody ReqCreateAccountDTO dto) {
        Account newAccount = accountService.handleCreateAccount(dto);
        // Cần lấy lại để load roles (nếu đang ở cùng transaction, lazy load có thể gây lỗi nêú không gọi)
        Account createdAccount = accountService.handleGetAccountById(newAccount.getId());
        return ResponseEntity.ok(ApiResponse.created("Tạo tài khoản thành công", mapToResDTO(createdAccount)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResAccountDTO>> getAccountById(@PathVariable UUID id) {
        Account account = accountService.handleGetAccountById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin tài khoản thành công", mapToResDTO(account)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResAccountDTO>> updateAccount(@PathVariable UUID id, @Valid @RequestBody ReqUpdateAccountDTO dto) {
        Account updatedAccount = accountService.handleUpdateAccount(id, dto);
        Account savedAccount = accountService.handleGetAccountById(updatedAccount.getId());
        return ResponseEntity.ok(ApiResponse.success("Cập nhật tài khoản thành công", mapToResDTO(savedAccount)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable UUID id) {
        accountService.handleDeleteAccount(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa tài khoản thành công"));
    }
}
