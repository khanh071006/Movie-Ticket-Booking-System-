package com.example.Movie_Ticket_Booking_System.features.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ResBookingHistoryDTO {
    private UUID id;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private LocalDateTime createdDatetime;
    
    private String movieTitle;
    private String moviePosterUrl;
    private String cinemaName;
    private String roomName;
    private LocalDateTime showtimeStartTime;
    private LocalDateTime showtimeEndTime;
    
    private List<String> tickets;
    private List<String> seats;
    private List<String> snacks;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public LocalDateTime getCreatedDatetime() { return createdDatetime; }
    public void setCreatedDatetime(LocalDateTime createdDatetime) { this.createdDatetime = createdDatetime; }
    
    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }
    
    public String getMoviePosterUrl() { return moviePosterUrl; }
    public void setMoviePosterUrl(String moviePosterUrl) { this.moviePosterUrl = moviePosterUrl; }
    
    public String getCinemaName() { return cinemaName; }
    public void setCinemaName(String cinemaName) { this.cinemaName = cinemaName; }
    
    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }
    
    public LocalDateTime getShowtimeStartTime() { return showtimeStartTime; }
    public void setShowtimeStartTime(LocalDateTime showtimeStartTime) { this.showtimeStartTime = showtimeStartTime; }
    
    public LocalDateTime getShowtimeEndTime() { return showtimeEndTime; }
    public void setShowtimeEndTime(LocalDateTime showtimeEndTime) { this.showtimeEndTime = showtimeEndTime; }
    
    public List<String> getTickets() { return tickets; }
    public void setTickets(List<String> tickets) { this.tickets = tickets; }
    
    public List<String> getSeats() { return seats; }
    public void setSeats(List<String> seats) { this.seats = seats; }
    
    public List<String> getSnacks() { return snacks; }
    public void setSnacks(List<String> snacks) { this.snacks = snacks; }
}
