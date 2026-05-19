package com.example.Movie_Ticket_Booking_System.features.auth;

import com.example.Movie_Ticket_Booking_System.features.account.Account;
import com.example.Movie_Ticket_Booking_System.features.account.AccountService;
import com.example.Movie_Ticket_Booking_System.features.auth.dto.ReqLoginDTO;
import com.example.Movie_Ticket_Booking_System.features.auth.dto.ResAuthDTO;
import com.example.Movie_Ticket_Booking_System.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final SecurityUtil securityUtil;
    private final AccountService accountService;

    @Value("${jwt.expires-in}")
    private long expiresIn;

    public AuthServiceImpl(AuthenticationManager authenticationManager, SecurityUtil securityUtil, AccountService accountService) {
        this.authenticationManager = authenticationManager;
        this.securityUtil = securityUtil;
        this.accountService = accountService;
    }

    @Override
    public ResAuthDTO handleLogin(ReqLoginDTO loginDTO) {
        // 1. Xác thực người dùng
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );

        // 2. Nếu xác thực thành công, tạo token
        String accessToken = securityUtil.createToken(authentication);

        // 3. Lấy thông tin người dùng để trả về
        Account currentAccount = accountService.handleGetAccountByEmail(authentication.getName());

        // 4. Tạo đối tượng TokenInfo
        ResAuthDTO.TokenInfo tokenInfo = new ResAuthDTO.TokenInfo(accessToken, "Bearer", expiresIn);

        // 5. Tạo và trả về response DTO
        return new ResAuthDTO(tokenInfo, currentAccount);
    }
}
