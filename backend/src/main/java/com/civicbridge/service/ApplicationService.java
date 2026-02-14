package com.civicbridge.service;

import com.civicbridge.dto.ApplicationRequest;
import com.civicbridge.model.Application;
import com.civicbridge.model.Program;
import com.civicbridge.model.User;
import com.civicbridge.repository.ApplicationRepository;
import com.civicbridge.repository.ProgramRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ProgramRepository programRepository;

    public ApplicationService(ApplicationRepository applicationRepository, ProgramRepository programRepository) {
        this.applicationRepository = applicationRepository;
        this.programRepository = programRepository;
    }

    public Application submitApplication(ApplicationRequest applicationRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Program program = programRepository.findById(applicationRequest.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found"));

        Application application = new Application();
        application.setUser(user);
        application.setProgram(program);
        application.setCreatedAt(LocalDateTime.now());
        application.setStatus(Application.ApplicationStatus.PENDING);

        return applicationRepository.save(application);
    }

    public List<Application> getMyApplications() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return applicationRepository.findByUserId(user.getId());
    }
}
