package com.example.Movie_Ticket_Booking_System.features.movie;

import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.movie.dto.ReqMovieDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

    public MovieServiceImpl(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    @Transactional
    public Movie createMovie(ReqMovieDTO reqMovieDTO) {
        Movie movie = new Movie();
        mapDtoToEntity(reqMovieDTO, movie);
        return movieRepository.save(movie);
    }

    @Override
    public Movie getMovieById(UUID id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", id.toString()));
    }

    @Override
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @Override
    @Transactional
    public Movie updateMovie(UUID id, ReqMovieDTO reqMovieDTO) {
        Movie movie = getMovieById(id);
        mapDtoToEntity(reqMovieDTO, movie);
        return movieRepository.save(movie);
    }

    @Override
    @Transactional
    public void deleteMovie(UUID id) {
        Movie movie = getMovieById(id);
        movieRepository.delete(movie);
    }

    private void mapDtoToEntity(ReqMovieDTO dto, Movie entity) {
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setDurationMinutes(dto.getDurationMinutes());
        entity.setReleaseDate(dto.getReleaseDate());
        entity.setLanguage(dto.getLanguage());
        entity.setPosterUrl(dto.getPosterUrl());
        entity.setTrailerUrl(dto.getTrailerUrl());
    }
}
