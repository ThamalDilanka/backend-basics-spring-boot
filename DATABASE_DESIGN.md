

## 1. Entities & Schema

### Table: members
* **id** (PK, Long): Unique ID for the user.
* **email** (String, Unique): User's email address.
* **password** (String): Encrypted password.
* **name** (String): Full name.
* **neighborhood** (String): Where they live (for searching).

### Table: Plant Category
* **id** (PK, Long): Unique ID (e.g., 1).
* **name** (String): E.g., "Succulent", "Herb", "Flowering".

### Table: plants
* **id** (PK, Long): Unique ID.
* **name** (String): Plant name.
* **description** (String): Care difficulty, size, etc.
* **status** (Enum): AVAILABLE, PENDING_EXCHANGE, SWAPPED.
* **member_id** (FK): The owner (Many Plants -> One Member).
* **category_id** (FK): The type of plant (Many Plants -> One Category).

### Table: exchange_requests
* **id** (PK, Long): Unique ID.
* **status** (Enum): PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED.
* **created_at** (Timestamp): Date of request.
* **requester_id** (FK): The member asking (Many Requests -> One Member).
* **plant_id** (FK): The plant requested (Many Requests -> One Plant).

### Table: feedback
* **id** (PK, Long): Unique ID.
* **rating** (Integer): 1-5 stars.
* **comment** (String): Review text.
* **exchange_id** (FK): Links to the completed exchange (One Feedback -> One Exchange).
* **reviewer_id** (FK): Who wrote the review.

---

## 2. Relationships
* **Member -> Plants:** One-to-Many (A user can list 50 plants).
* **Plant -> Requests:** One-to-Many (A popular plant can get 10 requests, but only 1 is accepted).
* **Member -> Feedback:** One-to-Many (A user can write many reviews).

---

## 3. Design Decisions (Q&A)

**Q: Can one member have multiple plants listed?**
A: Yes. The `plants` table has a `member_id` column, allowing multiple rows to point to the same member.

**Q: Can a plant receive multiple exchange requests?**
A: Yes. The `exchange_requests` table links to `plant_id`. Multiple requests can exist for one plant ID. However, once a request is `ACCEPTED`, the plant status changes to `PENDING_EXCHANGE` to hide it from search.

**Q: What happens to a plant listing after a successful exchange?**
A: The plant's status is updated to `SWAPPED`. It stays in the database for history/tracking but is filtered out of search results.

**Q: How do you track the history of who gave what to whom?**
A: We query the `exchange_requests` table where `status = 'COMPLETED'`. This table connects the **Requester** (Receiver) to the **Plant** (which connects to the **Owner/Giver**).