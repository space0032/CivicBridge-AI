package com.civicbridge.service;

import com.civicbridge.dto.ApplicationRequest;
import com.civicbridge.model.Application;
import com.civicbridge.model.Program;
import com.civicbridge.model.User;
import com.civicbridge.repository.jpa.ApplicationRepository;
import com.civicbridge.repository.jpa.ProgramRepository;
import com.civicbridge.repository.jpa.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

        private final ApplicationRepository applicationRepository;
        private final ProgramRepository programRepository;
        private final UserRepository userRepository;

        public ApplicationService(ApplicationRepository applicationRepository,
                        ProgramRepository programRepository,
                        UserRepository userRepository) {
                this.applicationRepository = applicationRepository;
                this.programRepository = programRepository;
                this.userRepository = userRepository;
        }

        public Application submitApplication(ApplicationRequest applicationRequest) {
                String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                                .getUsername();

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

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
                String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                                .getUsername();

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

                return applicationRepository.findByUser_Id(user.getId());
        }
}
