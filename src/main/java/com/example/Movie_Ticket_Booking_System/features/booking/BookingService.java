package com.example.Movie_Ticket_Booking_System.features.booking;

import com.example.Movie_Ticket_Booking_System.features.booking.dto.ReqBookingDTO;
import com.example.Movie_Ticket_Booking_System.features.booking.dto.ResBookingDTO;
import com.example.Movie_Ticket_Booking_System.security.UserPrincipal;

import com.example.Movie_Ticket_Booking_System.features.booking.dto.ResBookingHistoryDTO;

import java.util.List;
import java.util.UUID;

public interface BookingService {
    ResBookingDTO createBooking(ReqBookingDTO dto, String userEmail);
    List<Integer> getBookedSeats(UUID showtimeId);
    List<ResBookingHistoryDTO> getMyBookings(String userEmail);
}
