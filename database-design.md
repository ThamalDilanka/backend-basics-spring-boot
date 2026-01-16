# Plant Swap API - Database Design

This document outlines the database schema for the Neighborhood Plant Exchange System.

## Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    MEMBER ||--o{ PLANT : "owns"
    MEMBER ||--o{ EXCHANGE_REQUEST : "initiates"
    MEMBER ||--o{ FEEDBACK : "writes"
    
    CATEGORY ||--o{ PLANT : "classifies"
    
    PLANT ||--o{ EXCHANGE_REQUEST : "receives"
    
    EXCHANGE_REQUEST ||--o| FEEDBACK : "has"

    MEMBER {
        bigint id PK
        string username
        string email
        string password
        string city
        string state
        timestamp created_at
        timestamp updated_at
    }

    PLANT {
        bigint id PK
        string name
        string description
        string image_url
        enum care_difficulty "EASY, MEDIUM, HARD"
        boolean is_available
        bigint owner_id FK
        bigint category_id FK
        timestamp created_at
        timestamp updated_at
    }

    CATEGORY {
        bigint id PK
        string name
    }

    EXCHANGE_REQUEST {
        bigint id PK
        string message
        enum status "PENDING, ACCEPTED, REJECTED, COMPLETED"
        bigint requester_id FK
        bigint plant_id FK
        timestamp created_at
        timestamp updated_at
    }

    FEEDBACK {
        bigint id PK
        int rating
        string comment
        bigint exchange_request_id FK
        bigint reviewer_id FK
        timestamp created_at
    }