package com.example.Movie_Ticket_Booking_System.features.cinema_pricing;

import com.example.Movie_Ticket_Booking_System.features.cinema.Cinema;
import com.example.Movie_Ticket_Booking_System.features.ticket_type.TicketType;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cinema_ticket_price", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"cinema_id", "ticket_type_id"})
})
public class CinemaTicketPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cinema_id", nullable = false)
    private Cinema cinema;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_type_id", nullable = false)
    private TicketType ticketType;

    @Column(nullable = false)
    private BigDecimal price;

    public CinemaTicketPrice() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Cinema getCinema() {
        return cinema;
    }

    public void setCinema(Cinema cinema) {
        this.cinema = cinema;
    }

    public TicketType getTicketType() {
        return ticketType;
    }

    public void setTicketType(TicketType ticketType) {
        this.ticketType = ticketType;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
