package com.example.Movie_Ticket_Booking_System.features.showtime.dto;

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
public class ShowtimeResponseDTO {
    private UUID id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private MovieInfo movie;
    private RoomInfo room;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MovieInfo {
        private UUID id;
        private String title;
        private Integer durationMinutes;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class RoomInfo {
        private UUID id;
        private String name;
        private CinemaInfo cinema;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CinemaInfo {
        private UUID id;
        private String name;
    }
}
