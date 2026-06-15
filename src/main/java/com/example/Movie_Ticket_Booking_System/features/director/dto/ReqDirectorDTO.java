package com.example.Movie_Ticket_Booking_System.features.director.dto;

import jakarta.validation.constraints.NotBlank;

public class ReqDirectorDTO {
    @NotBlank(message = "Director name cannot be blank")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
