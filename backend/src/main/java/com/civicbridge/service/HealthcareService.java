package com.civicbridge.service;

import com.civicbridge.model.HealthcareFacility;
import com.civicbridge.repository.jpa.HealthcareFacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthcareService {
    
    private final HealthcareFacilityRepository healthcareFacilityRepository;
    
    public List<HealthcareFacility> getAllFacilities() {
        return healthcareFacilityRepository.findByIsActiveTrue();
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
    
    public HealthcareFacility createFacility(HealthcareFacility facility) {
        return healthcareFacilityRepository.save(facility);
    }
}
