package com.example.Movie_Ticket_Booking_System.service.account;

import com.example.Movie_Ticket_Booking_System.features.account.Account;
import com.example.Movie_Ticket_Booking_System.features.account.AccountServiceImpl;
import com.example.Movie_Ticket_Booking_System.features.account.dto.ReqRegisterDTO;
import com.example.Movie_Ticket_Booking_System.exception.DuplicateResourceException;
import com.example.Movie_Ticket_Booking_System.features.account.AccountRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AccountServiceImplTest {

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private AccountServiceImpl accountService;

    @Test
    @DisplayName("Đăng ký thành công khi email chưa tồn tại")
    void testHandleRegister_Success() {
        // 1. Setup dữ liệu đầu vào (DTO)
        ReqRegisterDTO requestDTO = new ReqRegisterDTO();
        requestDTO.setEmail("test@gmail.com");
        requestDTO.setFullName("Nguyen Van A");
        requestDTO.setPhone("0123456789");
        requestDTO.setPassword("password123");

        // 2. Setup (Mock) hành vi của đối tượng phụ thuộc (Repository)
        when(accountRepository.existsByEmail("test@gmail.com")).thenReturn(false);

        // Account dự kiến được trả về sau khi lưu thành công
        Account mockSavedAccount = new Account();
        mockSavedAccount.setId(java.util.UUID.randomUUID());
        mockSavedAccount.setEmail("test@gmail.com");
        mockSavedAccount.setFullName("Nguyen Van A");
        mockSavedAccount.setPhone("0123456789");
        mockSavedAccount.setPasswordHash("password123");
        
        when(accountRepository.save(any(Account.class))).thenReturn(mockSavedAccount);

        // 3. Thực thi hành động cần test
        Account result = accountService.handleRegister(requestDTO);

        // 4. Assert (Kiểm chứng kết quả)
        assertNotNull(result, "Tài khoản trả về không được null");
        assertEquals("test@gmail.com", result.getEmail(), "Email không khớp");
        assertEquals("Nguyen Van A", result.getFullName(), "Tên không khớp");
        assertEquals("password123", result.getPasswordHash(), "Password không khớp");
        
        // Xác minh rằng hàm save của repository chăc chắn đã được gọi đúng 1 lần
        verify(accountRepository, times(1)).save(any(Account.class));
    }

    @Test
    @DisplayName("Ném ngoại lệ DuplicateResourceException khi email đã tồn tại")
    void testHandleRegister_ThrowDuplicateEmailException() {
        // 1. Setup dữ liệu đầu vào
        ReqRegisterDTO requestDTO = new ReqRegisterDTO();
        requestDTO.setEmail("test@gmail.com");
        
        // 2. Setup hành vi mock: Giả sử email đã tồn tại trong DB
        when(accountRepository.existsByEmail("test@gmail.com")).thenReturn(true);

        // 3 & 4. Thực thi và Kiểm chứng ngoại lệ
        DuplicateResourceException exception = assertThrows(
                DuplicateResourceException.class, 
                () -> accountService.handleRegister(requestDTO),
                "Phải ném ra ngoại lệ DuplicateResourceException"
        );
        
        // Có thể kiểm tra thêm message của exception để chắc chắn (vd: Account duplicated email test@gmail.com)
        assertTrue(exception.getMessage().contains("test@gmail.com"));

        // Quan trọng: Xác minh rằng hàm save TUYỆT ĐỐI không được gọi đến
        verify(accountRepository, never()).save(any(Account.class));
    }
}
