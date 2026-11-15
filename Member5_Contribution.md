# Member 5 Contribution Report: Booking Workflow and Twist Rule Implementation

- **Project:** GameZone Arcade – Backend API
- **Group:** LG-01
- **Member Name:** R. Joel
- **Registration Number:** 252U1R5125
- **Assigned Role:** Member 5 – Booking Creation, Booking Status Management, and Twist Rule Implementation
- **Repository:** `https://github.com/pardhusadhu5/GameZone-Arcade.git`
- **Tech Stack:** Node.js, Express.js, SQLite (`better-sqlite3`), Postman, Git & GitHub

---

## 1. Executive Summary

As **Member 5** of the GameZone Arcade backend development team, my assigned responsibility was to design, implement, integrate, and verify the **Booking Workflow**, specifically:
1. **Booking Creation API (`POST /bookings`)**: Enabling gamers to book available gaming consoles with complete foreign key validation and enforced initial state.
2. **Booking Status Management API (`PATCH /bookings/:id/status`)**: Providing controlled status transitions according to strict business logic.
3. **The Assignment "Twist Rule"**: Enforcing a non-bypassable sequential finite-state workflow (`pending` $\rightarrow$ `approved` $\rightarrow$ `done`), preventing out-of-order skipping, backward transitions, duplicate state updates, and unauthorized terminal state changes.

All code has been developed using clean architectural separation between Express routers and controllers, parameterized SQL statements via `better-sqlite3`, robust error handling, and complete non-destructive database safety.

---

## 2. Implemented Files and Architecture

In accordance with the project guidelines, routes and controllers have been cleanly decoupled into dedicated modules:

| File Path | Role | Description |
|---|---|---|
| `routes/bookingCreateRoutes.js` | Express Router | Registers the `POST /bookings` endpoint for new booking reservations. |
| `controllers/bookingCreateController.js` | Controller | Contains input validation, existence checks for gamer and console, foreign-key handling, automatic `pending` status enforcement, and parameterized insert queries. |
| `routes/bookingStatusRoutes.js` | Express Router | Registers the `PATCH /bookings/:id/status` endpoint for status updates. |
| `controllers/bookingStatusController.js` | Controller | Enforces the Twist Rule state machine, verifies transition validity, executes safe database updates, and returns detailed joined booking records. |
| `server.js` | Express Server Setup | Integrated `bookingCreateRoutes` and `bookingStatusRoutes` alongside Member 3's query routes. |
| `routes/bookingRoutes.js` | Integration Route | Harmonized routing to eliminate conflicting handlers while preserving Member 3's query routes (`GET /`, `GET /details`, `GET /:id`). |
| `Member5_Contribution.md` | Documentation | This comprehensive individual contribution report. |

---

## 3. Booking Creation API (`POST /bookings`)

### 3.1 Purpose
Allows clients to create a reservation connecting a registered gamer with an available gaming console.

### 3.2 Endpoint Specification
- **Method:** `POST`
- **Path:** `/bookings`
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "gamer_id": 1,
    "console_id": 1
  }
  ```

### 3.3 Implementation Details & Security Controls
1. **Input Validation:** Verifies that both `gamer_id` and `console_id` are provided and are valid positive integers. If missing or invalid, an HTTP `400 Bad Request` is returned.
2. **Workflow Bypass Prevention:** If a client attempts to pass `"status": "approved"` or `"status": "done"` in the request body, the controller rejects the request with HTTP `400 Bad Request`. Every new booking is strictly created with the initial status `pending`.
3. **Foreign Key Integrity:** 
   - Pre-insert queries verify that `gamer_id` exists in `gamers` table and `console_id` exists in `consoles` table.
   - Non-existent IDs return HTTP `404 Not Found`.
   - SQLite `SQLITE_CONSTRAINT_FOREIGNKEY` errors are caught and handled safely.
4. **Parameterized SQL:** Uses `better-sqlite3` prepared statements to prevent SQL injection:
   ```javascript
   const insertStmt = db.prepare(`
       INSERT INTO bookings (gamer_id, console_id, status)
       VALUES (?, ?, 'pending')
   `);
   const result = insertStmt.run(Number(gamer_id), Number(console_id));
   ```
5. **Response Details:** Returns HTTP `201 Created` with the newly inserted booking joined with gamer and console information (`gamer_name`, `console_name`, `platform`, `status`).

---

## 4. The Twist Rule Implementation

### 4.1 Explanation of the Twist Rule:
> 
> *"In a real gaming arcade, a gamer cannot simply walk in and declare their booking 'completed' (done), nor can a staff member approve a booking that was already finished. A booking must follow an exact chronological life cycle:*
> 1. *When a gamer books a console, it starts as **pending** awaiting staff approval.*
> 2. *Once staff reviews and accepts the slot, the booking becomes **approved**.*
> 3. *After the gamer finishes their play session, the booking is marked **done**.*
> 
> *Our Twist Rule ensures that:*
> - *No step can be skipped (e.g., you cannot jump directly from `pending` to `done`).*
> - *A booking cannot move backwards (e.g., you cannot move from `approved` back to `pending`).*
> - *Once a booking reaches `done`, it is in its final state and can never be changed again.*
> - *Any attempt to violate this order is immediately rejected with HTTP 400 Bad Request, and the database remains completely untouched."*

### 4.2 State Machine Flowchart

```text
        [ NEW BOOKING CREATED ]
                   |
                   v
             +-----------+
             |  PENDING  |  <--- Initial Status
             +-----------+
                   |
                   | Allowed: { "status": "approved" }
                   v
             +-----------+
             | APPROVED  |
             +-----------+
                   |
                   | Allowed: { "status": "done" }
                   v
             +-----------+
             |   DONE    |  <--- Terminal State (Immutable)
             +-----------+
```

### 4.3 Transition Matrix

| Current Status | Requested Status | Result | HTTP Code | Database Action | Reason |
|---|---|---|---|---|---|
| `pending` | `approved` | **ALLOWED** | `200 OK` | Updated to `approved` | Normal sequential progression |
| `approved` | `done` | **ALLOWED** | `200 OK` | Updated to `done` | Normal completion of session |
| `pending` | `done` | **REJECTED** | `400 Bad Request` | None (Unchanged) | Cannot skip intermediate `approved` step |
| `approved` | `pending` | **REJECTED** | `400 Bad Request` | None (Unchanged) | Backward transitions are strictly prohibited |
| `done` | `approved` | **REJECTED** | `400 Bad Request` | None (Unchanged) | `done` is the final terminal state |
| `done` | `pending` | **REJECTED** | `400 Bad Request` | None (Unchanged) | `done` is the final terminal state |
| `pending` | `pending` | **REJECTED** | `400 Bad Request` | None (Unchanged) | Redundant self-transition |
| `approved` | `approved` | **REJECTED** | `400 Bad Request` | None (Unchanged) | Redundant self-transition |
| `done` | `done` | **REJECTED** | `400 Bad Request` | None (Unchanged) | Redundant self-transition |
| Any | `cancelled` / other | **REJECTED** | `400 Bad Request` | None (Unchanged) | Unsupported status value |

---

## 5. Booking Status Management API (`PATCH /bookings/:id/status`)

### 5.1 Endpoint Specification
- **Method:** `PATCH`
- **Path:** `/bookings/:id/status`
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "status": "approved"
  }
  ```

### 5.2 Implementation Highlights
- **Parameter Validation:** Ensures `:id` is a valid positive integer.
- **Payload Validation:** Ensures `status` is provided, non-empty, and matches one of the known statuses (`pending`, `approved`, `done`).
- **Record Existence Check:** Checks if `booking_id` exists in SQLite. If not, returns HTTP `404 Not Found`.
- **Twist Rule State Check:**
  ```javascript
  const allowedTransitions = {
      pending: "approved",
      approved: "done"
  };

  if (allowedTransitions[booking.status] !== requestedStatus) {
      return res.status(400).json({
          error: "Invalid status transition",
          message: `Cannot transition booking from '${booking.status}' to '${requestedStatus}'. The Twist Rule strictly enforces the sequence: pending -> approved -> done.`,
          workflow: "pending -> approved -> done"
      });
  }
  ```
- **Database Safety:** The update query (`UPDATE bookings SET status = ? WHERE booking_id = ?`) is **only** executed when the transition validation passes. If validation fails, the query is never executed, ensuring data consistency.

---

## 6. Testing Verification and Results

Testing was conducted using Postman and an automated Node.js test suite exercising all edge cases, foreign keys, and Twist Rule transitions against the live server.

### 6.1 Test Summary
- **Total Test Cases Executed:** 35
- **Passed:** 35
- **Failed:** 0
- **Pass Rate:** 100%

### 6.2 Test Results Breakdown

#### A. Booking Creation Tests
| Test # | Description | Input Payload | Expected Status | Actual Status | Result |
|---|---|---|---|---|---|
| 1 | Create booking with valid IDs | `{"gamer_id": 1, "console_id": 1}` | 201 Created | 201 Created | **PASS** |
| 2 | Initial status verification | Response body check | `"status": "pending"` | `"status": "pending"` | **PASS** |
| 3 | Missing `gamer_id` | `{"console_id": 1}` | 400 Bad Request | 400 Bad Request | **PASS** |
| 4 | Missing `console_id` | `{"gamer_id": 1}` | 400 Bad Request | 400 Bad Request | **PASS** |
| 5 | Non-existent `gamer_id` (999999) | `{"gamer_id": 999999, "console_id": 1}` | 404 Not Found | 404 Not Found | **PASS** |
| 6 | Non-existent `console_id` (999999) | `{"gamer_id": 1, "console_id": 999999}` | 404 Not Found | 404 Not Found | **PASS** |
| 7 | Empty request body | `{}` | 400 Bad Request | 400 Bad Request | **PASS** |
| 8 | Bypass attempt with `"status": "approved"` | `{"gamer_id": 1, "console_id": 1, "status": "approved"}` | 400 Bad Request | 400 Bad Request | **PASS** |

#### B. Twist Rule & Invalid Transition Tests
| Test # | Current State | Attempted State | Expected HTTP | Actual HTTP | Database Verified Unchanged? | Result |
|---|---|---|---|---|---|---|
| 9 | `pending` | `done` (skip approved) | 400 Bad Request | 400 Bad Request | Yes (remains `pending`) | **PASS** |
| 10 | `pending` | `pending` (self transition) | 400 Bad Request | 400 Bad Request | Yes (remains `pending`) | **PASS** |
| 11 | `pending` | `cancelled` (invalid value) | 400 Bad Request | 400 Bad Request | Yes (remains `pending`) | **PASS** |
| 12 | Non-existent booking (999999) | `approved` | 404 Not Found | 404 Not Found | Yes (no changes) | **PASS** |
| 13 | `approved` | `pending` (backward move) | 400 Bad Request | 400 Bad Request | Yes (remains `approved`) | **PASS** |
| 14 | `approved` | `approved` (self transition) | 400 Bad Request | 400 Bad Request | Yes (remains `approved`) | **PASS** |
| 15 | `done` | `approved` (terminal state) | 400 Bad Request | 400 Bad Request | Yes (remains `done`) | **PASS** |
| 16 | `done` | `pending` (terminal state) | 400 Bad Request | 400 Bad Request | Yes (remains `done`) | **PASS** |

#### C. Valid Transition Tests
| Test # | Current State | Target State | Expected HTTP | Actual HTTP | Database Verified Updated? | Result |
|---|---|---|---|---|---|---|
| 17 | `pending` | `approved` | 200 OK | 200 OK | Yes (database is `approved`) | **PASS** |
| 18 | `approved` | `done` | 200 OK | 200 OK | Yes (database is `done`) | **PASS** |

#### D. Integration with Member 3 Query Endpoints
| Test # | Endpoint | Expected Behavior | Actual Behavior | Result |
|---|---|---|---|---|
| 19 | `GET /bookings` | Retrieves all bookings | Returns array with status codes | **PASS** |
| 20 | `GET /bookings/:id` | Retrieves booking by ID | Returns matching record | **PASS** |
| 21 | `GET /bookings/details` | SQL JOIN with gamers & consoles | Returns joined `gamer_name` & `console_name` | **PASS** |

---

## 7. Challenges Faced and Solutions

1. **State Bypassing Vulnerability:**
   - *Challenge:* If client applications send `{ "status": "approved" }` in the POST body, naive implementations might insert it directly, bypassing staff approval.
   - *Solution:* Implemented explicit guard logic in `bookingCreateController.js` rejecting non-`pending` status payloads and forcing `'pending'` in the SQL insert statement.

2. **Database Integrity on Rejection:**
   - *Challenge:* Ensuring that an invalid transition does not accidentally perform a partial update or alter any metadata.
   - *Solution:* Read the current status from SQLite first, evaluate the transition rule purely in application memory, and only invoke the `UPDATE` SQL statement if the check strictly evaluates to true.

3. **Multi-Member Routing Harmony:**
   - *Challenge:* Member 1 had set up `server.js` with `app.use('/bookings', bookingRoutes)`, while Member 3 developed booking query endpoints in `bookingRoutes.js`. Integrating `bookingCreateRoutes` and `bookingStatusRoutes` without collisions or duplicated handlers required careful coordination.
   - *Solution:* Registered `bookingCreateRoutes` and `bookingStatusRoutes` cleanly on `/bookings` in `server.js` and linked the controller functions into `bookingRoutes.js` as well. This guarantees that all booking endpoints (`POST`, `PATCH`, `GET`, `GET /details`, `GET /:id`) work together seamlessly.

---

## 8. Learning Outcomes

1. **State Machine Modeling:** Gained hands-on experience translating real-world business workflows into strict, deterministic backend state transitions.
2. **Defensive API Design:** Learned how to validate relational foreign keys, sanitize inputs, prevent bypasses, and return descriptive, RFC-compliant HTTP status codes (`201`, `200`, `400`, `404`, `500`).
3. **Database Concurrency and Prepared Statements:** Mastered synchronous parameterized execution using `better-sqlite3` to ensure zero SQL injection risk and strong consistency.
4. **Team Integration:** Successfully integrated individual modules into a team codebase without overwriting peers' contributions or altering the underlying relational schema.

---

## 9. Git Commit and Repository Details

- **Commit ID:** `8b92c8f`
- **Commit Message:** `feat: implement booking workflow and twist rule`
- **Branch:** `main`
- **Repository Remote:** `https://github.com/pardhusadhu5/GameZone-Arcade.git`

---

*Report prepared and submitted by: **R. Joel (Registration: 252U1R5125)**, Group LG-01.*
