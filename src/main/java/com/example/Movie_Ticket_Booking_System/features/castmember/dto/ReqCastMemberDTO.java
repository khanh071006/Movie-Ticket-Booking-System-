package com.example.Movie_Ticket_Booking_System.features.castmember.dto;

import jakarta.validation.constraints.NotBlank;

public class ReqCastMemberDTO {
    @NotBlank(message = "Cast member name cannot be blank")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
