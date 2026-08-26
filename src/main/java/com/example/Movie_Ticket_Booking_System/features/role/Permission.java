package com.example.Movie_Ticket_Booking_System.features.role;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "permissions")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 50)
    private String resource; // e.g., MOVIE, CINEMA, BOOKING

    @Column(nullable = false, length = 50)
    private String action; // e.g., CREATE, READ, UPDATE, DELETE

    @Column(nullable = false, unique = true, length = 100)
    private String code; // e.g., MOVIE_CREATE, CINEMA_READ

    @OneToMany(mappedBy = "permission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RolePermission> rolePermissions;

    public Permission() {}

    public Permission(String resource, String action, String code) {
        this.resource = resource;
        this.action = action;
        this.code = code;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getResource() {
        return resource;
    }

    public void setResource(String resource) {
        this.resource = resource;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public List<RolePermission> getRolePermissions() {
        return rolePermissions;
    }

    public void setRolePermissions(List<RolePermission> rolePermissions) {
        this.rolePermissions = rolePermissions;
    }
}
