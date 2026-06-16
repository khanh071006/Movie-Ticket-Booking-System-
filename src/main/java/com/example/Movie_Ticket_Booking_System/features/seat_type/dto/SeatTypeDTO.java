package com.example.Movie_Ticket_Booking_System.features.seat_type.dto;

import jakarta.validation.constraints.NotBlank;

public class SeatTypeDTO {
    private Integer id;

    @NotBlank(message = "Seat type name cannot be blank")
    private String name;

    private Integer seatCount = 1;

    public SeatTypeDTO() {
    }

    public SeatTypeDTO(Integer id, String name, Integer seatCount) {
        this.id = id;
        this.name = name;
        if (seatCount != null) {
            this.seatCount = seatCount;
        }
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

    public Integer getSeatCount() {
        return seatCount;
    }

    public void setSeatCount(Integer seatCount) {
        this.seatCount = seatCount;
    }
}
