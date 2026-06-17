package com.example.Movie_Ticket_Booking_System.features.movie.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.List;
import java.util.List;

public class ReqMovieDTO {

    @NotBlank(message = "Tên phim không được để trống")
    private String title;

    private String description;

    @Positive(message = "Thời lượng phim phải lớn hơn 0")
    private Integer durationMinutes;

    private LocalDate releaseDate;

    private String language;

    private String posterUrl;

    private String trailerUrl;

    private Integer ageRestriction;

    @NotNull(message = "ID đạo diễn không được để trống")
    private Integer directorId;

    @NotNull(message = "ID trạng thái phim không được để trống")
    private Integer movieStatusId;

    private List<Integer> castMemberIds;

    private List<Integer> genreIds;


    // Getters and Setters

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getTrailerUrl() {
        return trailerUrl;
    }

    public void setTrailerUrl(String trailerUrl) {
        this.trailerUrl = trailerUrl;
    }

    public Integer getAgeRestriction() {
        return ageRestriction;
    }

    public void setAgeRestriction(Integer ageRestriction) {
        this.ageRestriction = ageRestriction;
    }

    public Integer getDirectorId() {
        return directorId;
    }

    public void setDirectorId(Integer directorId) {
        this.directorId = directorId;
    }

    public Integer getMovieStatusId() {
        return movieStatusId;
    }

    public void setMovieStatusId(Integer movieStatusId) {
        this.movieStatusId = movieStatusId;
    }

    public List<Integer> getCastMemberIds() {
        return castMemberIds;
    }

    public void setCastMemberIds(List<Integer> castMemberIds) {
        this.castMemberIds = castMemberIds;
    }

    public List<Integer> getGenreIds() {
        return genreIds;
    }

    public void setGenreIds(List<Integer> genreIds) {
        this.genreIds = genreIds;
    }
}