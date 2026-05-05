package com.example.Movie_Ticket_Booking_System.features.room;

import com.example.Movie_Ticket_Booking_System.features.cinema.Cinema;
import com.example.Movie_Ticket_Booking_System.features.cinema.CinemaRepository;
import com.example.Movie_Ticket_Booking_System.features.room.dto.RoomRequestDTO;
import com.example.Movie_Ticket_Booking_System.features.room.dto.RoomResponseDTO;
import com.example.Movie_Ticket_Booking_System.features.showtime.Showtime;
import com.example.Movie_Ticket_Booking_System.features.showtime.ShowtimeRepository;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final CinemaRepository cinemaRepository;
    private final ShowtimeRepository showtimeRepository;

    public RoomServiceImpl(RoomRepository roomRepository, CinemaRepository cinemaRepository, ShowtimeRepository showtimeRepository) {
        this.roomRepository = roomRepository;
        this.cinemaRepository = cinemaRepository;
        this.showtimeRepository = showtimeRepository;
    }

    private RoomResponseDTO convertToResponseDTO(Room room) {
        return RoomResponseDTO.builder()
                .id(room.getId())
                .name(room.getName())
                .cinemaId(room.getCinema().getId())
                .build();
    }

    @Override
    public List<RoomResponseDTO> getAllRoomsByCinema(UUID cinemaId) {
        if (!cinemaRepository.existsById(cinemaId)) {
            throw new ResourceNotFoundException("Cinema not found with id: " + cinemaId);
        }
        return roomRepository.findByCinemaId(cinemaId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoomResponseDTO createRoom(RoomRequestDTO roomRequestDTO) {
        Cinema cinema = cinemaRepository.findById(roomRequestDTO.getCinemaId())
                .orElseThrow(() -> new ResourceNotFoundException("Cinema not found with id: " + roomRequestDTO.getCinemaId()));

        Room room = new Room();
        room.setName(roomRequestDTO.getName());
        room.setCinema(cinema);

        Room savedRoom = roomRepository.save(room);
        return convertToResponseDTO(savedRoom);
    }

    @Override
    public RoomResponseDTO updateRoom(UUID roomId, RoomRequestDTO roomRequestDTO) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        Cinema cinema = cinemaRepository.findById(roomRequestDTO.getCinemaId())
                .orElseThrow(() -> new ResourceNotFoundException("Cinema not found with id: " + roomRequestDTO.getCinemaId()));

        room.setName(roomRequestDTO.getName());
        room.setCinema(cinema);

        Room updatedRoom = roomRepository.save(room);
        return convertToResponseDTO(updatedRoom);
    }

    @Override
    public void deleteRoom(UUID roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        // Check for showtimes in this room
        List<Showtime> showtimes = showtimeRepository.findByRoomIdIn(List.of(roomId));
        if (!showtimes.isEmpty()) {
            throw new IllegalStateException("Cannot delete room with active showtimes.");
        }

        roomRepository.delete(room);
    }
}
