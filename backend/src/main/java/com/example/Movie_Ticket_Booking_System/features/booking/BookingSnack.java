package com.example.Movie_Ticket_Booking_System.features.booking;

import com.example.Movie_Ticket_Booking_System.features.snack.Snack;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "booking_snack")
public class BookingSnack {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "snack_id", nullable = false)
    private Snack snack;

    @Column(name = "snack_qty", nullable = false)
    private Integer snackQty;

    @Column(name = "purchase_price", nullable = false)
    private BigDecimal purchasePrice;

    public BookingSnack() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public Snack getSnack() {
        return snack;
    }

    public void setSnack(Snack snack) {
        this.snack = snack;
    }

    public Integer getSnackQty() {
        return snackQty;
    }

    public void setSnackQty(Integer snackQty) {
        this.snackQty = snackQty;
    }

    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }
}
