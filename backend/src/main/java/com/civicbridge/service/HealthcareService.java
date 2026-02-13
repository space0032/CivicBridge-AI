package com.civicbridge.service;

import com.civicbridge.model.HealthcareFacility;
import com.civicbridge.repository.jpa.HealthcareFacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import static com.civicbridge.repository.jpa.HealthcareFacilitySpecifications.*;

@Service
@RequiredArgsConstructor
public class HealthcareService {

    private final HealthcareFacilityRepository healthcareFacilityRepository;
    private final StatsService statsService;

    public List<HealthcareFacility> getAllFacilities() {
        return healthcareFacilityRepository.findByIsActiveTrue();
    }

    public List<HealthcareFacility> getFacilitiesWithCriteria(String type, Boolean freeServices) {
        Specification<HealthcareFacility> spec = Specification.where(isActive())
                .and(hasType(type))
                .and(hasFreeServices(freeServices));
        return healthcareFacilityRepository.findAll(spec);
    }

    public List<HealthcareFacility> getFacilitiesByType(String type) {
        return healthcareFacilityRepository.findByType(type);
    }

    public List<HealthcareFacility> getFreeFacilities() {
        return healthcareFacilityRepository.findByFreeServicesTrue();
    }

    public List<HealthcareFacility> getNearbyFacilities(Double latitude, Double longitude, Double radiusKm) {
        Double radiusMeters = radiusKm * 1000;
        return healthcareFacilityRepository.findNearbyFacilities(latitude, longitude, radiusMeters);
    }

    public HealthcareFacility getFacilityById(Long id) {
        return healthcareFacilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Healthcare facility not found with id: " + id));
    }

    public HealthcareFacility createFacility(HealthcareFacility facility) {
        sanitizeFacility(facility);
        HealthcareFacility savedFacility = healthcareFacilityRepository.save(facility);
        statsService.broadcastStats();
        return savedFacility;
    }

    private void sanitizeFacility(HealthcareFacility facility) {
        if (facility.getName() != null)
            facility.setName(facility.getName().trim());
        if (facility.getType() != null)
            facility.setType(facility.getType().trim().toUpperCase());
        if (facility.getServices() != null)
            facility.setServices(facility.getServices().trim());
        if (facility.getAddress() != null)
            facility.setAddress(facility.getAddress().trim());
        if (facility.getContactNumber() != null)
            facility.setContactNumber(facility.getContactNumber().trim());
    }
}
