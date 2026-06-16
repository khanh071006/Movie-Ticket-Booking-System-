package com.example.Movie_Ticket_Booking_System.features.booking.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;
import java.util.UUID;

public class ReqBookingDTO {

    @NotNull(message = "Showtime ID cannot be null")
    private UUID showtimeId;

    @NotEmpty(message = "Seat IDs cannot be empty")
    private List<Integer> seatIds;

    @NotEmpty(message = "Ticket quantities cannot be empty")
    private List<TicketQuantity> ticketQuantities;

    private List<SnackQuantity> snackQuantities;

    public UUID getShowtimeId() { return showtimeId; }
    public void setShowtimeId(UUID showtimeId) { this.showtimeId = showtimeId; }
    public List<Integer> getSeatIds() { return seatIds; }
    public void setSeatIds(List<Integer> seatIds) { this.seatIds = seatIds; }
    public List<TicketQuantity> getTicketQuantities() { return ticketQuantities; }
    public void setTicketQuantities(List<TicketQuantity> ticketQuantities) { this.ticketQuantities = ticketQuantities; }
    public List<SnackQuantity> getSnackQuantities() { return snackQuantities; }
    public void setSnackQuantities(List<SnackQuantity> snackQuantities) { this.snackQuantities = snackQuantities; }

    public static class TicketQuantity {
        @NotNull(message = "Ticket type ID cannot be null")
        private Integer ticketTypeId;

        @NotNull(message = "Quantity cannot be null")
        @Positive(message = "Quantity must be positive")
        private Integer quantity;

        public Integer getTicketTypeId() { return ticketTypeId; }
        public void setTicketTypeId(Integer ticketTypeId) { this.ticketTypeId = ticketTypeId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public static class SnackQuantity {
        @NotNull(message = "Snack ID cannot be null")
        private Integer snackId;

        @NotNull(message = "Quantity cannot be null")
        @Positive(message = "Quantity must be positive")
        private Integer quantity;

        public Integer getSnackId() { return snackId; }
        public void setSnackId(Integer snackId) { this.snackId = snackId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
