package com.example.Movie_Ticket_Booking_System.features.cinema;

import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.cinema.dto.CinemaDTO;
import com.example.Movie_Ticket_Booking_System.features.room.Room;
import com.example.Movie_Ticket_Booking_System.features.room.RoomRepository;
import com.example.Movie_Ticket_Booking_System.features.state.State;
import com.example.Movie_Ticket_Booking_System.features.state.StateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CinemaServiceImpl implements CinemaService {

    private final CinemaRepository cinemaRepository;
    private final RoomRepository roomRepository;
    private final StateRepository stateRepository;

    public CinemaServiceImpl(CinemaRepository cinemaRepository, RoomRepository roomRepository, StateRepository stateRepository) {
        this.cinemaRepository = cinemaRepository;
        this.roomRepository = roomRepository;
        this.stateRepository = stateRepository;
    }

    @Override
    public com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<Cinema> getAllCinemas(int page, int size) {
        org.springframework.data.domain.Page<Cinema> cinemaPage = cinemaRepository.findAll(org.springframework.data.domain.PageRequest.of(page, size));
        return new com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<>(
            cinemaPage.getContent(),
            cinemaPage.getNumber(),
            cinemaPage.getSize(),
            cinemaPage.getTotalElements(),
            cinemaPage.getTotalPages(),
            cinemaPage.isLast()
        );
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
        cinema.setCity(cinemaDTO.getCity());
        if (cinemaDTO.getStateId() != null) {
            State state = stateRepository.findById(cinemaDTO.getStateId())
                    .orElseThrow(() -> new ResourceNotFoundException("State", "id", cinemaDTO.getStateId().toString()));
            cinema.setState(state);
        }
        Cinema savedCinema = cinemaRepository.save(cinema);
        return convertToDTO(savedCinema);
    }

    @Override
    public CinemaDTO updateCinema(Integer id, CinemaDTO cinemaDTO) {
        Cinema cinema = findCinemaById(id);
        cinema.setName(cinemaDTO.getName());
        cinema.setAddress(cinemaDTO.getAddress());
        cinema.setCity(cinemaDTO.getCity());
        if (cinemaDTO.getStateId() != null) {
            State state = stateRepository.findById(cinemaDTO.getStateId())
                    .orElseThrow(() -> new ResourceNotFoundException("State", "id", cinemaDTO.getStateId().toString()));
            cinema.setState(state);
        } else {
            cinema.setState(null);
        }
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
        Integer stateId = cinema.getState() != null ? cinema.getState().getId() : null;
        String stateName = cinema.getState() != null ? cinema.getState().getName() : null;
        return new CinemaDTO(cinema.getId(), cinema.getName(), cinema.getAddress(), cinema.getCity(), stateId, stateName);
    }
}
