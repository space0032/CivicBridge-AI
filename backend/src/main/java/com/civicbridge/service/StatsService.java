package com.civicbridge.service;

import com.civicbridge.dto.DashboardStatsDTO;
import com.civicbridge.repository.jpa.HealthcareFacilityRepository;
import com.civicbridge.repository.jpa.ProgramRepository;
import com.civicbridge.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatsService {

    private final UserRepository userRepository;
    private final ProgramRepository programRepository;
    private final HealthcareFacilityRepository healthcareFacilityRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastStats() {
        DashboardStatsDTO stats = DashboardStatsDTO.builder()
                .totalUsers(userRepository.count())
                .totalPrograms(programRepository.count())
                .totalHealthcareFacilities(healthcareFacilityRepository.count())
                .build();

        log.info("Broadcasting stats: {}", stats);
        messagingTemplate.convertAndSend("/topic/stats", stats);
    }
}
