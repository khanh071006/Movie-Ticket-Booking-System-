package com.example.Movie_Ticket_Booking_System.features.booking;

import com.example.Movie_Ticket_Booking_System.features.booking.dto.ReqBookingDTO;
import com.example.Movie_Ticket_Booking_System.features.booking.dto.ResBookingDTO;
import com.example.Movie_Ticket_Booking_System.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ResBookingDTO> createBooking(@Valid @RequestBody ReqBookingDTO bookingDTO, @AuthenticationPrincipal UserPrincipal principal) {
        ResBookingDTO createdBooking = bookingService.createBooking(bookingDTO, principal);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }
}
