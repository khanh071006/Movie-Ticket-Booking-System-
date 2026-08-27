package com.example.Movie_Ticket_Booking_System.features.booking;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BookingCronjob {

    private final BookingService bookingService;

    public BookingCronjob(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Run every 1 minute
    @Scheduled(fixedDelay = 60000)
    public void cleanupAbandonedBookings() {
        try {
            bookingService.handleCancelAbandonedBookings();
        } catch (Exception e) {
            System.err.println("Failed to clean up abandoned bookings: " + e.getMessage());
        }
    }
}
