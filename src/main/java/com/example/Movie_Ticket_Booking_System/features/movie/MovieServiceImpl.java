package com.example.Movie_Ticket_Booking_System.features.movie;

import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.castmember.CastMember;
import com.example.Movie_Ticket_Booking_System.features.castmember.CastMemberRepository;
import com.example.Movie_Ticket_Booking_System.features.director.Director;
import com.example.Movie_Ticket_Booking_System.features.director.DirectorRepository;
import com.example.Movie_Ticket_Booking_System.features.genre.Genre;
import com.example.Movie_Ticket_Booking_System.features.genre.GenreRepository;
import com.example.Movie_Ticket_Booking_System.features.movie.dto.ReqMovieDTO;
import com.example.Movie_Ticket_Booking_System.features.moviestatus.MovieStatus;
import com.example.Movie_Ticket_Booking_System.features.moviestatus.MovieStatusRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final DirectorRepository directorRepository;
    private final MovieStatusRepository movieStatusRepository;
    private final CastMemberRepository castMemberRepository;
    private final GenreRepository genreRepository;

    public MovieServiceImpl(MovieRepository movieRepository,
                            DirectorRepository directorRepository,
                            MovieStatusRepository movieStatusRepository,
                            CastMemberRepository castMemberRepository,
                            GenreRepository genreRepository) {
        this.movieRepository = movieRepository;
        this.directorRepository = directorRepository;
        this.movieStatusRepository = movieStatusRepository;
        this.castMemberRepository = castMemberRepository;
        this.genreRepository = genreRepository;
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
    public com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<Movie> getAllMovies(int page, int size, String query) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<Movie> moviePage;
        if (query != null && !query.trim().isEmpty()) {
            moviePage = movieRepository.findByTitleContainingIgnoreCase(query.trim(), pageable);
        } else {
            moviePage = movieRepository.findAll(pageable);
        }
        return new com.example.Movie_Ticket_Booking_System.common.dto.PageResponseDTO<>(
            moviePage.getContent(),
            moviePage.getNumber(),
            moviePage.getSize(),
            moviePage.getTotalElements(),
            moviePage.getTotalPages(),
            moviePage.isLast()
        );
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
        entity.setAgeRestriction(dto.getAgeRestriction() != null ? dto.getAgeRestriction() : 0);

        Director director = directorRepository.findById(dto.getDirectorId())
                .orElseThrow(() -> new ResourceNotFoundException("Director", "id", dto.getDirectorId().toString()));
        entity.setDirector(director);

        MovieStatus movieStatus = movieStatusRepository.findById(dto.getMovieStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("MovieStatus", "id", dto.getMovieStatusId().toString()));
        entity.setMovieStatus(movieStatus);

        if (dto.getCastMemberIds() != null) {
            entity.getMovieCasts().removeIf(mc -> !dto.getCastMemberIds().contains(mc.getCastMember().getId()));
            Set<Integer> existingCastIds = entity.getMovieCasts().stream()
                    .map(mc -> mc.getCastMember().getId())
                    .collect(Collectors.toSet());
            
            for (Integer castMemberId : dto.getCastMemberIds()) {
                if (!existingCastIds.contains(castMemberId)) {
                    CastMember castMember = castMemberRepository.findById(castMemberId)
                            .orElseThrow(() -> new ResourceNotFoundException("CastMember", "id", castMemberId.toString()));
                    MovieCast movieCast = new MovieCast();
                    movieCast.setMovie(entity);
                    movieCast.setCastMember(castMember);
                    entity.getMovieCasts().add(movieCast);
                }
            }
        } else {
            entity.getMovieCasts().clear();
        }

        if (dto.getGenreIds() != null) {
            entity.getMovieGenres().removeIf(mg -> !dto.getGenreIds().contains(mg.getGenre().getId()));
            Set<Integer> existingGenreIds = entity.getMovieGenres().stream()
                    .map(mg -> mg.getGenre().getId())
                    .collect(Collectors.toSet());
            
            for (Integer genreId : dto.getGenreIds()) {
                if (!existingGenreIds.contains(genreId)) {
                    Genre genre = genreRepository.findById(genreId)
                            .orElseThrow(() -> new ResourceNotFoundException("Genre", "id", genreId.toString()));
                    MovieGenre movieGenre = new MovieGenre();
                    movieGenre.setMovie(entity);
                    movieGenre.setGenre(genre);
                    entity.getMovieGenres().add(movieGenre);
                }
            }
        } else {
            entity.getMovieGenres().clear();
        }
    }
}