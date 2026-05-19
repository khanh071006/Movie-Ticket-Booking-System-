package com.example.Movie_Ticket_Booking_System.features.account;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqUpdateAccountDTO;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ResAccountDTO;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ResAccountDTO>>> getAccounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ResAccountDTO> resAccounts = this.accountService.getAllAccounts(pageable);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài khoản thành công", resAccounts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResAccountDTO>> getAccountById(@PathVariable UUID id) {
        ResAccountDTO account = accountService.getAccountById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin tài khoản thành công", account));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResAccountDTO>> updateAccount(
            @PathVariable UUID id,
            @Valid @RequestBody ReqUpdateAccountDTO dto) {
        
        ResAccountDTO updatedAccount = accountService.updateAccount(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin tài khoản thành công", updatedAccount));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable UUID id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok(ApiResponse.success("Vô hiệu hóa tài khoản thành công", null));
    }
}
