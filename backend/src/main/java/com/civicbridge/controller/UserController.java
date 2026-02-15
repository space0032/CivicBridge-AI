package com.civicbridge.controller;

import com.civicbridge.dto.ApiResponse;
import com.civicbridge.model.Role;
import com.civicbridge.model.User;
import com.civicbridge.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userRepository.findAll()));
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> updateUserRole(@PathVariable Long id, @RequestParam Role role) {
        return userRepository.findById(id).map(user -> {
            user.getRoles().add(role);
            // Note: This logic adds a role. Use remove to revoke?
            // Plan said "Role Change".
            // Ideally we might want to set exactly the roles.
            // For now, let's just add it or if it exists, maybe toggle?
            // Simple requirement: "PATCH (Role Change) ROLE_ADMIN".
            // Let's assume setting the role set to just this one role or adding it.
            // A safer bet for "Role Change" usually usually means "Make this user an Admin"
            // or "Make them a User".
            // Let's clear and set for simplicity or add.
            // "Assign Roles... ROLE_ADMIN is assigned manually".
            // Let's assume toggle or add is redundant.
            // Let's just add for now, or replace?
            // Let's use Set.of(role) to replace?
            // existing code: user.setRoles(Set.of(userRole));

            // Let's implement ADDING a role.
            // If we want to replace, we can pass a list.
            // But let's stick to simple ADD.
            user.getRoles().add(role);

            User updated = userRepository.save(user);
            return ResponseEntity.ok(ApiResponse.success("User role updated", updated));
        }).orElse(ResponseEntity.notFound().build());
    }
}
