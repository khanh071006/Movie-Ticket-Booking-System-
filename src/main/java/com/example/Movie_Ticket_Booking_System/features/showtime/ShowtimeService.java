package com.example.Movie_Ticket_Booking_System.features.showtime;

import com.example.Movie_Ticket_Booking_System.features.showtime.dto.ShowtimeRequestDTO;
import com.example.Movie_Ticket_Booking_System.features.showtime.dto.ShowtimeResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ShowtimeService {
    ShowtimeResponseDTO createShowtime(ShowtimeRequestDTO showtimeRequestDTO);
    void deleteShowtime(UUID showtimeId);
    List<ShowtimeResponseDTO> getShowtimesByMovieAndCinema(UUID movieId, Integer cinemaId); // Thay đổi từ UUID sang Integer
    List<ShowtimeResponseDTO> getShowtimesByMovie(UUID movieId);
}
