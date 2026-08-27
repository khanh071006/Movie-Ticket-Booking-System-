package com.example.Movie_Ticket_Booking_System.features.tmdb;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class TmdbCronjob {

    private final TmdbService tmdbService;

    public TmdbCronjob(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    // Run every day at 2 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void syncTmdbDaily() {
        System.out.println("Starting daily TMDB sync...");
        try {
            tmdbService.handleSyncNowPlayingMovies();
            tmdbService.handleSyncUpcomingMovies();
            System.out.println("TMDB sync completed successfully.");
        } catch (Exception e) {
            System.err.println("TMDB sync failed: " + e.getMessage());
        }
    }
}
