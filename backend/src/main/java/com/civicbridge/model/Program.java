package com.civicbridge.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "programs")
@Data
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private String description;
    private String region;
    private String eligibilityCriteria;
    private String applicationDeadline;
    private String benefits;
    private String applicationProcess;
    private String contactInfo;
}
