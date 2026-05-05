package com.example.Movie_Ticket_Booking_System.features.role;

import com.example.Movie_Ticket_Booking_System.features.role.dto.ReqRoleDTO;
import java.util.List;

public interface RoleService {
    Role createRole(ReqRoleDTO reqRoleDTO);
    Role getRoleById(Integer id);
    List<Role> getAllRoles();
    Role updateRole(Integer id, ReqRoleDTO reqRoleDTO);
    void deleteRole(Integer id);
}
