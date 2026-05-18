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

        Director director = directorRepository.findById(dto.getDirectorId())
                .orElseThrow(() -> new ResourceNotFoundException("Director", "id", dto.getDirectorId().toString()));
        entity.setDirector(director);

        MovieStatus movieStatus = movieStatusRepository.findById(dto.getMovieStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("MovieStatus", "id", dto.getMovieStatusId().toString()));
        entity.setMovieStatus(movieStatus);

        // Clear existing collections to handle updates correctly
        entity.getMovieCasts().clear();
        entity.getMovieGenres().clear();

        if (dto.getCastMemberIds() != null) {
            Set<MovieCast> castMembers = dto.getCastMemberIds().stream().map(castMemberId -> {
                CastMember castMember = castMemberRepository.findById(castMemberId)
                        .orElseThrow(() -> new ResourceNotFoundException("CastMember", "id", castMemberId.toString()));
                MovieCast movieCast = new MovieCast();
                movieCast.setMovie(entity);
                movieCast.setCastMember(castMember);
                return movieCast;
            }).collect(Collectors.toSet());
            entity.getMovieCasts().addAll(castMembers);
        }

        if (dto.getGenreIds() != null) {
            Set<MovieGenre> genres = dto.getGenreIds().stream().map(genreId -> {
                Genre genre = genreRepository.findById(genreId)
                        .orElseThrow(() -> new ResourceNotFoundException("Genre", "id", genreId.toString()));
                MovieGenre movieGenre = new MovieGenre();
                movieGenre.setMovie(entity);
                movieGenre.setGenre(genre);
                return movieGenre;
            }).collect(Collectors.toSet());
            entity.getMovieGenres().addAll(genres);
        }
    }
}