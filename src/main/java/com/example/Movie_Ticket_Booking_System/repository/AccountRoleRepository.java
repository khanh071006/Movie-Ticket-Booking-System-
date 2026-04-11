package com.example.Movie_Ticket_Booking_System.repository;

import com.example.Movie_Ticket_Booking_System.domain.entity.AccountRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRoleRepository extends JpaRepository<AccountRole, Long> {
}
