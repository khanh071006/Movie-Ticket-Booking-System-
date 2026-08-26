package com.example.Movie_Ticket_Booking_System.features.genre.dto;

import com.example.Movie_Ticket_Booking_System.features.genre.Genre;

public class ResGenreDTO {
    private Integer id;
    private String name;

    public ResGenreDTO(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public static ResGenreDTO fromGenre(Genre genre) {
        return new ResGenreDTO(genre.getId(), genre.getName());
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
