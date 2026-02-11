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
        AIProvider provider = aiProviders.values().stream()
                .filter(p -> p.getProviderName().equalsIgnoreCase(activeProviderName))
                .findFirst()
                .orElse(aiProviders.values().stream()
                        .filter(p -> p.getProviderName().equals("MockProvider"))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("No AI Provider available")));

        String response = provider.processQuery(request);

        // Save query history
        saveQueryHistory(request, response, provider.getProviderName());

        return response;
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
