package com.example.Movie_Ticket_Booking_System.features.moviestatus.dto;

import com.example.Movie_Ticket_Booking_System.features.moviestatus.MovieStatus;

public class ResMovieStatusDTO {
    private Integer id;
    private String name;

    public ResMovieStatusDTO(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public static ResMovieStatusDTO fromMovieStatus(MovieStatus movieStatus) {
        return new ResMovieStatusDTO(movieStatus.getId(), movieStatus.getName());
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
