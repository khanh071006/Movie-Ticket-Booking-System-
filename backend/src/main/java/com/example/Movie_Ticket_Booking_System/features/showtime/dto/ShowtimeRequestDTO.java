package com.example.Movie_Ticket_Booking_System.features.showtime.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

public class ShowtimeRequestDTO {
    @NotNull(message = "Movie ID cannot be null")
    private UUID movieId;

    @NotNull(message = "Room ID cannot be null")
    private Integer roomId; // Thay đổi từ UUID sang Integer

    @NotNull(message = "Start time cannot be null")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    public ShowtimeRequestDTO() {}

    public ShowtimeRequestDTO(UUID movieId, Integer roomId, LocalDateTime startTime) {
        this.movieId = movieId;
        this.roomId = roomId;
        this.startTime = startTime;
    }

    public UUID getMovieId() {
        return movieId;
    }

    public void setMovieId(UUID movieId) {
        this.movieId = movieId;
    }

    public Integer getRoomId() { // Thay đổi kiểu trả về
        return roomId;
    }

    public void setRoomId(Integer roomId) { // Thay đổi kiểu tham số
        this.roomId = roomId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
}
