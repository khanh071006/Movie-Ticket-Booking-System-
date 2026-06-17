package com.example.Movie_Ticket_Booking_System.features.cinema;

import com.example.Movie_Ticket_Booking_System.features.cinema.dto.CinemaDTO;

import java.util.List;

public interface CinemaService {
    List<CinemaDTO> getAllCinemas();
    CinemaDTO getCinemaById(Integer id);
    CinemaDTO createCinema(CinemaDTO cinemaDTO);
    CinemaDTO updateCinema(Integer id, CinemaDTO cinemaDTO);
    void deleteCinema(Integer id);
}
