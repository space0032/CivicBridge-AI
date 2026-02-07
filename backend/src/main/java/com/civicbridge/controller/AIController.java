package com.civicbridge.controller;

import com.civicbridge.dto.ApiResponse;
import com.civicbridge.dto.VoiceQueryRequest;
import com.civicbridge.model.QueryHistory;
import com.civicbridge.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/voice-query")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIController {
    
    private final AIService aiService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<String>> processVoiceQuery(@RequestBody VoiceQueryRequest request) {
        try {
            String response = aiService.processVoiceQuery(request);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/history/{userId}")
    public ResponseEntity<ApiResponse<List<QueryHistory>>> getQueryHistory(@PathVariable Long userId) {
        try {
            List<QueryHistory> history = aiService.getUserQueryHistory(userId);
            return ResponseEntity.ok(ApiResponse.success(history));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
}
