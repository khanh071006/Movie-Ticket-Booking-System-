package com.example.Movie_Ticket_Booking_System.features.room.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class RoomRequestDTO {
    @NotBlank(message = "Room name cannot be blank")
    private String name;

    @NotNull(message = "Cinema ID cannot be null")
    private UUID cinemaId;

    public RoomRequestDTO() {}

    public RoomRequestDTO(String name, UUID cinemaId) {
        this.name = name;
        this.cinemaId = cinemaId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UUID getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(UUID cinemaId) {
        this.cinemaId = cinemaId;
    }
}
