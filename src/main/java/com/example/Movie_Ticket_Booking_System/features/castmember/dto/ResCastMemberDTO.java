package com.example.Movie_Ticket_Booking_System.features.castmember.dto;

import com.example.Movie_Ticket_Booking_System.features.castmember.CastMember;

import java.util.UUID;

public class ResCastMemberDTO {
    private UUID id;
    private String name;

    public ResCastMemberDTO(UUID id, String name) {
        this.id = id;
        this.name = name;
    }

    public static ResCastMemberDTO fromCastMember(CastMember castMember) {
        return new ResCastMemberDTO(castMember.getId(), castMember.getName());
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
}
