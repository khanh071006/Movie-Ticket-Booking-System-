package com.example.Movie_Ticket_Booking_System.features.moviestatus.dto;

import com.example.Movie_Ticket_Booking_System.features.moviestatus.MovieStatus;

import java.util.UUID;

public class ResMovieStatusDTO {
    private UUID id;
    private String name;

    public ResMovieStatusDTO(UUID id, String name) {
        this.id = id;
        this.name = name;
    }

    public static ResMovieStatusDTO fromMovieStatus(MovieStatus movieStatus) {
        return new ResMovieStatusDTO(movieStatus.getId(), movieStatus.getName());
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
