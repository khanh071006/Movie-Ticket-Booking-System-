package com.example.Movie_Ticket_Booking_System.features.cinema_pricing.dto;

import java.math.BigDecimal;
import java.util.List;

public class ReqCinemaPricingDTO {

    private List<TicketPriceDTO> ticketPrices;
    private List<SeatPriceDTO> seatPrices;

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
        private BigDecimal price;

        public Integer getTicketTypeId() { return ticketTypeId; }
        public void setTicketTypeId(Integer ticketTypeId) { this.ticketTypeId = ticketTypeId; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
    }

    public static class SeatPriceDTO {
        private Integer seatTypeId;
        private BigDecimal surcharge;

        public Integer getSeatTypeId() { return seatTypeId; }
        public void setSeatTypeId(Integer seatTypeId) { this.seatTypeId = seatTypeId; }
        public BigDecimal getSurcharge() { return surcharge; }
        public void setSurcharge(BigDecimal surcharge) { this.surcharge = surcharge; }
    }
}
