package com.civicbridge.controller;

import com.civicbridge.security.JwtTokenProvider;
import com.civicbridge.service.ApplicationService;
import com.civicbridge.service.AuthService;
import com.civicbridge.service.ProgramService;
import com.civicbridge.repository.jpa.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({ ProgramController.class, ApplicationController.class, UserController.class })
@Import(ControllerAccessTest.TestSecurityConfig.class)
public class ControllerAccessTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProgramService programService;

    @MockBean
    private ApplicationService applicationService;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private UserRepository userRepository;

    @TestConfiguration
    @EnableWebSecurity
    @EnableMethodSecurity
    static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http
                    .csrf(csrf -> csrf.disable())
                    .authorizeHttpRequests(auth -> auth
                            .anyRequest().permitAll()); // Let @PreAuthorize handle access
            return http.build();
        }
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testCreateProgram_AsUser_ShouldForbidden() throws Exception {
        mockMvc.perform(post("/programs")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"New Program\", \"category\":\"HEALTHCARE\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testCreateProgram_AsAdmin_ShouldSucceed() throws Exception {
        mockMvc.perform(post("/programs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"name\":\"New Program\", \"description\":\"Desc\", \"category\":\"HEALTHCARE\", \"region\":\"Delhi\", \"eligibilityCriteria\":\"All\"}"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testSubmitApplication_AsUser_ShouldSucceed() throws Exception {
        mockMvc.perform(post("/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"programId\":1, \"applicantName\":\"Test User\"}"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "GUEST")
    public void testSubmitApplication_AsGuest_ShouldForbidden() throws Exception {
        mockMvc.perform(post("/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"programId\":1}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testGetUsers_AsUser_ShouldForbidden() throws Exception {
        mockMvc.perform(get("/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testGetUsers_AsAdmin_ShouldSucceed() throws Exception {
        mockMvc.perform(get("/users"))
                .andExpect(status().isOk());
    }
}
