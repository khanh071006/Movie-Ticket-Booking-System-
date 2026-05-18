package com.example.Movie_Ticket_Booking_System.features.cinema.dto;

import jakarta.validation.constraints.NotBlank;

public class CinemaDTO {
    private Integer id;

    @NotBlank(message = "Cinema name cannot be blank")
    private String name;

    private String address;

    public CinemaDTO() {
    }

    public CinemaDTO(Integer id, String name, String address) {
        this.id = id;
        this.name = name;
        this.address = address;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
