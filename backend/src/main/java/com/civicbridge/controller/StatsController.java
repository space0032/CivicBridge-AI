package com.civicbridge.controller;

import com.civicbridge.dto.DashboardStatsDTO;
import com.civicbridge.repository.jpa.HealthcareFacilityRepository;
import com.civicbridge.repository.jpa.ProgramRepository;
import com.civicbridge.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final UserRepository userRepository;
    private final ProgramRepository programRepository;
    private final HealthcareFacilityRepository healthcareFacilityRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        DashboardStatsDTO stats = DashboardStatsDTO.builder()
                .totalUsers(userRepository.count())
                .totalPrograms(programRepository.count())
                .totalHealthcareFacilities(healthcareFacilityRepository.count())
                .build();
        return ResponseEntity.ok(stats);
    }
}
