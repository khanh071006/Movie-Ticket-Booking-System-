package com.example.Movie_Ticket_Booking_System.features.room.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RoomDTO {
    private Integer id;

    @NotBlank(message = "Room name cannot be blank")
    private String name;

    @NotNull(message = "Cinema ID cannot be null")
    private Integer cinemaId;

    public RoomDTO() {
    }

    public RoomDTO(Integer id, String name, Integer cinemaId) {
        this.id = id;
        this.name = name;
        this.cinemaId = cinemaId;
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

    public Integer getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(Integer cinemaId) {
        this.cinemaId = cinemaId;
    }
}
