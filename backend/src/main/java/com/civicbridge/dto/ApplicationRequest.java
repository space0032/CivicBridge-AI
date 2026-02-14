package com.civicbridge.dto;

import lombok.Data;

@Data
public class ApplicationRequest {
    private Long programId;
    private String name;
    private String email;
}
