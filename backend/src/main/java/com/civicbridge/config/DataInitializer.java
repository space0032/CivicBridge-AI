package com.civicbridge.config;

import com.civicbridge.model.User;
import com.civicbridge.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${spring.application.admin.username}")
    private String adminUsername;

    @Value("${spring.application.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        userRepository.findByUsername(adminUsername).ifPresentOrElse(
                user -> {
                    if (!user.getRoles().contains("ROLE_ADMIN")) {
                        user.getRoles().add("ROLE_ADMIN");
                        userRepository.save(user);
                    }
                },
                () -> {
                    User admin = new User();
                    admin.setUsername(adminUsername);
                    admin.setPassword(passwordEncoder.encode(adminPassword));
                    admin.setEmail("admin@civicbridge.com");
                    admin.setRoles(new HashSet<>(Collections.singletonList("ROLE_ADMIN")));
                    userRepository.save(admin);
                });
    }
}
