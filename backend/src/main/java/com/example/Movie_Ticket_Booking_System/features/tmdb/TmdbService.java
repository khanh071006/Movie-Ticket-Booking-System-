package com.example.Movie_Ticket_Booking_System.features.tmdb;

import com.example.Movie_Ticket_Booking_System.features.movie.Movie;
import java.util.UUID;

public interface TmdbService {
    void handleSyncNowPlayingMovies();
    void handleSyncUpcomingMovies();
    Movie handleSyncMovieDetails(Long tmdbId, com.example.Movie_Ticket_Booking_System.features.moviestatus.MovieStatus status);
}
