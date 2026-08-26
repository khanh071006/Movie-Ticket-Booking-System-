package com.example.Movie_Ticket_Booking_System.features.auth;

import com.example.Movie_Ticket_Booking_System.features.auth.dto.ReqLoginDTO;
import com.example.Movie_Ticket_Booking_System.features.auth.dto.ResAuthDTO;

public interface AuthService {
    /**
     * Xử lý nghiệp vụ đăng nhập.
     * @param loginDTO DTO chứa thông tin đăng nhập.
     * @return DTO chứa thông tin token và tài khoản.
     */
    ResAuthDTO handleLogin(ReqLoginDTO loginDTO);
}
