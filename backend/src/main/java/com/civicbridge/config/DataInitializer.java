package com.civicbridge.config;

import com.civicbridge.model.User;
import com.civicbridge.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
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

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@civicbridge.com");
            admin.setRoles(new HashSet<>(Collections.singletonList("ROLE_ADMIN")));

            userRepository.save(admin);
            System.out.println("Default admin user created: admin / admin123");
        }
    }
}
