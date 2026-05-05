package com.example.Movie_Ticket_Booking_System.features.cinema.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class CinemaDTO {
    private UUID id;

    @NotBlank(message = "Cinema name cannot be blank")
    private String name;

    @NotBlank(message = "Cinema address cannot be blank")
    private String address;

    public CinemaDTO() {
    }

    public CinemaDTO(UUID id, String name, String address) {
        this.id = id;
        this.name = name;
        this.address = address;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public static CinemaDTOBuilder builder() {
        return new CinemaDTOBuilder();
    }

    public static class CinemaDTOBuilder {
        private UUID id;
        private String name;
        private String address;

        CinemaDTOBuilder() {
        }

        public CinemaDTOBuilder id(UUID id) {
            this.id = id;
            return this;
        }

        public CinemaDTOBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CinemaDTOBuilder address(String address) {
            this.address = address;
            return this;
        }

        public CinemaDTO build() {
            return new CinemaDTO(id, name, address);
        }
    }
}
