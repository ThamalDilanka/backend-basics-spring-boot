package com.greenneighbors.plant_swap_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "plants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    private PlantStatus status = PlantStatus.AVAILABLE;

    // Relationships

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member; // The owner

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Enum for Status
    public enum PlantStatus {
        AVAILABLE,
        PENDING_EXCHANGE,
        SWAPPED
    }

    @Enumerated(EnumType.STRING)
    private CareDifficulty careDifficulty;
    public enum CareDifficulty {
        EASY, MEDIUM, HARD
    }
}