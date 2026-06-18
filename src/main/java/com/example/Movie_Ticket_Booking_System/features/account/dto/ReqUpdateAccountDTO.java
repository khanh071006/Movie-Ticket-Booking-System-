package com.example.Movie_Ticket_Booking_System.features.account.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Set;

public class ReqUpdateAccountDTO {

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    private String phone;

    private Set<String> roles;

    private Integer cinemaId;

    // Không cho phép update mật khẩu hoặc email qua api này. Sẽ làm một api riêng nếu cần thiết.
    
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public Integer getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(Integer cinemaId) {
        this.cinemaId = cinemaId;
    }
}
