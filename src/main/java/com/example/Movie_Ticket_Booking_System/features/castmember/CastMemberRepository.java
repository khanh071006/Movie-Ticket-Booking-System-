package com.example.Movie_Ticket_Booking_System.features.castmember;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CastMemberRepository extends JpaRepository<CastMember, UUID> {
    Optional<CastMember> findByName(String name);
}
