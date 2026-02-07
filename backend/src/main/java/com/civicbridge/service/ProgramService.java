package com.civicbridge.service;

import com.civicbridge.model.Program;
import com.civicbridge.repository.jpa.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgramService {
    
    private final ProgramRepository programRepository;
    
    public List<Program> getAllPrograms() {
        return programRepository.findByIsActiveTrue();
    }
    
    public List<Program> getProgramsByCategory(String category) {
        return programRepository.findByCategory(category);
    }
    
    public List<Program> getProgramsByRegion(String region) {
        return programRepository.findByRegion(region);
    }
    
    public List<Program> getProgramsByFilters(String category, String region) {
        return programRepository.findByFilters(category, region);
    }
    
    public Program getProgramById(Long id) {
        return programRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Program not found"));
    }
    
    public Program createProgram(Program program) {
        return programRepository.save(program);
    }
}
