package com.example.Movie_Ticket_Booking_System.features.snack_type;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SnackTypeRepository extends JpaRepository<SnackType, Integer> {
}
