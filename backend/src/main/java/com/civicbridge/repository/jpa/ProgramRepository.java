package com.civicbridge.repository.jpa;

import com.civicbridge.model.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    List<Program> findByCategory(String category);
    List<Program> findByRegion(String region);
    List<Program> findByCategoryAndRegion(String category, String region);
    List<Program> findByIsActiveTrue();
    
    @Query("SELECT p FROM Program p WHERE p.isActive = true AND " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:region IS NULL OR p.region = :region)")
    List<Program> findByFilters(@Param("category") String category, 
                                @Param("region") String region);
}
