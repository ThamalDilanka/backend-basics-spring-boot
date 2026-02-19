package com.greenneighbors.plant_swap_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The person giving the feedback
    @ManyToOne
    @JoinColumn(name = "reviewer_id", nullable = false)
    private Member reviewer;

    // The person receiving the feedback
    @ManyToOne
    @JoinColumn(name = "reviewed_member_id", nullable = false)
    private Member reviewedMember;

    @Column(nullable = false)
    private int rating; // e.g., 1 to 5 stars

    @Column(length = 500)
    private String comments;

    @CreationTimestamp
    private LocalDateTime createdAt;
}