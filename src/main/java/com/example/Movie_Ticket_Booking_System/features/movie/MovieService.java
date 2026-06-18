package com.example.Movie_Ticket_Booking_System.features.movie;

import com.example.Movie_Ticket_Booking_System.features.movie.dto.ReqMovieDTO;
import java.util.List;
import java.util.UUID;

public interface MovieService {
    Movie createMovie(ReqMovieDTO reqMovieDTO);
    Movie getMovieById(UUID id);
    com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<Movie> getAllMovies(int page, int size, String query);
    Movie updateMovie(UUID id, ReqMovieDTO reqMovieDTO);
    void deleteMovie(UUID id);
}
