package com.example.Movie_Ticket_Booking_System.features.movie.dto;

import com.example.Movie_Ticket_Booking_System.features.movie.Movie;
import com.example.Movie_Ticket_Booking_System.features.movie.MovieCast;
import com.example.Movie_Ticket_Booking_System.features.movie.MovieGenre;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

public class ResMovieDTO {
    private final UUID id;
    private final String title;
    private final String description;
    private final Integer durationMinutes;
    private final LocalDate releaseDate;
    private final String language;
    private final String posterUrl;
    private final String trailerUrl;
    private final DirectorDTO director;
    private final MovieStatusDTO movieStatus;
    private final List<CastMemberDTO> castMembers;
    private final List<GenreDTO> genres;

    public ResMovieDTO(Movie movie) {
        this.id = movie.getId();
        this.title = movie.getTitle();
        this.description = movie.getDescription();
        this.durationMinutes = movie.getDurationMinutes();
        this.releaseDate = movie.getReleaseDate();
        this.language = movie.getLanguage();
        this.posterUrl = movie.getPosterUrl();
        this.trailerUrl = movie.getTrailerUrl();

        this.director = Optional.ofNullable(movie.getDirector())
                .map(d -> new DirectorDTO(d.getId(), d.getName()))
                .orElse(null);

        this.movieStatus = Optional.ofNullable(movie.getMovieStatus())
                .map(ms -> new MovieStatusDTO(ms.getId(), ms.getName()))
                .orElse(null);

        this.castMembers = Optional.ofNullable(movie.getMovieCasts())
                .map(casts -> casts.stream()
                        .map(MovieCast::getCastMember)
                        .map(cast -> new CastMemberDTO(cast.getId(), cast.getName()))
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());

        this.genres = Optional.ofNullable(movie.getMovieGenres())
                .map(genres -> genres.stream()
                        .map(MovieGenre::getGenre)
                        .map(genre -> new GenreDTO(genre.getId(), genre.getName()))
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    // Getters
    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public LocalDate getReleaseDate() { return releaseDate; }
    public String getLanguage() { return language; }
    public String getPosterUrl() { return posterUrl; }
    public String getTrailerUrl() { return trailerUrl; }
    public DirectorDTO getDirector() { return director; }
    public MovieStatusDTO getMovieStatus() { return movieStatus; }
    public List<CastMemberDTO> getCastMembers() { return castMembers; }
    public List<GenreDTO> getGenres() { return genres; }

    // Inner DTOs
    private static class DirectorDTO {
        private final Integer id;
        private final String name;
        public DirectorDTO(Integer id, String name) { this.id = id; this.name = name; }
        public Integer getId() { return id; }
        public String getName() { return name; }
    }

    private static class MovieStatusDTO {
        private final Integer id;
        private final String name;
        public MovieStatusDTO(Integer id, String name) { this.id = id; this.name = name; }
        public Integer getId() { return id; }
        public String getName() { return name; }
    }

    private static class CastMemberDTO {
        private final Integer id;
        private final String name;
        public CastMemberDTO(Integer id, String name) { this.id = id; this.name = name; }
        public Integer getId() { return id; }
        public String getName() { return name; }
    }

    private static class GenreDTO {
        private final Integer id;
        private final String name;
        public GenreDTO(Integer id, String name) { this.id = id; this.name = name; }
        public Integer getId() { return id; }
        public String getName() { return name; }
    }
}