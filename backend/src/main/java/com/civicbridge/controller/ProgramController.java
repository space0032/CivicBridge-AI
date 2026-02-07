package com.civicbridge.controller;

import com.civicbridge.dto.ApiResponse;
import com.civicbridge.model.Program;
import com.civicbridge.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/programs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProgramController {
    
    private final ProgramService programService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Program>>> getAllPrograms(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String region) {
        try {
            List<Program> programs;
            if (category != null || region != null) {
                programs = programService.getProgramsByFilters(category, region);
            } else {
                programs = programService.getAllPrograms();
            }
            return ResponseEntity.ok(ApiResponse.success(programs));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Program>> getProgramById(@PathVariable Long id) {
        try {
            Program program = programService.getProgramById(id);
            return ResponseEntity.ok(ApiResponse.success(program));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Program>> createProgram(@RequestBody Program program) {
        try {
            Program created = programService.createProgram(program);
            return ResponseEntity.ok(ApiResponse.success("Program created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
}
