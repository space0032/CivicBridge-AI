package com.civicbridge.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "query_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueryHistory {
    
    @Id
    private String id;
    
    private Long userId;
    
    private String queryText;
    
    private String queryType; // VOICE, TEXT
    
    private String language;
    
    private String response;
    
    private LocalDateTime timestamp;
    
    private Double latitude;
    
    private Double longitude;
}
