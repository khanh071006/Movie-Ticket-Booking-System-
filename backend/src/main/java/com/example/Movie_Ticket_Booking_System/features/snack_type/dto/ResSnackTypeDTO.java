package com.example.Movie_Ticket_Booking_System.features.snack_type.dto;

import com.example.Movie_Ticket_Booking_System.features.snack_type.SnackType;

public class ResSnackTypeDTO {
    private Integer id;
    private String name;

    public ResSnackTypeDTO(SnackType snackType) {
        this.id = snackType.getId();
        this.name = snackType.getName();
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
