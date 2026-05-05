package com.example.Movie_Ticket_Booking_System.features.showtime.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShowtimeRequestDTO {
    @NotNull(message = "Movie ID cannot be null")
    private UUID movieId;

    @NotNull(message = "Room ID cannot be null")
    private UUID roomId;

    @NotNull(message = "Start time cannot be null")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;
}
