package com.example.Movie_Ticket_Booking_System.features.room;

import com.example.Movie_Ticket_Booking_System.features.room.dto.RoomDTO;

import java.util.List;

public interface RoomService {
    List<RoomDTO> getAllRoomsByCinema(Integer cinemaId);
    RoomDTO createRoom(RoomDTO roomDTO);
    RoomDTO updateRoom(Integer roomId, RoomDTO roomDTO);
    void deleteRoom(Integer roomId);
}
