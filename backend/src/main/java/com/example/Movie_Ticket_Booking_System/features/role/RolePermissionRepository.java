package com.example.Movie_Ticket_Booking_System.features.role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Integer> {
    List<RolePermission> findByRole(Role role);
    void deleteByRole(Role role);
}
