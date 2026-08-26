package com.example.Movie_Ticket_Booking_System.features.snack_type;

import jakarta.persistence.*;

@Entity
@Table(name = "snack_type")
public class SnackType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    public SnackType() {
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
