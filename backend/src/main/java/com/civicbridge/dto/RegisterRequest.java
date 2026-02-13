package com.civicbridge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String username;
    private String fullName;
    private String email;
    private String password;
    private String preferredLanguage;
    private Double latitude;
    private Double longitude;
    private String region;
}
