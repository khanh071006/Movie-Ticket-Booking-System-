package com.example.Movie_Ticket_Booking_System.features.state.dto;

import com.example.Movie_Ticket_Booking_System.features.state.State;

public class ResStateDTO {
    private Integer id;
    private String name;

    public ResStateDTO(State state) {
        this.id = state.getId();
        this.name = state.getName();
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
