# Member 3 – REST API Development Contribution Report

**Project:** GameZone Arcade Backend (LG-01)  
**Team Member:** M. Manoj  
**Registration Number:** 252U1R5106  
**Assigned Responsibility:** MEMBER 3 – REST API DEVELOPMENT (Gamers, Consoles, and Booking Queries)  
**Submission Date:** 15-11-2026  

---

## 1. Member Role & Overview

As **Member 3**, my core responsibility in the GameZone Arcade Backend group project was **REST API Development**, encompassing:
1. **Gamer Management APIs:** Full CRUD operations (`GET`, `POST`, `PUT`, `DELETE`) with relational integrity and unique email handling.
2. **Console Management APIs:** Full CRUD operations (`GET`, `POST`, `PUT`, `DELETE`), platform filtering, and platform search integration.
3. **Booking Query Management APIs:** Read-only retrieval endpoints (`GET /bookings`, `GET /bookings/:id`, `GET /bookings/details`) featuring complex multi-table SQL `JOIN` operations.
4. **Controller Architecture:** Decoupling routing logic from database execution by implementing dedicated controller modules (`gamerController.js`, `consoleController.js`, `bookingQueryController.js`).
5. **Route Registration & Integration:** Coordinating with Member 1's `server.js` and Member 5's booking workflow without route conflicts or duplication.

---

## 2. Implemented Endpoints & Features

### 2.1 Gamer Management APIs

- **Routes File:** `routes/gamerRoutes.js`
- **Controller File:** `controllers/gamerController.js`

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/gamers` | Retrieves all registered gamers ordered by `gamer_id` | `200 OK`, `500 Internal Server Error` |
| `GET` | `/gamers/:id` | Retrieves a single gamer by primary key ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/gamers` | Creates/registers a new gamer record | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `PUT` | `/gamers/:id` | Updates an existing gamer's name and email | `200 OK`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| `DELETE` | `/gamers/:id` | Deletes a gamer if no bookings reference them | `200 OK`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |

- **Validation & Business Rules:** Reuses Member 4's `validateGamer` and `validateIdParam` middleware while maintaining defensive validation inside the controller.
- **Conflict Handling:** Translates `SQLITE_CONSTRAINT_UNIQUE` into `409 Conflict` (`"Email already registered"`).
- **Foreign Key Protection:** Catches `SQLITE_CONSTRAINT_FOREIGNKEY` on deletion attempts when active bookings exist, returning `409 Conflict` (`"Cannot delete gamer because bookings exist"`).

### 2.2 Console Management APIs

- **Routes File:** `routes/consoleRoutes.js`
- **Controller File:** `controllers/consoleController.js`

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/consoles` | Retrieves all available consoles (supports `?platform=` query filter) | `200 OK`, `500 Internal Server Error` |
| `GET` | `/consoles/:id` | Retrieves a single console by primary key ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `GET` | `/consoles/search` | Case-insensitive partial search by platform | `200 OK`, `400 Bad Request`, `500 Internal Server Error` |
| `GET` | `/consoles/:id/bookings` | Retrieves all bookings associated with a specific console | `200 OK`, `400 Bad Request`, `500 Internal Server Error` |
| `POST` | `/consoles` | Adds a new gaming console station | `201 Created`, `400 Bad Request`, `500 Internal Server Error` |
| `PUT` | `/consoles/:id` | Updates console specifications (name, platform) | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/consoles/:id` | Removes a console when permitted by foreign key constraints | `200 OK`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |

- **Search Registration:** `/consoles/search` is registered before `/:id` to avoid route pattern shadowing.
- **Foreign Key Protection:** Prevents deletion of consoles assigned to bookings, returning `409 Conflict` (`"Cannot delete console because bookings exist"`).

### 2.3 Booking Query APIs

- **Routes File:** `routes/bookingQueryRoutes.js`
- **Controller File:** `controllers/bookingQueryController.js`

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/bookings` | Retrieves all booking records (supports optional `?status=` filter) | `200 OK`, `400 Bad Request`, `500 Internal Server Error` |
| `GET` | `/bookings/details` | Retrieves enriched booking records using multi-table SQL `JOIN` | `200 OK`, `500 Internal Server Error` |
| `GET` | `/bookings/:id` | Retrieves a specific booking with joined gamer and console details | `200 OK`, `400 Bad Request`, `404 Not Found` |

- **Order Priority:** `/bookings/details` is registered explicitly prior to `/bookings/:id` to guarantee the literal string `"details"` is not evaluated as an integer parameter.
- **Scope Preservation:** Member 5 retains exclusive ownership of `POST /bookings` (booking creation) and `PATCH /bookings/:id/status` (Twist Rule transitions). Member 3 strictly authored the read and query endpoints.

---

## 3. Database Operations & SQL Queries

All database interactions utilize the project's single persistent `better-sqlite3` instance initialized in `database/db.js` with `foreign_keys = ON`. Parameterized queries (`?`) are strictly enforced across all operations to prevent SQL injection vulnerabilities.

### 3.1 Multi-Table SQL JOIN Query

The primary query used across booking details and booking retrieval joins three relational entities:

```sql
SELECT
    b.booking_id,
    g.gamer_id,
    g.name AS gamer_name,
    g.email AS gamer_email,
    c.console_id,
    c.name AS console_name,
    c.platform,
    b.status
FROM bookings b
JOIN gamers g ON b.gamer_id = g.gamer_id
JOIN consoles c ON b.console_id = c.console_id
ORDER BY b.booking_id DESC;
```

**JOIN Mechanics:**
- Links `bookings.gamer_id` to primary key `gamers.gamer_id` to attach human-readable gamer metadata (`gamer_name`, `gamer_email`).
- Links `bookings.console_id` to primary key `consoles.console_id` to attach console station information (`console_name`, `platform`).
- Returns a denormalized view ideal for arcade managers and API consumers.

### 3.2 Parameterized CRUD Operations

- **Gamer Insertion:**
  ```sql
  INSERT INTO gamers (name, email) VALUES (?, ?);
  ```
- **Gamer Update:**
  ```sql
  UPDATE gamers SET name = ?, email = ? WHERE gamer_id = ?;
  ```
- **Console Platform Filter:**
  ```sql
  SELECT * FROM consoles WHERE LOWER(platform) = LOWER(?) ORDER BY console_id;
  ```
- **Console Search (LIKE):**
  ```sql
  SELECT * FROM consoles WHERE LOWER(platform) LIKE LOWER(?) ORDER BY console_id;
  ```
- **Delete Enforcement:**
  ```sql
  DELETE FROM gamers WHERE gamer_id = ?;
  ```

---

## 4. Route Registration & Coordination

1. **Server Architecture Coordination:**
   Member 1's `server.js` mounts the root route prefixes:
   ```javascript
   app.use("/gamers", gamerRoutes);
   app.use("/consoles", consoleRoutes);
   app.use("/bookings", bookingRoutes);
   ```
2. **Sub-Router Mounting:**
   To respect Member 5's booking creation and Twist Rule handlers without modifying Member 1's `server.js` or causing duplicate route collisions, `routes/bookingQueryRoutes.js` is mounted directly within `routes/bookingRoutes.js`:
   ```javascript
   const bookingQueryRoutes = require("./bookingQueryRoutes");
   router.use(bookingQueryRoutes);
   ```
3. **Middleware Reusability:**
   Member 4's input validation middleware (`validateGamer`, `validateConsole`, `validateConsoleSearch`, `validateIdParam`) is applied directly to route chains while maintaining clean controller delegation.

---

## 5. Testing & Verification

A dedicated 30-scenario HTTP automated test harness was executed against the active Express application to verify all implemented endpoints and edge cases.

| Category | Tests Executed | Passed | Failed | Pass Rate |
|---|---:|---:|---:|---:|
| Gamer Management CRUD & Details | 5 | 5 | 0 | 100% |
| Console Management CRUD & Search | 7 | 7 | 0 | 100% |
| Booking Queries & Multi-Table JOIN | 5 | 5 | 0 | 100% |
| Error Handling & Boundary Checks | 13 | 13 | 0 | 100% |
| **Total** | **30** | **30** | **0** | **100%** |

### Verified Edge Cases:
- Invalid numeric IDs (`/gamers/invalid_id`, `/consoles/invalid_id`, `/bookings/invalid_id`) returning `400 Bad Request`.
- Nonexistent IDs (`/gamers/999999`, `/consoles/999999`, `/bookings/999999`) returning `404 Not Found`.
- Duplicate gamer email registration returning `409 Conflict`.
- Deleting gamer or console with active bookings returning `409 Conflict` (Foreign Key constraint enforcement).
- Invalid booking status query filter (`/bookings?status=invalid_status`) returning `400 Bad Request`.
- All test records were safely removed after test cycles; seeded data (`gamer_id: 1`, `console_id: 1`, `booking_id: 1..3`) remained completely intact.

---

## 6. Challenges Faced & Solutions

1. **Route Shadowing Between Static and Parameterized Paths:**
   - *Challenge:* In Express, registering `/:id` before `/details` or `/search` causes the router to misinterpret static path segments as parameter values.
   - *Solution:* Positioned `/details` before `/:id` in `bookingQueryRoutes.js`, and `/search` before `/:id` in `consoleRoutes.js`.

2. **Team Collaboration & Route Consolidation:**
   - *Challenge:* Avoiding merge collisions with Member 5's booking workflow and Member 1's server routing while delivering independent booking query functionality.
   - *Solution:* Separated query operations into `controllers/bookingQueryController.js` and mounted `bookingQueryRoutes.js` cleanly into `bookingRoutes.js`.

3. **Safe Error Handling for Database Constraints:**
   - *Challenge:* Direct SQLite constraint violations throw runtime errors that could crash the server or expose internal table structures.
   - *Solution:* Wrapped database calls in `try...catch` blocks, inspected error codes (`SQLITE_CONSTRAINT_UNIQUE`, `SQLITE_CONSTRAINT_FOREIGNKEY`), and emitted user-friendly HTTP `409 Conflict` responses.

---

## 7. Key Learning Outcomes

- Mastered the separation of concerns between Express route declarations and controller business logic.
- Gained comprehensive experience with synchronous SQLite transactions using `better-sqlite3`.
- Deepened understanding of relational algebra, foreign key cascades/restrictions, and multi-table `JOIN` statements.
- Developed practical collaborative Git workflows by coordinating module interfaces with team members.
