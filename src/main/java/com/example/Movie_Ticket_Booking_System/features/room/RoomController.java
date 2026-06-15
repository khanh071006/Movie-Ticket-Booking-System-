package com.example.Movie_Ticket_Booking_System.features.room;

import com.example.Movie_Ticket_Booking_System.features.room.dto.RoomRequestDTO;
import com.example.Movie_Ticket_Booking_System.features.room.dto.RoomResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/cinema/{cinemaId}")
    public ResponseEntity<List<RoomResponseDTO>> getAllRoomsByCinema(@PathVariable UUID cinemaId) {
        return ResponseEntity.ok(roomService.getAllRoomsByCinema(cinemaId));
    }

    @PostMapping
    public ResponseEntity<RoomResponseDTO> createRoom(@Valid @RequestBody RoomRequestDTO roomRequestDTO) {
        RoomResponseDTO createdRoom = roomService.createRoom(roomRequestDTO);
        return new ResponseEntity<>(createdRoom, HttpStatus.CREATED);
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<RoomResponseDTO> updateRoom(@PathVariable UUID roomId, @Valid @RequestBody RoomRequestDTO roomRequestDTO) {
        return ResponseEntity.ok(roomService.updateRoom(roomId, roomRequestDTO));
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable UUID roomId) {
        roomService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
    }
}
