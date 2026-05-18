package com.example.Movie_Ticket_Booking_System.features.booking;

import com.example.Movie_Ticket_Booking_System.features.booking.dto.ReqBookingDTO;
import com.example.Movie_Ticket_Booking_System.features.booking.dto.ResBookingDTO;
import com.example.Movie_Ticket_Booking_System.security.UserPrincipal;

public interface BookingService {
    ResBookingDTO createBooking(ReqBookingDTO bookingDTO, UserPrincipal principal);
}
