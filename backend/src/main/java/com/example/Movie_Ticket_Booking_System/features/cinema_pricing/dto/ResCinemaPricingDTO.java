package com.example.Movie_Ticket_Booking_System.features.cinema_pricing.dto;

import java.math.BigDecimal;
import java.util.List;

public class ResCinemaPricingDTO {

    private String cinemaId;
    private List<TicketPriceDTO> ticketPrices;
    private List<SeatPriceDTO> seatPrices;

    public String getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(String cinemaId) {
        this.cinemaId = cinemaId;
    }

    public List<TicketPriceDTO> getTicketPrices() {
        return ticketPrices;
    }

    public void setTicketPrices(List<TicketPriceDTO> ticketPrices) {
        this.ticketPrices = ticketPrices;
    }

    public List<SeatPriceDTO> getSeatPrices() {
        return seatPrices;
    }

    public void setSeatPrices(List<SeatPriceDTO> seatPrices) {
        this.seatPrices = seatPrices;
    }

    public static class TicketPriceDTO {
        private Integer ticketTypeId;
        private String ticketTypeName;
        private BigDecimal price;

        public Integer getTicketTypeId() { return ticketTypeId; }
        public void setTicketTypeId(Integer ticketTypeId) { this.ticketTypeId = ticketTypeId; }
        public String getTicketTypeName() { return ticketTypeName; }
        public void setTicketTypeName(String ticketTypeName) { this.ticketTypeName = ticketTypeName; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
    }

    public static class SeatPriceDTO {
        private Integer seatTypeId;
        private String seatTypeName;
        private BigDecimal surcharge;

        public Integer getSeatTypeId() { return seatTypeId; }
        public void setSeatTypeId(Integer seatTypeId) { this.seatTypeId = seatTypeId; }
        public String getSeatTypeName() { return seatTypeName; }
        public void setSeatTypeName(String seatTypeName) { this.seatTypeName = seatTypeName; }
        public BigDecimal getSurcharge() { return surcharge; }
        public void setSurcharge(BigDecimal surcharge) { this.surcharge = surcharge; }
    }
}
