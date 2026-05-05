package com.example.Movie_Ticket_Booking_System.features.moviestatus;

import com.example.Movie_Ticket_Booking_System.exception.DuplicateResourceException;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.moviestatus.dto.ReqMovieStatusDTO;
import com.example.Movie_Ticket_Booking_System.features.moviestatus.dto.ResMovieStatusDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MovieStatusServiceImpl implements MovieStatusService {

    private final MovieStatusRepository movieStatusRepository;

    public MovieStatusServiceImpl(MovieStatusRepository movieStatusRepository) {
        this.movieStatusRepository = movieStatusRepository;
    }

    @Override
    @Transactional
    public ResMovieStatusDTO handleCreateMovieStatus(ReqMovieStatusDTO reqMovieStatusDTO) {
        if (movieStatusRepository.findByName(reqMovieStatusDTO.getName()).isPresent()) {
            throw new DuplicateResourceException("MovieStatus", "name", reqMovieStatusDTO.getName());
        }
        MovieStatus movieStatus = new MovieStatus();
        movieStatus.setName(reqMovieStatusDTO.getName());
        movieStatus = movieStatusRepository.save(movieStatus);
        return ResMovieStatusDTO.fromMovieStatus(movieStatus);
    }

    @Override
    public List<ResMovieStatusDTO> handleGetAllMovieStatuses() {
        List<MovieStatus> statuses = movieStatusRepository.findAll();
        List<ResMovieStatusDTO> res = new ArrayList<>();
        for (MovieStatus m : statuses) {
            res.add(ResMovieStatusDTO.fromMovieStatus(m));
        }
        return res;
    }

    @Override
    public ResMovieStatusDTO handleGetMovieStatusById(UUID id) {
        MovieStatus movieStatus = movieStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MovieStatus", "id", id));
        return ResMovieStatusDTO.fromMovieStatus(movieStatus);
    }

    @Override
    @Transactional
    public ResMovieStatusDTO handleUpdateMovieStatus(UUID id, ReqMovieStatusDTO reqMovieStatusDTO) {
        MovieStatus existingMovieStatus = movieStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MovieStatus", "id", id));

        String newName = reqMovieStatusDTO.getName();

        if (!existingMovieStatus.getName().equals(newName)) {
            Optional<MovieStatus> movieStatusWithNewName = movieStatusRepository.findByName(newName);
            if (movieStatusWithNewName.isPresent()) {
                throw new DuplicateResourceException("MovieStatus", "name", newName);
            }
            existingMovieStatus.setName(newName);
        }

        MovieStatus updatedMovieStatus = movieStatusRepository.save(existingMovieStatus);
        return ResMovieStatusDTO.fromMovieStatus(updatedMovieStatus);
    }

    @Override
    @Transactional
    public void handleDeleteMovieStatus(UUID id) {
        if (!movieStatusRepository.existsById(id)) {
            throw new ResourceNotFoundException("MovieStatus", "id", id);
        }
        movieStatusRepository.deleteById(id);
    }
}
