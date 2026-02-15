package com.civicbridge.service;

import com.civicbridge.dto.VoiceQueryRequest;
import com.civicbridge.model.QueryHistory;
import com.civicbridge.repository.mongo.QueryHistoryRepository;
import com.civicbridge.service.ai.AIProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIService {

    private final QueryHistoryRepository queryHistoryRepository;
    private final Map<String, AIProvider> aiProviders;

    @Value("${ai.provider:MockProvider}")
    private String activeProviderName;

    public String processQuery(VoiceQueryRequest request) {
        // 1. Try Primary Provider (configured via properties)
        AIProvider primaryProvider = aiProviders.values().stream()
                .filter(p -> p.getProviderName().equalsIgnoreCase(activeProviderName))
                .findFirst()
                .orElse(null);

        if (primaryProvider != null && primaryProvider.isEnabled()) {
            try {
                String response = primaryProvider.processQuery(request);
                saveQueryHistory(request, response, primaryProvider.getProviderName());
                return response;
            } catch (Exception e) {
                // Log and fall through to try other providers
                System.err.println("Primary provider " + activeProviderName + " failed: " + e.getMessage());
            }
        }

        // 2. Failover: Try other enabled providers
        for (AIProvider provider : aiProviders.values()) {
            // Skip the primary one we just tried (or if it was null)
            if (primaryProvider != null && provider.getProviderName().equals(primaryProvider.getProviderName())) {
                continue;
            }

            if (provider.isEnabled()) {
                try {
                    String response = provider.processQuery(request);
                    saveQueryHistory(request, response, provider.getProviderName());
                    return response;
                } catch (Exception e) {
                    System.err.println(
                            "Provider " + provider.getProviderName() + " failed during failover: " + e.getMessage());
                    // Continue to next provider
                }
            }
        }

        throw new RuntimeException("All AI Providers failed. Please try again later.");
    }

    public String processVoiceQuery(VoiceQueryRequest request) {
        return processQuery(request);
    }

    private void saveQueryHistory(VoiceQueryRequest request, String response, String providerName) {
        QueryHistory history = new QueryHistory();
        history.setUserId(request.getUserId());
        history.setQueryText(request.getQueryText());
        history.setQueryType("VOICE");
        history.setLanguage(request.getLanguage());
        history.setResponse(response);
        history.setTimestamp(LocalDateTime.now());
        history.setLatitude(request.getLatitude());
        history.setLongitude(request.getLongitude());
        // ideally we would add provider info to history if schema supported it

        queryHistoryRepository.save(history);
    }

    public List<QueryHistory> getUserQueryHistory(Long userId) {
        return queryHistoryRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}
