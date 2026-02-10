package com.greenneighbors.plant_swap_api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    @Autowired
    private DataSource dataSource; // Access to the raw database connection

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        Map<String, Object> database = new HashMap<>();

        boolean isDbConnected = false;
        String dbError = null;

        // Check Database Connection
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(1)) { // Timeout 1 second
                isDbConnected = true;
            }
        } catch (Exception e) {
            isDbConnected = false;
            dbError = e.getMessage();
        }

        // Build the "database" section
        database.put("status", isDbConnected ? "UP" : "DOWN");
        database.put("type", "PostgreSQL");
        database.put("connected", isDbConnected);
        if (dbError != null) {
            database.put("error", dbError);
        }

        // Build the "data" section
        data.put("status", isDbConnected ? "UP" : "DOWN"); // App status depends on DB
        data.put("application", "plant-swap-api");
        data.put("database", database);
        data.put("timestamp", Instant.now().toString());

        // Build the final response
        response.put("success", true);
        response.put("message", "Service health check");
        response.put("data", data);
        response.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(response);
    }
}