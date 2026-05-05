package com.example.Movie_Ticket_Booking_System.features.cinema;

import com.example.Movie_Ticket_Booking_System.features.cinema.dto.CinemaDTO;

import java.util.List;
import java.util.UUID;

public interface CinemaService {
    List<CinemaDTO> getAllCinemas();
    CinemaDTO getCinemaById(UUID id);
    CinemaDTO createCinema(CinemaDTO cinemaDTO);
    CinemaDTO updateCinema(UUID id, CinemaDTO cinemaDTO);
    void deleteCinema(UUID id);
}
