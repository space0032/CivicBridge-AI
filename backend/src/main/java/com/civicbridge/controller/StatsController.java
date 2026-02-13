package com.civicbridge.controller;

import com.civicbridge.dto.DashboardStatsDTO;
import com.civicbridge.repository.jpa.HealthcareFacilityRepository;
import com.civicbridge.repository.jpa.ProgramRepository;
import com.civicbridge.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
@Slf4j
public class StatsController {

    private final UserRepository userRepository;
    private final ProgramRepository programRepository;
    private final HealthcareFacilityRepository healthcareFacilityRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStats() {
        log.info("Fetching dashboard stats...");
        try {
            DashboardStatsDTO stats = DashboardStatsDTO.builder()
                    .totalUsers(userRepository.count())
                    .totalPrograms(programRepository.count())
                    .totalHealthcareFacilities(healthcareFacilityRepository.count())
                    .build();
            log.info("Stats fetched successfully: {}", stats);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching dashboard stats", e);
            return ResponseEntity.status(500).body("Error fetching statistics: " + e.getMessage());
        }
    }
}
