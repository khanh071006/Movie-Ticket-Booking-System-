package com.example.Movie_Ticket_Booking_System.features.seat_type;

import com.example.Movie_Ticket_Booking_System.features.seat_type.dto.SeatTypeDTO;

import java.util.List;

public interface SeatTypeService {
    SeatTypeDTO createSeatType(SeatTypeDTO seatTypeDTO);
    SeatTypeDTO updateSeatType(Integer id, SeatTypeDTO seatTypeDTO);
    void deleteSeatType(Integer id);
    List<SeatTypeDTO> getAllSeatTypes();
}
