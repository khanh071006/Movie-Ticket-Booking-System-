package com.example.Movie_Ticket_Booking_System.features.room;

import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.cinema.Cinema;
import com.example.Movie_Ticket_Booking_System.features.cinema.CinemaRepository;
import com.example.Movie_Ticket_Booking_System.features.room.dto.RoomDTO;
import com.example.Movie_Ticket_Booking_System.features.showtime.Showtime;
import com.example.Movie_Ticket_Booking_System.features.showtime.ShowtimeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final CinemaRepository cinemaRepository;
    private final ShowtimeRepository showtimeRepository; // Inject ShowtimeRepository

    public RoomServiceImpl(RoomRepository roomRepository, CinemaRepository cinemaRepository, ShowtimeRepository showtimeRepository) {
        this.roomRepository = roomRepository;
        this.cinemaRepository = cinemaRepository;
        this.showtimeRepository = showtimeRepository; // Khởi tạo
    }

    @Override
    public List<RoomDTO> getAllRoomsByCinema(Integer cinemaId) {
        if (!cinemaRepository.existsById(cinemaId)) {
            throw new ResourceNotFoundException("Cinema", "id", cinemaId);
        }
        return roomRepository.findByCinemaId(cinemaId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoomDTO createRoom(RoomDTO roomDTO) {
        Cinema cinema = cinemaRepository.findById(roomDTO.getCinemaId())
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", roomDTO.getCinemaId()));
        Room room = new Room();
        room.setName(roomDTO.getName());
        room.setCinema(cinema);
        Room savedRoom = roomRepository.save(room);
        return convertToDTO(savedRoom);
    }

    @Override
    public RoomDTO updateRoom(Integer roomId, RoomDTO roomDTO) {
        Room room = findRoomById(roomId);
        Cinema cinema = cinemaRepository.findById(roomDTO.getCinemaId())
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", roomDTO.getCinemaId()));
        room.setName(roomDTO.getName());
        room.setCinema(cinema);
        Room updatedRoom = roomRepository.save(room);
        return convertToDTO(updatedRoom);
    }

    @Override
    public void deleteRoom(Integer roomId) {
        Room room = findRoomById(roomId);

        // Kiểm tra xem có lịch chiếu nào đang sử dụng phòng này không
        List<Showtime> showtimes = showtimeRepository.findByRoomIdIn(List.of(roomId));
        if (!showtimes.isEmpty()) {
            throw new IllegalStateException("Cannot delete room with active showtimes.");
        }

        roomRepository.delete(room);
    }

    private Room findRoomById(Integer id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
    }

    private RoomDTO convertToDTO(Room room) {
        return new RoomDTO(room.getId(), room.getName(), room.getCinema().getId());
    }
}
