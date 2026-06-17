package com.example.Movie_Ticket_Booking_System.features.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ResBookingDTO {
    private UUID id;
    private UUID showtimeId;
    private String movieTitle;
    private LocalDateTime bookingTime;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private List<String> seatLocations;
    private List<String> tickets;
    private List<String> snacks;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getShowtimeId() { return showtimeId; }
    public void setShowtimeId(UUID showtimeId) { this.showtimeId = showtimeId; }
    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }
    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public List<String> getSeatLocations() { return seatLocations; }
    public void setSeatLocations(List<String> seatLocations) { this.seatLocations = seatLocations; }
    public List<String> getTickets() { return tickets; }
    public void setTickets(List<String> tickets) { this.tickets = tickets; }
    public List<String> getSnacks() { return snacks; }
    public void setSnacks(List<String> snacks) { this.snacks = snacks; }
}
