package com.civicbridge.service;

import com.civicbridge.dto.VoiceQueryRequest;
import com.civicbridge.model.HealthcareFacility;
import com.civicbridge.model.Program;
import com.civicbridge.model.QueryHistory;
import com.civicbridge.repository.mongo.QueryHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AIService {
    
    private final QueryHistoryRepository queryHistoryRepository;
    private final ProgramService programService;
    private final HealthcareService healthcareService;
    
    public String processVoiceQuery(VoiceQueryRequest request) {
        // This is a simplified implementation
        // In production, integrate with OpenAI or Hugging Face API
        
        String query = request.getQueryText().toLowerCase();
        String response;
        
        if (query.contains("subsidy") || query.contains("subsidies") || query.contains("program")) {
            response = generateProgramResponse(request);
        } else if (query.contains("hospital") || query.contains("healthcare") || query.contains("vaccination")) {
            response = generateHealthcareResponse(request);
        } else if (query.contains("scholarship") || query.contains("education")) {
            response = generateEducationResponse(request);
        } else if (query.contains("job") || query.contains("training") || query.contains("skill")) {
            response = generateJobResponse(request);
        } else {
            response = "I can help you find government programs, healthcare facilities, scholarships, and job training opportunities. What would you like to know about?";
        }
        
        // Save query history
        saveQueryHistory(request, response);
        
        return response;
    }
    
    private String generateProgramResponse(VoiceQueryRequest request) {
        List<Program> programs = programService.getProgramsByFilters("AGRICULTURE", null);
        if (programs.isEmpty()) {
            return "I couldn't find any agricultural programs at the moment. Please check back later.";
        }
        return String.format("I found %d agricultural programs available. The top program is: %s", 
            programs.size(), programs.get(0).getName());
    }
    
    private String generateHealthcareResponse(VoiceQueryRequest request) {
        if (request.getLatitude() != null && request.getLongitude() != null) {
            List<HealthcareFacility> facilities = healthcareService.getNearbyFacilities(
                request.getLatitude(), request.getLongitude(), 10.0);
            if (!facilities.isEmpty()) {
                return String.format("I found %d healthcare facilities near you. The closest is: %s at %s", 
                    facilities.size(), facilities.get(0).getName(), facilities.get(0).getAddress());
            }
        }
        return "Please enable location services to find nearby healthcare facilities.";
    }
    
    private String generateEducationResponse(VoiceQueryRequest request) {
        List<Program> programs = programService.getProgramsByCategory("EDUCATION");
        if (programs.isEmpty()) {
            return "I couldn't find any education programs at the moment.";
        }
        return String.format("I found %d education programs. Check out: %s", 
            programs.size(), programs.get(0).getName());
    }
    
    private String generateJobResponse(VoiceQueryRequest request) {
        List<Program> programs = programService.getProgramsByCategory("EMPLOYMENT");
        if (programs.isEmpty()) {
            return "I couldn't find any job training programs at the moment.";
        }
        return String.format("I found %d employment programs. Featured program: %s", 
            programs.size(), programs.get(0).getName());
    }
    
    private void saveQueryHistory(VoiceQueryRequest request, String response) {
        QueryHistory history = new QueryHistory();
        history.setUserId(request.getUserId());
        history.setQueryText(request.getQueryText());
        history.setQueryType("VOICE");
        history.setLanguage(request.getLanguage());
        history.setResponse(response);
        history.setTimestamp(LocalDateTime.now());
        history.setLatitude(request.getLatitude());
        history.setLongitude(request.getLongitude());
        
        queryHistoryRepository.save(history);
    }
    
    public List<QueryHistory> getUserQueryHistory(Long userId) {
        return queryHistoryRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}
