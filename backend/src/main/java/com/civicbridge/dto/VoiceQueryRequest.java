package com.civicbridge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoiceQueryRequest {
    private String queryText;
    private String language;
    private Double latitude;
    private Double longitude;
    private Long userId;
}
