package com.example.Movie_Ticket_Booking_System.features.cinema;

import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.cinema.dto.CinemaDTO;
import com.example.Movie_Ticket_Booking_System.features.room.Room;
import com.example.Movie_Ticket_Booking_System.features.room.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CinemaServiceImpl implements CinemaService {

    private final CinemaRepository cinemaRepository;
    private final RoomRepository roomRepository;

    public CinemaServiceImpl(CinemaRepository cinemaRepository, RoomRepository roomRepository) {
        this.cinemaRepository = cinemaRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public List<CinemaDTO> getAllCinemas() {
        return cinemaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CinemaDTO getCinemaById(Integer id) {
        Cinema cinema = findCinemaById(id);
        return convertToDTO(cinema);
    }

    @Override
    public CinemaDTO createCinema(CinemaDTO cinemaDTO) {
        Cinema cinema = new Cinema();
        cinema.setName(cinemaDTO.getName());
        cinema.setAddress(cinemaDTO.getAddress());
        Cinema savedCinema = cinemaRepository.save(cinema);
        return convertToDTO(savedCinema);
    }

    @Override
    public CinemaDTO updateCinema(Integer id, CinemaDTO cinemaDTO) {
        Cinema cinema = findCinemaById(id);
        cinema.setName(cinemaDTO.getName());
        cinema.setAddress(cinemaDTO.getAddress());
        Cinema updatedCinema = cinemaRepository.save(cinema);
        return convertToDTO(updatedCinema);
    }

    @Override
    public void deleteCinema(Integer id) {
        Cinema cinema = findCinemaById(id);
        List<Room> rooms = roomRepository.findByCinemaId(id);
        if (!rooms.isEmpty()) {
            throw new IllegalStateException("Cannot delete cinema with existing rooms.");
        }
        cinemaRepository.delete(cinema);
    }

    private Cinema findCinemaById(Integer id) {
        return cinemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", id));
    }

    private CinemaDTO convertToDTO(Cinema cinema) {
        return new CinemaDTO(cinema.getId(), cinema.getName(), cinema.getAddress());
    }
}
