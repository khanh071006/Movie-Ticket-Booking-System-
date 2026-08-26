package com.example.Movie_Ticket_Booking_System.features.cinema_pricing;

import com.example.Movie_Ticket_Booking_System.features.cinema.Cinema;
import com.example.Movie_Ticket_Booking_System.features.seat_type.SeatType;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cinema_seat_price", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"cinema_id", "seat_type_id"})
})
public class CinemaSeatPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cinema_id", nullable = false)
    private Cinema cinema;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_type_id", nullable = false)
    private SeatType seatType;

    @Column(nullable = false)
    private BigDecimal surcharge;

    public CinemaSeatPrice() {}

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

    public SeatType getSeatType() {
        return seatType;
    }

    public void setSeatType(SeatType seatType) {
        this.seatType = seatType;
    }

    public BigDecimal getSurcharge() {
        return surcharge;
    }

    public void setSurcharge(BigDecimal surcharge) {
        this.surcharge = surcharge;
    }
}
