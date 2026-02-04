# 🌿 Community Plant Swap Platform

## Assignment: Building a REST API for a Neighborhood Plant Exchange System

Welcome to your Spring Boot learning journey! In this assignment, you will build a backend REST API for a community platform where neighbors can list plants they want to give away, request plants from others, and track their plant exchange history.

---

## 🎯 Learning Objectives

By completing this assignment, you will demonstrate understanding of:

- Object-Oriented Programming principles (Encapsulation, Inheritance, Polymorphism, Abstraction)
- Spring Boot fundamentals (Dependency Injection, Beans, Application Context)
- RESTful API design and best practices
- Relational database design with PostgreSQL and JPA/Hibernate
- Git version control workflow with Conventional Commits

---

## 📖 The Scenario

The "Green Neighbors" community wants a digital platform to facilitate plant exchanges. Members can:

1. Register and manage their profile
2. List plants they want to give away (with details like plant type, care difficulty, size)
3. Browse available plants in their neighborhood
4. Request a plant from another member
5. Track the status of their exchanges (pending, accepted, completed, cancelled)
6. Leave feedback after a successful exchange

---

## 🏗️ Project Structure

You will build this project incrementally through a series of tasks. Each task builds upon the previous one.

**Required Project Directory Structure:**
```
plant-swap-api/
├── src/
│   └── main/
│       ├── java/
│       └── resources/
├── docs/
│   └── postman/
│       └── plant-swap-api.postman_collection.json
├── README.md
└── pom.xml (or build.gradle)
```

---

## ⚠️ Mandatory Requirements

Before starting the tasks, understand these requirements that apply throughout the entire project:

### 1. Database: PostgreSQL

You **must** use PostgreSQL as your database. No H2 or other in-memory databases.

**Setup requirements:**
- Install PostgreSQL locally or use Docker
- Create a database named `plant_swap_db`
- Configure connection in `application.properties` or `application.yml`
- Use environment variables for sensitive credentials (never commit passwords)

### 2. Git: Conventional Commits

All commits **must** follow the Conventional Commits specification (conventionalcommits.org).

**Format:** `<type>(<scope>): <description>`

**Types to use:**
| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code refactoring without feature changes |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks, dependencies, configs |

**Examples:**
```
feat(member): add member registration endpoint
fix(plant): resolve null pointer in plant search
docs(readme): update API documentation
refactor(service): extract validation logic to separate class
chore(deps): upgrade spring boot to 3.2.0
```

### 3. API Response Envelope

All API responses **must** be wrapped in a standard envelope structure.

**Success Response:**
```json
{
  "success": true,
  "message": "Plant retrieved successfully",
  "data": {
    "id": 1,
    "name": "Monstera Deliciosa",
    "category": "TROPICAL"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Success Response (List):**
```json
{
  "success": true,
  "message": "Plants retrieved successfully",
  "data": [
    { "id": 1, "name": "Monstera" },
    { "id": 2, "name": "Snake Plant" }
  ],
  "meta": {
    "totalItems": 2,
    "currentPage": 1,
    "totalPages": 1
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Plant not found",
  "errorCode": "PLANT_NOT_FOUND",
  "errors": null,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Validation Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    { "field": "name", "message": "Plant name cannot be empty" },
    { "field": "email", "message": "Invalid email format" }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 4. Health Endpoint

You **must** implement a health check endpoint that reports application and database status.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "message": "Service health check",
  "data": {
    "status": "UP",
    "application": "plant-swap-api",
    "database": {
      "status": "UP",
      "type": "PostgreSQL",
      "connected": true
    },
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**When database is down:**
```json
{
  "success": true,
  "message": "Service health check",
  "data": {
    "status": "DOWN",
    "application": "plant-swap-api",
    "database": {
      "status": "DOWN",
      "type": "PostgreSQL",
      "connected": false,
      "error": "Connection refused"
    },
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 5. Postman Collection

You **must** create and commit a Postman collection file to test your API.

**Requirements:**
- Location: `docs/postman/plant-swap-api.postman_collection.json`
- Include all endpoints organized by resource (Members, Plants, Exchanges, Feedback, Health)
- Include example request bodies for POST/PUT/PATCH requests
- Use environment variables for base URL
- Include both success and error test cases

---

## 📋 Task Breakdown

### Task 1: Project Setup and Git Initialization

**Objective:** Set up your development environment with PostgreSQL and initialize version control.

**What to do:**

1. Create a new Spring Boot project using Spring Initializr (start.spring.io)
2. Select the following dependencies:
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Spring Validation
   - Lombok (optional but recommended)
3. Set up PostgreSQL database locally or via Docker
4. Configure database connection in `application.properties`
5. Initialize a Git repository in your project folder
6. Create a `.gitignore` file appropriate for Java/Maven or Gradle projects
7. Make your first commit: `chore: initial project setup with spring boot`

**PostgreSQL Setup (Docker option):**
```bash
docker run --name plant-swap-db -e POSTGRES_DB=plant_swap_db -e POSTGRES_USER=your_user -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres:15
```

**Git Practice:**
- Learn about `git init`, `git add`, `git commit`
- Practice Conventional Commits from the start
- Understand what files should and should not be tracked

**Deliverable:** A running Spring Boot application connected to PostgreSQL that starts without errors.

---

### Task 2: Design Your Database Schema

**Objective:** Plan the relational database structure before writing any code.

**What to do:**

1. Create a document (or add to this README) with your Entity-Relationship diagram
2. Identify the entities needed for this system
3. Define the relationships between entities (one-to-many, many-to-many, etc.)
4. Determine the attributes for each entity
5. Identify primary keys and foreign keys

**Entities to consider:**
- Member (the users of the platform)
- Plant (plants listed for exchange)
- Exchange Request (when someone wants a plant)
- Feedback (reviews after exchanges)
- Plant Category (types of plants: succulent, herb, flowering, etc.)

**Questions to answer:**
- Can one member have multiple plants listed?
- Can a plant receive multiple exchange requests?
- What happens to a plant listing after a successful exchange?
- How do you track the history of who gave what to whom?

**Git Practice:**
- Create a new branch: `git checkout -b feature/database-design`
- Commit your design: `docs(schema): add database ER diagram and design`
- Learn about `git branch`, `git checkout`

**Deliverable:** A clear database schema document showing all tables, columns, data types, and relationships.

---

### Task 3: Implement Entity Classes

**Objective:** Apply OOP principles to create your domain model.

**What to do:**

1. Create Java entity classes for each table in your schema
2. Use JPA annotations (`@Entity`, `@Table`, `@Id`, `@Column`, etc.)
3. Implement proper relationships using `@OneToMany`, `@ManyToOne`, `@ManyToMany`
4. Apply encapsulation (private fields, public getters/setters)

**OOP Concepts to demonstrate:**

- **Encapsulation:** Keep fields private, expose through methods
- **Inheritance:** Consider a base entity class with common fields (id, createdAt, updatedAt)
- **Abstraction:** Think about what common behaviors plants might share

**Consider these design questions:**
- What fields should be required vs optional?
- How will you handle plant care difficulty? (enum? separate table?)
- What status values can an exchange request have?

**Git Practice:**
- Work on branch: `feature/entity-classes`
- Example commits:
  - `feat(entity): add base entity with audit fields`
  - `feat(entity): add member entity with validations`
  - `feat(entity): add plant entity with category relationship`

**Deliverable:** Complete entity classes that generate the correct database schema when the application runs.

---

### Task 4: Create Repository Layer

**Objective:** Understand Spring Data JPA repositories and the Repository pattern.

**What to do:**

1. Create repository interfaces for each entity
2. Extend appropriate Spring Data interfaces (`JpaRepository`, `CrudRepository`)
3. Define custom query methods using method naming conventions
4. Add at least one custom query using `@Query` annotation

**Custom queries to implement:**
- Find all plants by category
- Find all available plants in a specific area/neighborhood
- Find all exchange requests for a specific member
- Find plants by care difficulty level

**Spring Concepts to learn:**
- How does Spring Data JPA generate implementations?
- What is the difference between `JpaRepository` and `CrudRepository`?
- How do derived query methods work?

**Git Practice:**
- Work on branch: `feature/repositories`
- Commit: `feat(repository): add plant repository with custom queries`
- Merge completed features into main branch
- Learn about `git merge`

**Deliverable:** Repository interfaces with both derived and custom query methods.

---

### Task 5: Implement Response Envelope and Health Endpoint

**Objective:** Create standardized API response structure and health monitoring.

**What to do:**

1. Create a generic `ApiResponse<T>` wrapper class for all responses
2. Create an `ApiError` class for error details
3. Create a `PageMeta` class for pagination information
4. Implement the health endpoint with database connectivity check
5. Create a utility class or service to build responses consistently

**Health endpoint requirements:**
- Must check actual database connectivity (try a simple query)
- Must return appropriate status based on database health
- Should include application name and database type

**Response envelope requirements:**
- All controllers must use the envelope structure
- Success and error responses must be consistent
- Include timestamp in ISO 8601 format

**Git Practice:**
- Work on branch: `feature/response-envelope`
- Commits:
  - `feat(common): add api response envelope classes`
  - `feat(health): implement health check endpoint with db status`

**Deliverable:** Working response envelope system and functional health endpoint.

---

### Task 6: Implement Service Layer

**Objective:** Apply business logic separation and understand Spring's dependency injection.

**What to do:**

1. Create service interfaces defining business operations
2. Implement service classes with business logic
3. Use constructor injection for dependencies
4. Handle edge cases and business rules

**Business rules to implement:**
- A member cannot request their own plant
- A plant can only be given away once (but can have multiple pending requests)
- An exchange request can only be accepted if the plant is still available
- Both parties must confirm before an exchange is marked complete

**Spring Concepts to learn:**
- What is `@Service` annotation?
- How does `@Autowired` work? Why prefer constructor injection?
- What is the purpose of separating interface from implementation?

**OOP Concept - Polymorphism:**
- Consider how different types of exchanges might behave differently
- Think about how validation might vary for different plant categories

**Git Practice:**
- Work on branch: `feature/service-layer`
- Commits:
  - `feat(service): add member service with registration logic`
  - `feat(service): add plant service with availability check`
  - `fix(service): handle edge case for self-request validation`

**Deliverable:** Service layer with complete business logic implementation.

---

### Task 7: Build REST Controllers

**Objective:** Design and implement RESTful API endpoints following best practices.

**What to do:**

1. Create controller classes for each resource
2. Implement CRUD operations using appropriate HTTP methods
3. Use proper URL patterns and naming conventions
4. Implement request/response DTOs (Data Transfer Objects)
5. Add input validation
6. **Wrap all responses in the API envelope**

**REST API Best Practices to follow:**

| Operation | HTTP Method | URL Pattern | Example |
|-----------|-------------|-------------|---------|
| Get all | GET | /api/v1/resources | GET /api/v1/plants |
| Get one | GET | /api/v1/resources/{id} | GET /api/v1/plants/1 |
| Create | POST | /api/v1/resources | POST /api/v1/plants |
| Update | PUT | /api/v1/resources/{id} | PUT /api/v1/plants/1 |
| Partial update | PATCH | /api/v1/resources/{id} | PATCH /api/v1/plants/1 |
| Delete | DELETE | /api/v1/resources/{id} | DELETE /api/v1/plants/1 |

**Endpoints to implement:**

Health:
- `GET /api/health` - Health check with database status

Members:
- Register a new member
- Get member profile
- Update member profile
- List all plants owned by a member

Plants:
- List all available plants (with filtering options)
- Get plant details
- Create new plant listing
- Update plant listing
- Remove plant listing

Exchange Requests:
- Create exchange request
- View requests for my plants
- View my outgoing requests
- Accept/Reject a request
- Mark exchange as complete

Feedback:
- Submit feedback after exchange
- View feedback for a member

**Validation requirements:**
- Plant name cannot be empty
- Care difficulty must be valid enum value
- Member email must be valid format
- Exchange request must include a message

**Git Practice:**
- Create feature branches for each controller
- Commits:
  - `feat(controller): add member registration endpoint`
  - `feat(controller): add plant CRUD endpoints`
  - `feat(validation): add request body validations`

**Deliverable:** Fully functional REST API with envelope responses that can be tested with Postman.

---

### Task 8: Error Handling

**Objective:** Implement consistent error handling across the API using the response envelope.

**What to do:**

1. Create a global exception handler using `@ControllerAdvice`
2. Define custom exceptions for business rule violations
3. Return errors using the standard envelope format
4. Use appropriate HTTP status codes

**Error scenarios to handle:**
- Resource not found (404)
- Validation errors (400)
- Business rule violations (409 or 422)
- Duplicate entries (409)
- Server errors (500)

**Custom exceptions to create:**
- `ResourceNotFoundException`
- `BusinessRuleViolationException`
- `DuplicateResourceException`

**Git Practice:**
- Work on branch: `feature/error-handling`
- Commits:
  - `feat(exception): add custom exception classes`
  - `feat(exception): add global exception handler`
  - `fix(exception): handle validation errors properly`

**Deliverable:** Consistent error responses across all endpoints using the envelope structure.

---

### Task 9: Data Seeding, Testing, and Postman Collection

**Objective:** Populate your database with sample data, test your API, and document with Postman.

**What to do:**

1. Create a data initializer component that runs on startup
2. Seed the database with sample members, plants, and exchanges
3. Create comprehensive Postman collection
4. Test all endpoints using Postman
5. Export and commit the Postman collection

**Sample data suggestions:**
- 5-10 members from different neighborhoods
- 20-30 plants across various categories
- Several exchange requests in different statuses
- Some completed exchanges with feedback

**Postman Collection Requirements:**

Structure your collection as follows:
```
Plant Swap API
├── Health
│   └── GET Health Check
├── Members
│   ├── POST Register Member
│   ├── GET Member by ID
│   ├── PUT Update Member
│   └── GET Member's Plants
├── Plants
│   ├── GET All Plants
│   ├── GET Plant by ID
│   ├── POST Create Plant
│   ├── PUT Update Plant
│   ├── PATCH Partial Update
│   └── DELETE Remove Plant
├── Exchange Requests
│   ├── POST Create Request
│   ├── GET My Incoming Requests
│   ├── GET My Outgoing Requests
│   ├── PATCH Accept Request
│   ├── PATCH Reject Request
│   └── PATCH Complete Exchange
└── Feedback
    ├── POST Submit Feedback
    └── GET Member Feedback
```

**For each request include:**
- Descriptive name
- Example request body (for POST/PUT/PATCH)
- Environment variable for base URL: `{{baseUrl}}`
- At least one example response

**Git Practice:**
- Commits:
  - `feat(seed): add data initializer with sample data`
  - `docs(postman): add initial postman collection`
  - `docs(postman): add exchange request endpoints to collection`
- Tag your release: `git tag -a v1.0.0 -m "feat: first stable release"`

**Deliverable:** Working API with sample data and complete Postman collection committed to repository.

---

## 🎓 Bonus Challenges (Optional)

If you complete all tasks and want to learn more:

1. **Add Pagination:** Implement pagination for list endpoints using Spring's `Pageable`. Include pagination info in the `meta` field of your response envelope.

2. **Search Functionality:** Add search by plant name or description using query parameters

3. **Statistics Endpoint:** Create an endpoint showing platform statistics (total plants exchanged, most active members, popular plant categories)

4. **Image URLs:** Add support for plant image URLs and validate they are proper URLs

5. **Soft Delete:** Implement soft delete for plants instead of hard delete

6. **Audit Trail:** Track who modified what and when using JPA auditing

7. **API Versioning:** Implement proper API versioning strategy

8. **Docker Compose:** Create a `docker-compose.yml` to run both the application and PostgreSQL


## 📚 Recommended Resources

**Spring Boot:**
- Official Spring Boot Documentation
- Baeldung Spring tutorials
- Spring Guides (spring.io/guides)

**PostgreSQL:**
- PostgreSQL Documentation
- Docker PostgreSQL setup guides

**REST API Design:**
- REST API Tutorial (restfulapi.net)
- Microsoft REST API Guidelines

**Conventional Commits:**
- conventionalcommits.org
- Angular commit message guidelines

**Database Design:**
- Database normalization basics
- JPA relationship mapping guides

**Postman:**
- Postman Learning Center
- Creating and managing collections

**Git:**
- Git documentation (git-scm.com)
- Atlassian Git tutorials

---

## 🚀 Getting Started

1. Fork/clone this repository (or start fresh with Spring Initializr)
2. Set up PostgreSQL database
3. Read through all tasks to understand the full scope
4. Start with Task 1 and proceed sequentially
5. Use Conventional Commits from your very first commit
6. Build your Postman collection as you develop each endpoint
7. Don't hesitate to research - that's part of learning!

---

## 📝 Submission Guidelines

1. Ensure all code is committed and pushed using Conventional Commits
2. Verify PostgreSQL is properly configured
3. Confirm all responses use the envelope structure
4. Test health endpoint shows database status
5. Include complete Postman collection in `docs/postman/`
6. Update README with setup instructions
7. Include your database schema diagram
8. Provide a brief reflection (what you learned, challenges faced)
9. Tag your final commit: `git tag -a submission -m "chore: final submission"`

---

## ✅ Submission Checklist

Before submitting, verify:

- [ ] PostgreSQL is used as the database
- [ ] All commits follow Conventional Commits format
- [ ] All API responses use the envelope structure
- [ ] Health endpoint returns database connection status
- [ ] Postman collection is committed to `docs/postman/`
- [ ] All endpoints are tested and working
- [ ] README includes setup instructions
- [ ] Final commit is tagged as `submission`

---

## ❓ Questions to Reflect On

After completing the assignment, consider these questions:

1. Why do we separate code into Controller, Service, and Repository layers?
2. How does Spring manage the lifecycle of beans?
3. What are the benefits of using DTOs instead of exposing entities directly?
4. Why is a standard response envelope important for API consumers?
5. How does the health endpoint help in production environments?
6. Why use PostgreSQL over H2 for this assignment?
7. How do Conventional Commits improve project maintainability?
8. How would you scale this application for thousands of users?
9. What security considerations would you add in a production application?

---

Good luck, and happy coding! 🌱

*Remember: The goal is learning. Take your time, experiment, make mistakes, and grow as a developer.*
