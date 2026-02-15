package com.civicbridge.service;

import com.civicbridge.dto.VoiceQueryRequest;
import com.civicbridge.model.QueryHistory;
import com.civicbridge.repository.mongo.QueryHistoryRepository;
import com.civicbridge.service.ai.AIProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AIServiceTest {

    @Mock
    private QueryHistoryRepository queryHistoryRepository;

    @Mock
    private AIProvider geminiProvider;

    @Mock
    private AIProvider openAIProvider;

    @Mock
    private AIProvider mockProvider;

    @InjectMocks
    private AIService aiService;

    private Map<String, AIProvider> aiProviders;

    @BeforeEach
    void setUp() {
        aiProviders = new HashMap<>();
        aiProviders.put("gemini", geminiProvider);
        aiProviders.put("openai", openAIProvider);
        aiProviders.put("mock", mockProvider);

        ReflectionTestUtils.setField(aiService, "aiProviders", aiProviders);
        ReflectionTestUtils.setField(aiService, "activeProviderName", "Gemini"); // Default primary
    }

    @Test
    void testProcessQuery_PrimaryFailoverToMock() {
        // Setup Primary Provider (Gemini) - Fails
        when(geminiProvider.getProviderName()).thenReturn("Gemini");
        when(geminiProvider.isEnabled()).thenReturn(true);
        when(geminiProvider.processQuery(any())).thenThrow(new RuntimeException("Gemini Failed"));

        // Setup Secondary Provider (OpenAI) - Disabled
        when(openAIProvider.getProviderName()).thenReturn("OpenAI");
        // Assume OpenAI is not configured/enabled
        // Wait, the logic iterates values(). Order is not guaranteed in HashMap.
        // But let's assume OpenAI is also mocked to fail or be disabled if checked.
        // Let's make OpenAI enabled but also fail to test multi-level failover.
        when(openAIProvider.isEnabled()).thenReturn(true);
        when(openAIProvider.processQuery(any())).thenThrow(new RuntimeException("OpenAI Failed"));

        // Setup Fallback Provider (Mock) - Succeeds
        when(mockProvider.getProviderName()).thenReturn("MockProvider");
        when(mockProvider.isEnabled()).thenReturn(true);
        when(mockProvider.processQuery(any())).thenReturn("Mock Response");

        VoiceQueryRequest request = new VoiceQueryRequest();
        request.setQueryText("Test Query");
        request.setUserId(1L);

        // Execute
        String result = aiService.processQuery(request);

        // Verify
        assertEquals("Mock Response", result);

        // Verify interactions - ensure Gemini was called
        verify(geminiProvider).processQuery(any());
        // Verify OpenAI was called (since enabled)
        verify(openAIProvider).processQuery(any());
        // Verify Mock was called
        verify(mockProvider).processQuery(any());

        // Verify history saved
        verify(queryHistoryRepository).save(any(QueryHistory.class));
    }
}
