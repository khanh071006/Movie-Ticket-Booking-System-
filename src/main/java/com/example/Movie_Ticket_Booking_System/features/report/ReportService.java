package com.example.Movie_Ticket_Booking_System.features.report;

import com.example.Movie_Ticket_Booking_System.features.booking.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final BookingRepository bookingRepository;

    public ReportService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<RevenueByDateProjection> getRevenueByDate(Long cinemaId) {
        if (cinemaId != null) {
            return bookingRepository.getRevenueByDateByCinema(cinemaId);
        }
        return bookingRepository.getRevenueByDate();
    }

    public List<RevenueByMovieProjection> getRevenueByMovie(Long cinemaId) {
        if (cinemaId != null) {
            return bookingRepository.getRevenueByMovieByCinema(cinemaId);
        }
        return bookingRepository.getRevenueByMovie();
    }

    public List<RevenueByCinemaProjection> getRevenueByCinema() {
        return bookingRepository.getRevenueByCinema();
    }
}
