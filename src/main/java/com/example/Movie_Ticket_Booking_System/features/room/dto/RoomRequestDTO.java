package com.example.Movie_Ticket_Booking_System.features.room.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoomRequestDTO {
    @NotBlank(message = "Room name cannot be blank")
    private String name;

    @NotNull(message = "Cinema ID cannot be null")
    private UUID cinemaId;
}
