package com.example.Movie_Ticket_Booking_System.features.snack;

import com.example.Movie_Ticket_Booking_System.features.snack_type.SnackType;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "snacks")
public class Snack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "snack_type_id", nullable = false)
    private SnackType snackType;

    @Column(nullable = false)
    private String name;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Column(name = "image_url")
    private String imageUrl;

    public Snack() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public SnackType getSnackType() {
        return snackType;
    }

    public void setSnackType(SnackType snackType) {
        this.snackType = snackType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
