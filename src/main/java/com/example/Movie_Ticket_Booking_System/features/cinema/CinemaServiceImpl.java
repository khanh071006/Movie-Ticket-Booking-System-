package com.example.Movie_Ticket_Booking_System.features.cinema;

import com.example.Movie_Ticket_Booking_System.features.cinema.dto.CinemaDTO;
import com.example.Movie_Ticket_Booking_System.features.room.Room;
import com.example.Movie_Ticket_Booking_System.features.room.RoomRepository;
import com.example.Movie_Ticket_Booking_System.features.showtime.Showtime;
import com.example.Movie_Ticket_Booking_System.features.showtime.ShowtimeRepository;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CinemaServiceImpl implements CinemaService {

    private final CinemaRepository cinemaRepository;
    private final RoomRepository roomRepository;
    private final ShowtimeRepository showtimeRepository;

    public CinemaServiceImpl(CinemaRepository cinemaRepository, RoomRepository roomRepository, ShowtimeRepository showtimeRepository) {
        this.cinemaRepository = cinemaRepository;
        this.roomRepository = roomRepository;
        this.showtimeRepository = showtimeRepository;
    }

    private CinemaDTO convertToDTO(Cinema cinema) {
        return CinemaDTO.builder()
                .id(cinema.getId())
                .name(cinema.getName())
                .address(cinema.getAddress())
                .build();
    }

    private Cinema convertToEntity(CinemaDTO cinemaDTO) {
        Cinema cinema = new Cinema();
        cinema.setName(cinemaDTO.getName());
        cinema.setAddress(cinemaDTO.getAddress());
        return cinema;
    }

    @Override
    public List<CinemaDTO> getAllCinemas() {
        List<Cinema> cinemas = cinemaRepository.findAll();
        List<CinemaDTO> cinemaDTOs = new ArrayList<>();
        for (Cinema cinema : cinemas) {
            cinemaDTOs.add(convertToDTO(cinema));
        }
        return cinemaDTOs;
    }

    @Override
    public CinemaDTO getCinemaById(UUID id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", id));
        return convertToDTO(cinema);
    }

    @Override
    public CinemaDTO createCinema(CinemaDTO cinemaDTO) {
        Cinema cinema = convertToEntity(cinemaDTO);
        Cinema savedCinema = cinemaRepository.save(cinema);
        return convertToDTO(savedCinema);
    }

    @Override
    public CinemaDTO updateCinema(UUID id, CinemaDTO cinemaDTO) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", id));
        cinema.setName(cinemaDTO.getName());
        cinema.setAddress(cinemaDTO.getAddress());
        Cinema updatedCinema = cinemaRepository.save(cinema);
        return convertToDTO(updatedCinema);
    }

    @Override
    public void deleteCinema(UUID id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", id));

        List<Room> rooms = roomRepository.findByCinemaId(id);
        if (!rooms.isEmpty()) {
            List<UUID> roomIds = new ArrayList<>();
            for (Room room : rooms) {
                roomIds.add(room.getId());
            }
            List<Showtime> showtimes = showtimeRepository.findByRoomIdIn(roomIds);
            if (!showtimes.isEmpty()) {
                throw new IllegalStateException("Cannot delete cinema with active showtimes.");
            }
        }

        cinemaRepository.delete(cinema);
    }
}
