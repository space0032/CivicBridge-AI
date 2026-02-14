package com.civicbridge.controller;

import com.civicbridge.dto.ApplicationRequest;
import com.civicbridge.model.Application;
import com.civicbridge.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<Application> submitApplication(@RequestBody ApplicationRequest applicationRequest) {
        return ResponseEntity.ok(applicationService.submitApplication(applicationRequest));
    }

    @GetMapping
    public ResponseEntity<List<Application>> getMyApplications() {
        return ResponseEntity.ok(applicationService.getMyApplications());
    }
}
