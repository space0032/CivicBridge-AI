package com.civicbridge.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.civicbridge.repository.jpa")
@EnableMongoRepositories(basePackages = "com.civicbridge.repository.mongo")
public class DatabaseConfig {
}
