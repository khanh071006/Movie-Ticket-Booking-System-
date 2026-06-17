package com.example.Movie_Ticket_Booking_System.features.snack.dto;

import com.example.Movie_Ticket_Booking_System.features.snack.Snack;
import java.math.BigDecimal;

public class ResSnackDTO {
    private Integer id;
    private Integer snackTypeId;
    private String snackTypeName;
    private String name;
    private BigDecimal basePrice;
    private String imageUrl;

    public ResSnackDTO(Snack snack) {
        this.id = snack.getId();
        if (snack.getSnackType() != null) {
            this.snackTypeId = snack.getSnackType().getId();
            this.snackTypeName = snack.getSnackType().getName();
        }
        this.name = snack.getName();
        this.basePrice = snack.getBasePrice();
        this.imageUrl = snack.getImageUrl();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getSnackTypeId() {
        return snackTypeId;
    }

    public void setSnackTypeId(Integer snackTypeId) {
        this.snackTypeId = snackTypeId;
    }

    public String getSnackTypeName() {
        return snackTypeName;
    }

    public void setSnackTypeName(String snackTypeName) {
        this.snackTypeName = snackTypeName;
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
