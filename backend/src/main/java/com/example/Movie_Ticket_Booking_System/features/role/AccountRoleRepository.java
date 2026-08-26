package com.example.Movie_Ticket_Booking_System.features.role;

import com.example.Movie_Ticket_Booking_System.features.account.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRoleRepository extends JpaRepository<AccountRole, Integer> {
    void deleteByAccount(Account account);
}
