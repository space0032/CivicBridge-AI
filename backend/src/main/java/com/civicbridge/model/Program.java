package com.civicbridge.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "programs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Program name is required")
    @Size(max = 255)
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Description is required")
    @Size(max = 2000)
    @Column(length = 2000)
    private String description;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category; // HEALTHCARE, EDUCATION, AGRICULTURE, EMPLOYMENT

    private String eligibilityCriteria;

    private String applicationDeadline;

    private String contactInfo;

    private String region;

    private Double latitude;

    private Double longitude;

    private String language;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
