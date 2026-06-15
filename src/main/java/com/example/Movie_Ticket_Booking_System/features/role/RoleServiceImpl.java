package com.example.Movie_Ticket_Booking_System.features.role;

import com.example.Movie_Ticket_Booking_System.exception.DuplicateResourceException;
import com.example.Movie_Ticket_Booking_System.exception.ResourceNotFoundException;
import com.example.Movie_Ticket_Booking_System.features.role.dto.ReqRoleDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public Role createRole(ReqRoleDTO reqRoleDTO) {
        // Kiểm tra xem role name đã tồn tại chưa
        if (roleRepository.findByName(reqRoleDTO.getName().toUpperCase()).isPresent()) {
            throw new DuplicateResourceException("Role", "name", reqRoleDTO.getName());
        }

        Role role = new Role();
        role.setName(reqRoleDTO.getName().toUpperCase()); // Thống nhất lưu tên role ở dạng chữ hoa
        return roleRepository.save(role);
    }

    @Override
    public Role getRoleById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id.toString()));
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    @Transactional
    public Role updateRole(Integer id, ReqRoleDTO reqRoleDTO) {
        Role role = getRoleById(id);

        // Kiểm tra xem tên mới có bị trùng không (nếu tên mới khác tên cũ)
        String newName = reqRoleDTO.getName().toUpperCase();
        if (!role.getName().equals(newName) && roleRepository.findByName(newName).isPresent()) {
            throw new DuplicateResourceException("Role", "name", newName);
        }

        role.setName(newName);
        return roleRepository.save(role);
    }

    @Override
    @Transactional
    public void deleteRole(Integer id) {
        Role role = getRoleById(id);
        roleRepository.delete(role);
    }
}
