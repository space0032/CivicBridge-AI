package com.civicbridge.service.ai;

import com.civicbridge.dto.VoiceQueryRequest;
import com.civicbridge.model.Program;
import com.civicbridge.model.HealthcareFacility;
import com.civicbridge.repository.jpa.ProgramRepository;
import com.civicbridge.repository.jpa.HealthcareFacilityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.retry.support.RetryTemplate;

@Service("geminiProvider")
@RequiredArgsConstructor
@Slf4j
public class GeminiAIProvider implements AIProvider {

    @Value("${ai.gemini.api-key}")
    private String apiKey;

    private final ProgramRepository programRepository;
    private final HealthcareFacilityRepository healthcareFacilityRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=";

    private final RetryTemplate retryTemplate = RetryTemplate.builder()
            .maxAttempts(3)
            .fixedBackoff(2000)
            .retryOn(Exception.class)
            .build();

    @Override
    public String processQuery(VoiceQueryRequest request) {
        try {
            // 1. Fetch context data
            List<Program> programs = programRepository.findByIsActiveTrue();
            List<HealthcareFacility> facilities = healthcareFacilityRepository.findByIsActiveTrue();

            String context = buildContext(programs, facilities);
            String prompt = createPrompt(request, context);

            // 2. Call Gemini API with Retry
            long start = System.currentTimeMillis();
            String response = callGeminiApi(prompt);
            log.info("Gemini API call completed in {} ms", System.currentTimeMillis() - start);
            return response;

        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
        }
    }

    private String callGeminiApi(String prompt) {
        return retryTemplate.execute(context -> {
            String url = GEMINI_URL + apiKey;

            Map<String, Object> content = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", new Object[] { part });

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", new Object[] { content });

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(url, HttpMethod.POST, entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {
                    });

            return parseResponse(response);
        });
    }

    private String parseResponse(ResponseEntity<Map<String, Object>> response) {
        if (response.getBody() != null && response.getBody().containsKey("candidates")) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> candidate = candidates.get(0);
                @SuppressWarnings("unchecked")
                Map<String, Object> contentMap = (Map<String, Object>) candidate.get("content");

                if (contentMap != null && contentMap.containsKey("parts")) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> partsList = (List<Map<String, Object>>) contentMap.get("parts");
                    if (partsList != null && !partsList.isEmpty()) {
                        return (String) partsList.get(0).get("text");
                    }
                }
            }
        }
        return "I couldn't generate a response.";
    }

    private String buildContext(List<Program> programs, List<HealthcareFacility> facilities) {
        // Optimize context by limiting items and fields
        String programContext = programs.stream()
                .limit(5) // Limit to 5 programs
                .map(p -> String.format("%s: %s", p.getName(), p.getDescription()))
                .collect(Collectors.joining("\n"));

        String facilityContext = facilities.stream()
                .limit(5) // Limit to 5 facilities
                .map(f -> String.format("%s (%s) - %s", f.getName(), f.getType(), f.getAddress()))
                .collect(Collectors.joining("\n"));

        // Handle empty lists gracefully
        if (programContext.isEmpty())
            programContext = "No programs available.";
        if (facilityContext.isEmpty())
            facilityContext = "No facilities available.";

        return "Available Programs:\n" + programContext + "\n\nNearby Facilities:\n" + facilityContext;
    }

    private String createPrompt(VoiceQueryRequest request, String context) {
        return "You are a helpful assistant for CivicBridge AI. " +
                "User Query: \"" + request.getQueryText() + "\"\n" +
                "Context Information:\n" + context + "\n" +
                "Please answer the query based on the context provided. Keep the answer concise and helpful for a rural user.";
    }

    @Override
    public String getProviderName() {
        return "Gemini";
    }
}
