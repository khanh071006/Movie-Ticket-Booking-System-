package com.example.Movie_Ticket_Booking_System.features.castmember.dto;

import com.example.Movie_Ticket_Booking_System.features.castmember.CastMember;

public class ResCastMemberDTO {
    private Integer id;
    private String name;
    private String imageUrl;

    public ResCastMemberDTO(Integer id, String name, String imageUrl) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    }

    public static ResCastMemberDTO fromCastMember(CastMember castMember) {
        return new ResCastMemberDTO(castMember.getId(), castMember.getName(), castMember.getImageUrl());
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
