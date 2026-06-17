package com.example.Movie_Ticket_Booking_System.features.room;

import com.example.Movie_Ticket_Booking_System.features.room.dto.RoomDTO;
import com.example.Movie_Ticket_Booking_System.features.seat.SeatService;
import com.example.Movie_Ticket_Booking_System.features.seat.dto.SeatDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private final RoomService roomService;
    private final SeatService seatService;

    public RoomController(RoomService roomService, SeatService seatService) {
        this.roomService = roomService;
        this.seatService = seatService;
    }

    // Room CRUD
    @GetMapping("/cinema/{cinemaId}")
    public ResponseEntity<List<RoomDTO>> getAllRoomsByCinema(@PathVariable Integer cinemaId) {
        return ResponseEntity.ok(roomService.getAllRoomsByCinema(cinemaId));
    }

    @PostMapping
    public ResponseEntity<RoomDTO> createRoom(@Valid @RequestBody RoomDTO roomDTO) {
        RoomDTO createdRoom = roomService.createRoom(roomDTO);
        return new ResponseEntity<>(createdRoom, HttpStatus.CREATED);
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable Integer roomId, @Valid @RequestBody RoomDTO roomDTO) {
        return ResponseEntity.ok(roomService.updateRoom(roomId, roomDTO));
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Integer roomId) {
        roomService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
    }

    // Seat configuration endpoints
    @PostMapping("/{roomId}/seats")
    public ResponseEntity<List<SeatDTO>> createSeatsForRoom(@PathVariable Integer roomId, @Valid @RequestBody List<SeatDTO> seatDTOs) {
        List<SeatDTO> createdSeats = seatService.createSeatsForRoom(roomId, seatDTOs);
        return new ResponseEntity<>(createdSeats, HttpStatus.CREATED);
    }

    @GetMapping("/{roomId}/seats")
    public ResponseEntity<List<SeatDTO>> getSeatsByRoom(@PathVariable Integer roomId) {
        return ResponseEntity.ok(seatService.getSeatsByRoom(roomId));
    }
}
