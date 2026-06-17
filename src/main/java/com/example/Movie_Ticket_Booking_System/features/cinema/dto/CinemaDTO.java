package com.example.Movie_Ticket_Booking_System.features.cinema.dto;

import jakarta.validation.constraints.NotBlank;

public class CinemaDTO {
    private Integer id;

    @NotBlank(message = "Cinema name cannot be blank")
    private String name;

    private String address;

    private String city;

    private Integer stateId;
    
    private String stateName;

    public CinemaDTO() {
    }

    public CinemaDTO(Integer id, String name, String address, String city, Integer stateId, String stateName) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.city = city;
        this.stateId = stateId;
        this.stateName = stateName;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getStateId() {
        return stateId;
    }

    public void setStateId(Integer stateId) {
        this.stateId = stateId;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }
}
