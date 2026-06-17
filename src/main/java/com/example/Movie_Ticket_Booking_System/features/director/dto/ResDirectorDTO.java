package com.example.Movie_Ticket_Booking_System.features.director.dto;

import com.example.Movie_Ticket_Booking_System.features.director.Director;


public class ResDirectorDTO {
    private Integer id;
    private String name;
    private String imageUrl;

    public ResDirectorDTO() {
    }

    public ResDirectorDTO(Integer id, String name, String imageUrl) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    }

    public static ResDirectorDTO fromDirector(Director director) {
        return new ResDirectorDTO(director.getId(), director.getName(), director.getImageUrl());
    }

    // Getters and setters
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
