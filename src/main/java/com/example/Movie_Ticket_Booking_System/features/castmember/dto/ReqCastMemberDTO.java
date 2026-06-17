package com.example.Movie_Ticket_Booking_System.features.castmember.dto;

import jakarta.validation.constraints.NotBlank;

public class ReqCastMemberDTO {
    @NotBlank(message = "Name cannot be empty")
    private String name;

    private String imageUrl;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
