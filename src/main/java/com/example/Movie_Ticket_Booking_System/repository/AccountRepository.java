package com.example.Movie_Ticket_Booking_System.repository;

import com.example.Movie_Ticket_Booking_System.domain.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {
    Optional<Account> findByEmail(String email);

    // Kiểm tra nhanh xem email đã tồn tại chưa
    boolean existsByEmail(String email);
}
