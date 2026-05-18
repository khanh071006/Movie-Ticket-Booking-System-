package com.example.Movie_Ticket_Booking_System.features.seat;

import com.example.Movie_Ticket_Booking_System.features.seat.dto.SeatDTO;

import java.util.List;

public interface SeatService {
    List<SeatDTO> createSeatsForRoom(Integer roomId, List<SeatDTO> seatDTOs);
    List<SeatDTO> getSeatsByRoom(Integer roomId);
}
