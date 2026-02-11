package com.civicbridge.service.ai;

import com.civicbridge.dto.VoiceQueryRequest;
import com.civicbridge.model.HealthcareFacility;
import com.civicbridge.model.Program;
import com.civicbridge.service.HealthcareService;
import com.civicbridge.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MockAIProvider implements AIProvider {

    private final ProgramService programService;
    private final HealthcareService healthcareService;

    @Override
    public String processQuery(VoiceQueryRequest request) {
        String query = request.getQueryText().toLowerCase();

        if (query.contains("subsidy") || query.contains("subsidies") || query.contains("program")) {
            return generateProgramResponse(request);
        } else if (query.contains("hospital") || query.contains("healthcare") || query.contains("vaccination")) {
            return generateHealthcareResponse(request);
        } else if (query.contains("scholarship") || query.contains("education")) {
            return generateEducationResponse(request);
        } else if (query.contains("job") || query.contains("training") || query.contains("skill")) {
            return generateJobResponse(request);
        } else {
            return "I can help you find government programs, healthcare facilities, scholarships, and job training opportunities. What would you like to know about?";
        }
    }

    @Override
    public String getProviderName() {
        return "MockProvider";
    }

    private String generateProgramResponse(VoiceQueryRequest request) {
        // Safe navigation for programs
        try {
            List<Program> programs = programService.getProgramsByFilters("AGRICULTURE", null);
            if (programs == null || programs.isEmpty()) {
                return "I couldn't find any agricultural programs at the moment. Please check back later.";
            }
            return String.format("I found %d agricultural programs available. The top program is: %s",
                    programs.size(), programs.get(0).getName());
        } catch (Exception e) {
            return "I'm having trouble accessing the program database right now.";
        }
    }

    private String generateHealthcareResponse(VoiceQueryRequest request) {
        if (request.getLatitude() != null && request.getLongitude() != null) {
            try {
                List<HealthcareFacility> facilities = healthcareService.getNearbyFacilities(
                        request.getLatitude(), request.getLongitude(), 10.0);
                if (facilities != null && !facilities.isEmpty()) {
                    return String.format("I found %d healthcare facilities near you. The closest is: %s at %s",
                            facilities.size(), facilities.get(0).getName(), facilities.get(0).getAddress());
                }
            } catch (Exception e) {
                return "I'm having trouble accessing the healthcare database right now.";
            }
        }
        return "Please enable location services to find nearby healthcare facilities.";
    }

    private String generateEducationResponse(VoiceQueryRequest request) {
        try {
            List<Program> programs = programService.getProgramsByCategory("EDUCATION");
            if (programs == null || programs.isEmpty()) {
                return "I couldn't find any education programs at the moment.";
            }
            return String.format("I found %d education programs. Check out: %s",
                    programs.size(), programs.get(0).getName());
        } catch (Exception e) {
            return "I'm having trouble accessing educational programs right now.";
        }
    }

    private String generateJobResponse(VoiceQueryRequest request) {
        try {
            List<Program> programs = programService.getProgramsByCategory("EMPLOYMENT");
            if (programs == null || programs.isEmpty()) {
                return "I couldn't find any job training programs at the moment.";
            }
            return String.format("I found %d employment programs. Featured program: %s",
                    programs.size(), programs.get(0).getName());
        } catch (Exception e) {
            return "I'm having trouble accessing job programs right now.";
        }
    }
}
