# 🌿 Green Neighbors – Database Design

## 1. Entities & Schema

### Table: members
* **id** (PK, Long): Unique ID for the user.
* **email** (String, Unique): User's email address.
* **password** (String): Encrypted password.
* **name** (String): Full name.
* **neighborhood** (String): Where they live (used for searching nearby plants).

---

### Table: plant_categories
* **id** (PK, Long): Unique ID (e.g., 1).
* **name** (String): E.g., "Succulent", "Herb", "Flowering".

---

### Table: plants
* **id** (PK, Long): Unique ID.
* **name** (String): Plant name.
* **description** (String): Care difficulty, size, and other details.
* **status** (Enum): AVAILABLE, PENDING_EXCHANGE, SWAPPED.
* **member_id** (FK → members.id): The owner (Many Plants → One Member).
* **category_id** (FK → plant_categories.id): The type of plant (Many Plants → One Category).

---

### Table: exchange_requests
* **id** (PK, Long): Unique ID.
* **status** (Enum): PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED.
* **created_at** (Timestamp): Date of request.
* **requester_id** (FK → members.id): The member asking (Many Requests → One Member).
* **plant_id** (FK → plants.id): The plant requested (Many Requests → One Plant).

---

### Table: feedback
* **id** (PK, Long): Unique ID.
* **rating** (Integer): 1–5 stars.
* **comment** (String): Review text.
* **exchange_id** (FK → exchange_requests.id): Links to the completed exchange.
* **reviewer_id** (FK → members.id): Who wrote the review.

---

## 2. Relationships

* **Member → Plants:** One-to-Many  
  A member can list multiple plants.

* **Plant → Exchange Requests:** One-to-Many  
  A plant can receive multiple requests, but only one can be completed.

* **Member → Exchange Requests:** One-to-Many  
  A member can request many plants.

* **Exchange Request → Feedback:** One-to-One (per reviewer)  
  Feedback is given after a completed exchange.

---

## 3. Design Decisions (Q&A)

### Q: Can one member have multiple plants listed?
**Yes.**  
The `plants` table includes `member_id`, allowing many plants to belong to one member.

### Q: Can a plant receive multiple exchange requests?
**Yes.**  
Multiple rows in `exchange_requests` can reference the same `plant_id`.  
When a request becomes **ACCEPTED**, the plant status changes to `PENDING_EXCHANGE` to prevent new requests.

### Q: What happens to a plant listing after a successful exchange?
The plant’s status is updated to **SWAPPED**.  
It remains stored for history purposes but is hidden from search results.

### Q: How do you track the history of who gave what to whom?
We use the `exchange_requests` table where `status = 'COMPLETED'`.

This connects:
* **Requester (Receiver)** → `requester_id`
* **Plant** → `plant_id`
* **Owner (Giver)** → via `plants.member_id`

---

## 4. ER Diagram Visual

The diagram below shows the relationships between all entities in the system.

![ER Diagram](./ER%20Diagram.jpeg)

### Diagram Explanation

The ER diagram illustrates:

* One **Member** can list many **Plants**
* Each **Plant** belongs to one **Plant Category**
* Each **Plant** can have many **Exchange Requests**
* Each **Exchange Request** is made by one **Member**
* **Feedback** is linked to a completed **Exchange Request**
