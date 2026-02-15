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
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import java.time.Duration;
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
            .retryOn(org.springframework.web.client.ResourceAccessException.class)
            .retryOn(org.springframework.web.client.HttpServerErrorException.class)
            .retryOn(java.net.SocketTimeoutException.class)
            .build();

    // Rate limiter: 10 requests per minute
    private final Bucket bucket = Bucket.builder()
            .addLimit(Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1))))
            .build();

    @Override
    public String processQuery(VoiceQueryRequest request) {
        if (!bucket.tryConsume(1)) {
            log.warn("Rate limit exceeded for Gemini API");
            throw new RuntimeException("Rate limit exceeded");
        }

        // 1. Fetch context data
        List<Program> programs = programRepository.findByIsActiveTrue();
        List<HealthcareFacility> facilities = healthcareFacilityRepository.findByIsActiveTrue();

        String context = buildContext(request.getQueryText(), programs, facilities);
        String prompt = createPrompt(request, context);

        // 2. Call Gemini API with Retry
        long start = System.currentTimeMillis();
        String response = callGeminiApi(prompt);
        log.info("Gemini API call completed in {} ms", System.currentTimeMillis() - start);
        return response;
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
        throw new RuntimeException("Gemini returned invalid response or no candidates");
    }

    private String buildContext(String query, List<Program> programs, List<HealthcareFacility> facilities) {
        String lowerQuery = query.toLowerCase();

        // Filter programs based on query keywords
        List<Program> relevantPrograms = programs.stream()
                .sorted((p1, p2) -> {
                    boolean p1Relevant = isRelevant(p1, lowerQuery);
                    boolean p2Relevant = isRelevant(p2, lowerQuery);
                    return Boolean.compare(p2Relevant, p1Relevant); // True (relevant) comes first
                })
                .collect(Collectors.toList());

        // Optimize context by limiting items and fields
        String programContext = relevantPrograms.stream()
                .limit(5) // Limit to 5 programs
                .map(p -> String.format("%s: %s", p.getName(), p.getDescription()))
                .collect(Collectors.joining("\n"));

        String facilityContext = facilities.stream()
                .limit(3) // Limit to 3 facilities to save tokens if not explicitly asked
                .map(f -> String.format("%s (%s) - %s", f.getName(), f.getType(), f.getAddress()))
                .collect(Collectors.joining("\n"));

        // Handle empty lists gracefully
        if (programContext.isEmpty())
            programContext = "No programs available.";
        if (facilityContext.isEmpty())
            facilityContext = "No facilities available.";

        return "Available Programs:\n" + programContext + "\n\nNearby Facilities:\n" + facilityContext;
    }

    private boolean isRelevant(Program program, String query) {
        if (program.getCategory() != null && query.contains(program.getCategory().toLowerCase())) {
            return true;
        }
        // Add more specific logic here, e.g., mapping "farm" to "Agriculture"
        if (query.contains("farm") || query.contains("crop") || query.contains("agri")) {
            return "Agriculture".equalsIgnoreCase(program.getCategory());
        }
        return false;
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

    @Override
    public boolean isEnabled() {
        return apiKey != null && !apiKey.isEmpty();
    }
}
