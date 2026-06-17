package com.example.Movie_Ticket_Booking_System.features.showtime.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ShowtimeResponseDTO {
    private UUID id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private MovieInfo movie;
    private RoomInfo room;

    // Constructors, Getters, Setters, and Builder for ShowtimeResponseDTO
    public ShowtimeResponseDTO() {}

    public ShowtimeResponseDTO(UUID id, LocalDateTime startTime, LocalDateTime endTime, MovieInfo movie, RoomInfo room) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.movie = movie;
        this.room = room;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public MovieInfo getMovie() { return movie; }
    public void setMovie(MovieInfo movie) { this.movie = movie; }
    public RoomInfo getRoom() { return room; }
    public void setRoom(RoomInfo room) { this.room = room; }

    public static ShowtimeResponseDTOBuilder builder() {
        return new ShowtimeResponseDTOBuilder();
    }

    public static class ShowtimeResponseDTOBuilder {
        private UUID id;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private MovieInfo movie;
        private RoomInfo room;

        public ShowtimeResponseDTOBuilder id(UUID id) { this.id = id; return this; }
        public ShowtimeResponseDTOBuilder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public ShowtimeResponseDTOBuilder endTime(LocalDateTime endTime) { this.endTime = endTime; return this; }
        public ShowtimeResponseDTOBuilder movie(MovieInfo movie) { this.movie = movie; return this; }
        public ShowtimeResponseDTOBuilder room(RoomInfo room) { this.room = room; return this; }

        public ShowtimeResponseDTO build() {
            return new ShowtimeResponseDTO(id, startTime, endTime, movie, room);
        }
    }

    // Inner class MovieInfo
    public static class MovieInfo {
        private UUID id;
        private String title;
        private Integer durationMinutes;

        public MovieInfo() {}
        public MovieInfo(UUID id, String title, Integer durationMinutes) {
            this.id = id;
            this.title = title;
            this.durationMinutes = durationMinutes;
        }

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public Integer getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

        public static MovieInfoBuilder builder() {
            return new MovieInfoBuilder();
        }

        public static class MovieInfoBuilder {
            private UUID id;
            private String title;
            private Integer durationMinutes;

            public MovieInfoBuilder id(UUID id) { this.id = id; return this; }
            public MovieInfoBuilder title(String title) { this.title = title; return this; }
            public MovieInfoBuilder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }

            public MovieInfo build() {
                return new MovieInfo(id, title, durationMinutes);
            }
        }
    }

    // Inner class RoomInfo
    public static class RoomInfo {
        private Integer id; // Thay đổi từ UUID sang Integer
        private String name;
        private CinemaInfo cinema;

        public RoomInfo() {}
        public RoomInfo(Integer id, String name, CinemaInfo cinema) { // Thay đổi kiểu id
            this.id = id;
            this.name = name;
            this.cinema = cinema;
        }

        public Integer getId() { return id; } // Thay đổi kiểu trả về
        public void setId(Integer id) { this.id = id; } // Thay đổi kiểu tham số
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public CinemaInfo getCinema() { return cinema; }
        public void setCinema(CinemaInfo cinema) { this.cinema = cinema; }

        public static RoomInfoBuilder builder() {
            return new RoomInfoBuilder();
        }

        public static class RoomInfoBuilder {
            private Integer id; // Thay đổi từ UUID sang Integer
            private String name;
            private CinemaInfo cinema;

            public RoomInfoBuilder id(Integer id) { this.id = id; return this; } // Thay đổi kiểu id
            public RoomInfoBuilder name(String name) { this.name = name; return this; }
            public RoomInfoBuilder cinema(CinemaInfo cinema) { this.cinema = cinema; return this; }

            public RoomInfo build() {
                return new RoomInfo(id, name, cinema);
            }
        }
    }

    // Inner class CinemaInfo
    public static class CinemaInfo {
        private Integer id; 
        private String name;
        private String city;

        public CinemaInfo() {}
        public CinemaInfo(Integer id, String name, String city) { 
            this.id = id;
            this.name = name;
            this.city = city;
        }

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public static CinemaInfoBuilder builder() {
            return new CinemaInfoBuilder();
        }

        public static class CinemaInfoBuilder {
            private Integer id; 
            private String name;
            private String city;

            public CinemaInfoBuilder id(Integer id) { this.id = id; return this; } 
            public CinemaInfoBuilder name(String name) { this.name = name; return this; }
            public CinemaInfoBuilder city(String city) { this.city = city; return this; }

            public CinemaInfo build() {
                return new CinemaInfo(id, name, city);
            }
        }
    }
}
