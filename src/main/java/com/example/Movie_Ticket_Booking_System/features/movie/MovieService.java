package com.example.Movie_Ticket_Booking_System.features.movie;

import com.example.Movie_Ticket_Booking_System.features.movie.dto.ReqMovieDTO;
import java.util.List;
import java.util.UUID;

public interface MovieService {
    Movie createMovie(ReqMovieDTO reqMovieDTO);
    Movie getMovieById(UUID id);
    List<Movie> getAllMovies();
    Movie updateMovie(UUID id, ReqMovieDTO reqMovieDTO);
    void deleteMovie(UUID id);
}
