package com.example.Movie_Ticket_Booking_System.features.moviestatus.dto;

import jakarta.validation.constraints.NotBlank;

public class ReqMovieStatusDTO {
    @NotBlank(message = "Movie status name cannot be blank")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
