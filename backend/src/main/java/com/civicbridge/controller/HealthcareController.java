package com.civicbridge.controller;

import com.civicbridge.dto.ApiResponse;
import com.civicbridge.model.HealthcareFacility;
import com.civicbridge.service.HealthcareService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/healthcare")
@RequiredArgsConstructor
public class HealthcareController {

    private final HealthcareService healthcareService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<HealthcareFacility>>> getAllFacilities(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean freeServices) {
        try {
            // Normalize empty strings to null
            String normalizedType = (type != null && !type.isEmpty()) ? type : null;
            // Normalize false to null (UI treats unchecked as "show all")
            Boolean normalizedFreeServices = (freeServices != null && freeServices) ? true : null;

            List<HealthcareFacility> facilities = healthcareService.getFacilitiesWithCriteria(normalizedType,
                    normalizedFreeServices);
            return ResponseEntity.ok(ApiResponse.success(facilities));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<HealthcareFacility>>> getNearbyFacilities(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10.0") Double radiusKm) {
        try {
            List<HealthcareFacility> facilities = healthcareService.getNearbyFacilities(
                    latitude, longitude, radiusKm);
            return ResponseEntity.ok(ApiResponse.success(facilities));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HealthcareFacility>> getFacilityById(@PathVariable Long id) {
        try {
            HealthcareFacility facility = healthcareService.getFacilityById(id);
            return ResponseEntity.ok(ApiResponse.success(facility));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HealthcareFacility>> createFacility(
            @Valid @RequestBody HealthcareFacility facility) {
        try {
            HealthcareFacility created = healthcareService.createFacility(facility);
            return ResponseEntity.ok(ApiResponse.success("Facility created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HealthcareFacility>> updateFacility(
            @PathVariable Long id, @Valid @RequestBody HealthcareFacility facility) {
        try {
            HealthcareFacility updated = healthcareService.updateFacility(id, facility);
            return ResponseEntity.ok(ApiResponse.success("Facility updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
