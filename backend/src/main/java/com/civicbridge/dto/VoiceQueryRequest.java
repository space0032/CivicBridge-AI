package com.civicbridge.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoiceQueryRequest {
    @NotBlank(message = "Query text cannot be empty")
    private String queryText;

    @NotBlank(message = "Language code is required")
    private String language;

    private Double latitude;
    private Double longitude;

    @NotNull(message = "User ID is required")
    private Long userId;
}
