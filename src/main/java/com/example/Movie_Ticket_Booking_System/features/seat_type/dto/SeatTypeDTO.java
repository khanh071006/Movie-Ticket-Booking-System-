package com.example.Movie_Ticket_Booking_System.features.seat_type.dto;

import jakarta.validation.constraints.NotBlank;

public class SeatTypeDTO {
    private Integer id;

    @NotBlank(message = "Seat type name cannot be blank")
    private String name;

    public SeatTypeDTO() {
    }

    public SeatTypeDTO(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
