package com.example.Movie_Ticket_Booking_System.features.castmember.dto;

import com.example.Movie_Ticket_Booking_System.features.castmember.CastMember;

public class ResCastMemberDTO {
    private Integer id;
    private String name;

    public ResCastMemberDTO(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public static ResCastMemberDTO fromCastMember(CastMember castMember) {
        return new ResCastMemberDTO(castMember.getId(), castMember.getName());
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
