package com.example.Movie_Ticket_Booking_System.features.account;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqCreateAccountDTO;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqUpdateAccountDTO;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ResAccountDTO;
import com.example.Movie_Ticket_Booking_System.features.role.AccountRole;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    private ResAccountDTO mapToResDTO(Account account) {
        Set<String> roles = null;
        if (account.getAccountRoles() != null) {
            roles = new HashSet<>();
            for (AccountRole accountRole : account.getAccountRoles()) {
                roles.add(accountRole.getRole().getName());
            }
        }
        Integer cinemaId = account.getCinema() != null ? account.getCinema().getId() : null;
        String cinemaName = account.getCinema() != null ? account.getCinema().getName() : null;
        return new ResAccountDTO(account.getId(), account.getEmail(), account.getFullName(), account.getPhone(), roles, cinemaId, cinemaName);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<ResAccountDTO>>> getAccounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String query) {
        
        com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<Account> pagedAccounts = this.accountService.handleGetAccounts(page, size, query);
        
        List<ResAccountDTO> resAccounts = new ArrayList<>();
        for (Account account : pagedAccounts.getContent()) {
            resAccounts.add(mapToResDTO(account));
        }

        com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<ResAccountDTO> resPage = new com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<>(
            resAccounts, pagedAccounts.getPageNo(), pagedAccounts.getPageSize(),
            pagedAccounts.getTotalElements(), pagedAccounts.getTotalPages(), pagedAccounts.isLast()
        );

        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài khoản thành công", resPage));
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
        return ResponseEntity.ok(ApiResponse.success("Xóa tài khoản thành công", null));
    }
}
