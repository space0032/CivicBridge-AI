package com.civicbridge.repository.jpa;

import com.civicbridge.model.HealthcareFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HealthcareFacilityRepository extends JpaRepository<HealthcareFacility, Long> {
    List<HealthcareFacility> findByType(String type);
    List<HealthcareFacility> findByFreeServicesTrue();
    List<HealthcareFacility> findByIsActiveTrue();
    
    @Query(value = "SELECT * FROM healthcare_facilities " +
           "WHERE is_active = true AND " +
           "earth_distance(ll_to_earth(:lat, :lon), ll_to_earth(latitude, longitude)) < :radiusMeters " +
           "ORDER BY earth_distance(ll_to_earth(:lat, :lon), ll_to_earth(latitude, longitude))",
           nativeQuery = true)
    List<HealthcareFacility> findNearbyFacilities(@Param("lat") Double latitude,
                                                  @Param("lon") Double longitude,
                                                  @Param("radiusMeters") Double radiusMeters);
}
