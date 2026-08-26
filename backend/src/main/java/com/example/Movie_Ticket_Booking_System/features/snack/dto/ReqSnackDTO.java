package com.example.Movie_Ticket_Booking_System.features.snack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public class ReqSnackDTO {
    @NotNull(message = "Snack Type ID is required")
    private Integer snackTypeId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Base price is required")
    @PositiveOrZero(message = "Base price must be zero or positive")
    private BigDecimal basePrice;

    private String imageUrl;

    public Integer getSnackTypeId() {
        return snackTypeId;
    }

    public void setSnackTypeId(Integer snackTypeId) {
        this.snackTypeId = snackTypeId;
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
