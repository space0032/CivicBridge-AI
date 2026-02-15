package com.civicbridge.service.ai;

import com.civicbridge.dto.VoiceQueryRequest;
import com.civicbridge.model.Program;
import com.civicbridge.model.HealthcareFacility;
import com.civicbridge.repository.jpa.ProgramRepository;
import com.civicbridge.repository.jpa.HealthcareFacilityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GeminiAIProviderTest {

    @Mock
    private ProgramRepository programRepository;

    @Mock
    private HealthcareFacilityRepository healthcareFacilityRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private GeminiAIProvider geminiAIProvider;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(geminiAIProvider, "apiKey", "test-api-key");
        // Inject the mocked RestTemplate into the GeminiAIProvider since it's
        // instantiated in the constructor/field
        ReflectionTestUtils.setField(geminiAIProvider, "restTemplate", restTemplate);
    }

    @Test
    void testProcessQuery_Success() {
        // Mock Data
        VoiceQueryRequest request = new VoiceQueryRequest();
        request.setQueryText("Help with farming");

        Program program = new Program();
        program.setName("Farm Aid");
        program.setDescription("Assistance");
        program.setCategory("Agriculture");

        HealthcareFacility facility = new HealthcareFacility();
        facility.setName("City Hospital");
        facility.setType("Hospital");
        facility.setAddress("123 Main St");

        when(programRepository.findByIsActiveTrue()).thenReturn(Collections.singletonList(program));
        when(healthcareFacilityRepository.findByIsActiveTrue()).thenReturn(Collections.singletonList(facility));

        // Mock API Response
        Map<String, Object> candidate = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", "Here is some help with farming.");
        content.put("parts", Collections.singletonList(part));
        candidate.put("content", content);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("candidates", Collections.singletonList(candidate));

        ResponseEntity<Map<String, Object>> responseEntity = ResponseEntity.ok(responseBody);

        when(restTemplate.exchange(
                any(String.class),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                (ParameterizedTypeReference<Map<String, Object>>) any(ParameterizedTypeReference.class)))
                .thenReturn(responseEntity);

        // Execute
        String result = geminiAIProvider.processQuery(request);

        // Verify
        assertEquals("Here is some help with farming.", result);
    }

    @Test
    void testProcessQuery_ApiError_ThrowsException() {
        VoiceQueryRequest request = new VoiceQueryRequest();
        request.setQueryText("Test");

        when(programRepository.findByIsActiveTrue()).thenReturn(Collections.emptyList());
        when(healthcareFacilityRepository.findByIsActiveTrue()).thenReturn(Collections.emptyList());

        when(restTemplate.exchange(
                any(String.class),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                (ParameterizedTypeReference<Map<String, Object>>) any(ParameterizedTypeReference.class)))
                .thenThrow(new RuntimeException("API Failure"));

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class, () -> {
            geminiAIProvider.processQuery(request);
        });
    }

    @Test
    void testProcessQuery_InvalidResponse_ThrowsException() {
        VoiceQueryRequest request = new VoiceQueryRequest();
        request.setQueryText("Test");

        when(programRepository.findByIsActiveTrue()).thenReturn(Collections.emptyList());
        when(healthcareFacilityRepository.findByIsActiveTrue()).thenReturn(Collections.emptyList());

        Map<String, Object> responseBody = new HashMap<>(); // No candidates
        ResponseEntity<Map<String, Object>> responseEntity = ResponseEntity.ok(responseBody);

        when(restTemplate.exchange(
                any(String.class),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                (ParameterizedTypeReference<Map<String, Object>>) any(ParameterizedTypeReference.class)))
                .thenReturn(responseEntity);

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class, () -> {
            geminiAIProvider.processQuery(request);
        });
    }

    @Test
    void testProcessQuery_ApiRejection_ThrowsException() {
        VoiceQueryRequest request = new VoiceQueryRequest();
        request.setQueryText("API Rejection Test");

        when(programRepository.findByIsActiveTrue()).thenReturn(Collections.emptyList());
        when(healthcareFacilityRepository.findByIsActiveTrue()).thenReturn(Collections.emptyList());

        // Simulate a 429 Too Many Requests or similar error
        when(restTemplate.exchange(
                any(String.class),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                (ParameterizedTypeReference<Map<String, Object>>) any(ParameterizedTypeReference.class)))
                .thenThrow(new org.springframework.web.client.HttpClientErrorException(
                        org.springframework.http.HttpStatus.TOO_MANY_REQUESTS));

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class, () -> {
            geminiAIProvider.processQuery(request);
        });
    }
}
