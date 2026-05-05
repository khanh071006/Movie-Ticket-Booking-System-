package com.example.Movie_Ticket_Booking_System.features.room;

import com.example.Movie_Ticket_Booking_System.features.room.dto.RoomRequestDTO;
import com.example.Movie_Ticket_Booking_System.features.room.dto.RoomResponseDTO;

import java.util.List;
import java.util.UUID;

public interface RoomService {
    List<RoomResponseDTO> getAllRoomsByCinema(UUID cinemaId);
    RoomResponseDTO createRoom(RoomRequestDTO roomRequestDTO);
    RoomResponseDTO updateRoom(UUID roomId, RoomRequestDTO roomRequestDTO);
    void deleteRoom(UUID roomId);
}
