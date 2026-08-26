package com.example.Movie_Ticket_Booking_System.features.ticket_type.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public class TicketTypeDTO {
    private Integer id;

    @NotBlank(message = "Ticket type name cannot be blank")
    private String name;

    @NotNull(message = "Base price cannot be null")
    @PositiveOrZero(message = "Base price must be zero or positive")
    private BigDecimal basePrice;

    public TicketTypeDTO() {
    }

    public TicketTypeDTO(Integer id, String name, BigDecimal basePrice) {
        this.id = id;
        this.name = name;
        this.basePrice = basePrice;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
}
