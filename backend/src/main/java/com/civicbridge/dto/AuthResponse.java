package com.civicbridge.dto;

import com.civicbridge.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private User user;

    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }
}
