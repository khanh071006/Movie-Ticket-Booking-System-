package com.example.Movie_Ticket_Booking_System.features.tmdb;

import com.example.Movie_Ticket_Booking_System.common.dto.ApiResponse;
import com.example.Movie_Ticket_Booking_System.features.showtime.ShowtimeAutoGeneratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/tmdb")
public class TmdbController {

    private static final Logger logger = LoggerFactory.getLogger(TmdbController.class);

    private final TmdbService tmdbService;
    private final ShowtimeAutoGeneratorService showtimeAutoGeneratorService;

    public TmdbController(TmdbService tmdbService, ShowtimeAutoGeneratorService showtimeAutoGeneratorService) {
        this.tmdbService = tmdbService;
        this.showtimeAutoGeneratorService = showtimeAutoGeneratorService;
    }

    @PostMapping("/sync")
    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('MOVIE_CREATE')")
    public ResponseEntity<ApiResponse<String>> syncMovies() {
        new Thread(() -> {
            try {
                logger.info("Starting TMDB Sync Thread...");
                tmdbService.handleSyncNowPlayingMovies();
                logger.info("Finished syncNowPlayingMovies");
                tmdbService.handleSyncUpcomingMovies();
                logger.info("Finished syncUpcomingMovies");
                showtimeAutoGeneratorService.handleGenerateShowtimesForNext7Days();
                logger.info("Finished generateShowtimesForNext7Days");
            } catch (Throwable e) {
                logger.error("FATAL ERROR IN SYNC THREAD", e);
            }
        }).start();

        return ResponseEntity.ok(ApiResponse.success("Sync started in background.", null));
    }
}
