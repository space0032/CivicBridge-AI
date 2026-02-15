package com.civicbridge.controller;

import com.civicbridge.dto.ApiResponse;
import com.civicbridge.dto.ApplicationRequest;
import com.civicbridge.model.Application;
import com.civicbridge.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
@Slf4j
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Application>> submitApplication(
            @RequestBody ApplicationRequest applicationRequest) {
        try {
            Application application = applicationService.submitApplication(applicationRequest);
            return ResponseEntity.ok(ApiResponse.success("Application submitted successfully", application));
        } catch (Exception e) {
            log.error("Error submitting application: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Application>>> getMyApplications() {
        try {
            List<Application> applications = applicationService.getMyApplications();
            return ResponseEntity.ok(ApiResponse.success(applications));
        } catch (Exception e) {
            log.error("Error fetching applications: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
