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
    public ResponseEntity<ResBookingDTO> createBooking(@Valid @RequestBody ReqBookingDTO bookingDTO, @AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt) {
        ResBookingDTO createdBooking = bookingService.createBooking(bookingDTO, jwt.getSubject());
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }

    @org.springframework.web.bind.annotation.GetMapping("/showtime/{showtimeId}/booked-seats")
    public ResponseEntity<java.util.List<Integer>> getBookedSeats(@org.springframework.web.bind.annotation.PathVariable java.util.UUID showtimeId) {
        return ResponseEntity.ok(bookingService.getBookedSeats(showtimeId));
    }

    @org.springframework.web.bind.annotation.GetMapping("/my-bookings")
    public ResponseEntity<java.util.List<com.example.Movie_Ticket_Booking_System.features.booking.dto.ResBookingHistoryDTO>> getMyBookings(@AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt) {
        return ResponseEntity.ok(bookingService.getMyBookings(jwt.getSubject()));
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}/checkin")
    public ResponseEntity<com.example.Movie_Ticket_Booking_System.features.booking.dto.ResBookingHistoryDTO> checkinTicket(@org.springframework.web.bind.annotation.PathVariable java.util.UUID id, @AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt) {
        Long cinemaId = null;
        if (jwt.hasClaim("cinemaId")) {
            cinemaId = jwt.getClaim("cinemaId");
        }
        return ResponseEntity.ok(bookingService.checkinTicket(id, cinemaId));
    }
}
