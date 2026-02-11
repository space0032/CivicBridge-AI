package com.civicbridge.service.ai;

import com.civicbridge.dto.VoiceQueryRequest;

public interface AIProvider {
    String processQuery(VoiceQueryRequest request);

    String getProviderName();
}
