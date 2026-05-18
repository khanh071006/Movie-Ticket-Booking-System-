package com.example.Movie_Ticket_Booking_System.features.seat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SeatDTO {
    private Integer id;

    @NotBlank(message = "Seat location cannot be blank")
    private String seatLocation;

    @NotNull(message = "Seat type ID cannot be null")
    private Integer seatTypeId;

    private String seatTypeName;

    @NotNull(message = "Room ID cannot be null")
    private Integer roomId;

    public SeatDTO() {
    }

    public SeatDTO(Integer id, String seatLocation, Integer seatTypeId, String seatTypeName, Integer roomId) {
        this.id = id;
        this.seatLocation = seatLocation;
        this.seatTypeId = seatTypeId;
        this.seatTypeName = seatTypeName;
        this.roomId = roomId;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getSeatLocation() { return seatLocation; }
    public void setSeatLocation(String seatLocation) { this.seatLocation = seatLocation; }
    public Integer getSeatTypeId() { return seatTypeId; }
    public void setSeatTypeId(Integer seatTypeId) { this.seatTypeId = seatTypeId; }
    public String getSeatTypeName() { return seatTypeName; }
    public void setSeatTypeName(String seatTypeName) { this.seatTypeName = seatTypeName; }
    public Integer getRoomId() { return roomId; }
    public void setRoomId(Integer roomId) { this.roomId = roomId; }
}
