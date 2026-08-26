package com.example.Movie_Ticket_Booking_System.features.cinema;

import com.example.Movie_Ticket_Booking_System.features.cinema.dto.CinemaDTO;

public interface CinemaService {
    com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<Cinema> getAllCinemas(int page, int size);
    CinemaDTO getCinemaById(Integer id);
    CinemaDTO createCinema(CinemaDTO cinemaDTO);
    CinemaDTO updateCinema(Integer id, CinemaDTO cinemaDTO);
    void deleteCinema(Integer id);
}
