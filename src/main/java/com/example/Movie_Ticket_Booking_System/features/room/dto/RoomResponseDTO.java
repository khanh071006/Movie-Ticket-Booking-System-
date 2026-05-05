package com.example.Movie_Ticket_Booking_System.features.room.dto;

import java.util.UUID;

public class RoomResponseDTO {
    private UUID id;
    private String name;
    private UUID cinemaId;

    public RoomResponseDTO() {}

    public RoomResponseDTO(UUID id, String name, UUID cinemaId) {
        this.id = id;
        this.name = name;
        this.cinemaId = cinemaId;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public UUID getCinemaId() { return cinemaId; }
    public void setCinemaId(UUID cinemaId) { this.cinemaId = cinemaId; }

    public static RoomResponseDTOBuilder builder() {
        return new RoomResponseDTOBuilder();
    }

    public static class RoomResponseDTOBuilder {
        private UUID id;
        private String name;
        private UUID cinemaId;

        public RoomResponseDTOBuilder id(UUID id) { this.id = id; return this; }
        public RoomResponseDTOBuilder name(String name) { this.name = name; return this; }
        public RoomResponseDTOBuilder cinemaId(UUID cinemaId) { this.cinemaId = cinemaId; return this; }

        public RoomResponseDTO build() {
            return new RoomResponseDTO(id, name, cinemaId);
        }
    }
}
