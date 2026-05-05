package com.example.Movie_Ticket_Booking_System.features.room.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoomResponseDTO {
    private UUID id;
    private String name;
    private UUID cinemaId;
}
