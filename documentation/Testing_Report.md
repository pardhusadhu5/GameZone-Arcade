# 🧪 GameZone Arcade – Comprehensive Testing Report

**Project:** GameZone Arcade Backend API  
**Group:** LG-01  
**Prepared by:** Member 6 – S. Pardhu Naidu (252U1R5128)  
**Role:** Postman Testing, API Documentation, Testing Report, and Final Submission  
**Date of Testing:** 15-11-2026  
**Testing Status:** All 35 Executed Tests PASSED (0 Failed, 0 Untested)  

---

## 1. Testing Environment and Setup

| Parameter | Specification | Details |
|---|---|---|
| **Operating System** | Windows 11 / Node runtime | Local execution sandbox |
| **Runtime Environment** | Node.js v26.13.0 | JavaScript runtime |
| **Backend Framework** | Express.js 5.3.0 | Web application routing |
| **Database Engine** | SQLite 3 (`better-sqlite3` v13.0.3) | Embedded relational database with Foreign Keys enabled |
| **Testing Tool 1** | Postman v11.x | Newman / Postman Collection Automated Test Suite |
| **Testing Tool 2** | Automated Node.js In-Process Test Harness | Direct end-to-end route, DB and middleware verification |
| **Base URL** | `http://localhost:3000` | Local development host |

---

## 2. Test Execution Methodology

Every endpoint was tested against both positive and negative scenarios:
1. **Server Verification:** Ensured service responsiveness and SQLite database link.
2. **CRUD & Search Testing:** Tested all standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) across Gamers, Consoles, and Bookings.
3. **Relational Integrity (JOIN & Foreign Keys):** Validated relational queries combining gamers, consoles, and bookings, and verified foreign key constraint rejections.
4. **Twist Rule Validation:** Confirmed that booking status transitions strictly adhere to the state progression: `pending` ➔ `approved` ➔ `done`, and that invalid transitions are rejected without modifying the database.
5. **Robust Error Handling:** Tested boundary cases including non-numeric IDs, nonexistent IDs, missing required fields, email regex failures, duplicate records, malformed JSON, and unknown routes.

---

## 3. Comprehensive Test Results Table

| Test ID | Module | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **S01** | Server | GET `/` (Root route) | Status 200 with message "Welcome to GameZone Arcade" and status "Running" | Status 200, message: "Welcome to GameZone Arcade", status: "Running" | **PASS** |
| **S02** | Server | GET `/health` (Health check) | Status 200 with status "healthy" and database "connected" | Status 200, status: "healthy", database: "connected" | **PASS** |
| **G01** | Gamer Management | GET `/gamers` (Get all gamers) | Status 200 with gamers array and count > 0 | Status 200, count: 5, array returned with valid gamer records | **PASS** |
| **G02** | Gamer Management | GET `/gamers/1` (Get gamer by ID) | Status 200 with gamer object having `gamer_id = 1` | Status 200, gamer_id: 1, name: "LG-01 Test" | **PASS** |
| **G03** | Gamer Management | POST `/gamers` (Create new gamer) | Status 201 with message "Gamer registered successfully" and gamer object | Status 201, message: "Gamer registered successfully", new ID returned | **PASS** |
| **G04** | Gamer Management | PUT `/gamers/:id` (Update gamer details) | Status 200 with message "Gamer updated successfully" and updated name | Status 200, message: "Gamer updated successfully", updated record verified | **PASS** |
| **G05** | Gamer Management | DELETE `/gamers/:id` (Delete unbooked gamer) | Status 200 with message "Gamer deleted successfully" | Status 200, message: "Gamer deleted successfully" | **PASS** |
| **C01** | Console Management | GET `/consoles` (Get all consoles) | Status 200 with count and consoles array | Status 200, count: 2, array returned with valid console records | **PASS** |
| **C02** | Console Management | GET `/consoles/1` (Get console by ID) | Status 200 with console object having `console_id = 1` | Status 200, console_id: 1, platform: "PlayStation" | **PASS** |
| **C03** | Console Management | GET `/consoles/search?platform=play` | Status 200 with matching consoles containing "play" | Status 200, count: 1, matching console returned | **PASS** |
| **C04** | Console Management | GET `/consoles?platform=Xbox` | Status 200 with consoles matching platform "Xbox" | Status 200, all returned consoles match platform Xbox | **PASS** |
| **C05** | Console Management | POST `/consoles` (Create new console) | Status 201 with message "Console added successfully" and console object | Status 201, message: "Console added successfully", new ID returned | **PASS** |
| **C06** | Console Management | PUT `/consoles/:id` (Update console) | Status 200 with message "Console updated successfully" and updated name | Status 200, message: "Console updated successfully", updated name verified | **PASS** |
| **C07** | Console Management | DELETE `/consoles/:id` (Delete console) | Status 200 with message "Console deleted successfully" | Status 200, message: "Console deleted successfully" | **PASS** |
| **B01** | Booking Management | GET `/bookings` (Get all bookings) | Status 200 with count and bookings array | Status 200, count: 3, bookings array returned | **PASS** |
| **B02** | Booking Management | GET `/bookings/details` (JOIN query) | Status 200 with joined gamer and console fields (`gamer_name`, `console_name`, `platform`) | Status 200, joined fields verified on all returned booking items | **PASS** |
| **B03** | Booking Management | GET `/bookings/1` (Get booking by ID) | Status 200 with booking object having `booking_id = 1` | Status 200, booking_id: 1 returned with full details | **PASS** |
| **B04** | Booking Management | GET `/bookings?status=pending` | Status 200 with filtered bookings having status "pending" | Status 200, all returned bookings verified to have status pending | **PASS** |
| **B05** | Booking Management | POST `/bookings` (Create new booking) | Status 201 with message "Booking created successfully" and initial status `pending` | Status 201, message: "Booking created successfully", status automatically `pending` | **PASS** |
| **B06** | Booking Management | PATCH `/bookings/:id/status` (`pending` ➔ `approved`) | Status 200 with message "Booking status updated successfully" and status `approved` | Status 200, message: "Booking status updated successfully", status `approved` | **PASS** |
| **T01** | Twist Rule | PATCH status (`approved` ➔ `done`) | Status 200 with status updated to `done` | Status 200, status updated to `done` | **PASS** |
| **T02** | Twist Rule | PATCH status (`done` ➔ `approved`) | Status 400 with error "Invalid status change" (backward transition rejected) | Status 400, error: "Invalid status change" | **PASS** |
| **T03** | Twist Rule | PATCH status (`pending` ➔ `done`) | Status 400 with error "Invalid status change" and record unchanged in DB | Status 400, error: "Invalid status change", DB verification confirmed status remains `pending` | **PASS** |
| **E01** | Error Testing | GET `/unknown-route` | Status 404 with route not found message and `success: false` | Status 404, message: "Route not found: GET /unknown-route" | **PASS** |
| **E02** | Error Testing | GET `/gamers/999999` (Nonexistent ID) | Status 404 with message "Gamer not found" | Status 404, message: "Gamer not found" | **PASS** |
| **E03** | Error Testing | GET `/gamers/invalid_id` (Invalid ID format) | Status 400 with message "Invalid gamer ID" | Status 400, message: "Invalid gamer ID" | **PASS** |
| **E04** | Error Testing | POST `/gamers` missing name field | Status 400 with message "Gamer name is required" | Status 400, message: "Gamer name is required" | **PASS** |
| **E05** | Error Testing | POST `/gamers` invalid email format | Status 400 with message "A valid email is required" | Status 400, message: "A valid email is required" | **PASS** |
| **E06** | Error Testing | POST `/gamers` duplicate email | Status 409 with message "Email already registered" | Status 409, message: "Email already registered" | **PASS** |
| **E07** | Error Testing | GET `/consoles/999999` (Nonexistent ID)| Status 404 with message "Console not found" | Status 404, message: "Console not found" | **PASS** |
| **E08** | Error Testing | POST `/consoles` missing platform | Status 400 with message "Console platform is required" | Status 400, message: "Console platform is required" | **PASS** |
| **E09** | Error Testing | POST `/bookings` nonexistent `gamer_id` | Status 404 with error "Gamer not found" (FK check) | Status 404, error: "Gamer not found" | **PASS** |
| **E10** | Error Testing | POST `/bookings` nonexistent `console_id`| Status 404 with error "Console not found" (FK check)| Status 404, error: "Console not found" | **PASS** |
| **E11** | Error Testing | GET `/bookings?status=invalid_status` | Status 400 with error "Invalid booking status" | Status 400, error: "Invalid booking status" | **PASS** |
| **E12** | Error Testing | POST `/gamers` with malformed JSON body | Status 400 with message "Invalid JSON request body" | Status 400, message: "Invalid JSON request body" | **PASS** |

---

## 4. Deep-Dive: Twist Rule Verification

The assignment stipulates a mandatory business logic rule governing the booking lifecycle:

```text
    ┌───────────────┐
    │  NEW BOOKING  │
    └───────┬───────┘
            │  (automatic default)
            ▼
    ┌───────────────┐
    │    PENDING    │
    └───────┬───────┘
            │  (valid PATCH)
            ▼
    ┌───────────────┐
    │   APPROVED    │
    └───────┬───────┘
            │  (valid PATCH)
            ▼
    ┌───────────────┐
    │     DONE      │
    └───────────────┘
```

### Verified Test Cases:
1. **Automatic Initialization (B05):** Creating a booking with `POST /bookings` produces status `pending` immediately without client intervention.
2. **Pending to Approved (B06):** Transitioning `pending` ➔ `approved` returns HTTP `200 OK` and persists `approved` in SQLite.
3. **Approved to Done (T01):** Transitioning `approved` ➔ `done` returns HTTP `200 OK` and persists `done` in SQLite.
4. **Rejection of Skip Jump (T03):** Attempting `pending` ➔ `done` is rejected with HTTP `400 Bad Request` (`"Invalid status change"`). Database query confirmed that the record remained strictly `pending`.
5. **Rejection of Backward Flow (T02):** Attempting `done` ➔ `approved` is rejected with HTTP `400 Bad Request` (`"Invalid status change"`).
6. **Rejection of Arbitrary States:** Attempting transitions such as `done` ➔ `pending` or any non-whitelisted status is rejected with HTTP `400 Bad Request`.

---

## 5. Summary of Test Execution

| Module Category | Executed Tests | Passed | Failed | Untested | Pass Rate |
|---|---:|---:|---:|---:|---:|
| **Server Module** | 2 | 2 | 0 | 0 | 100% |
| **Gamer Management Module** | 5 | 5 | 0 | 0 | 100% |
| **Console Management Module** | 7 | 7 | 0 | 0 | 100% |
| **Booking Management Module** | 6 | 6 | 0 | 0 | 100% |
| **Twist Rule Verification** | 3 | 3 | 0 | 0 | 100% |
| **Error Handling & Validation** | 12 | 12 | 0 | 0 | 100% |
| **Total** | **35** | **35** | **0** | **0** | **100%** |

---

## 6. Testing Evidence and Artifacts

1. **Postman Collection:** Exported and validated at `documentation/postman/GameZone_Arcade_API.postman_collection.json`.
2. **Visual Proof Screenshots:** 24 organized execution screenshots stored in:
   - `documentation/Screenshots/Server/`
   - `documentation/Screenshots/Gamer_Management/`
   - `documentation/Screenshots/Console_Management/`
   - `documentation/Screenshots/Booking_Management/`
   - `documentation/Screenshots/Error_Testing/`
3. **Automated Verification:** All 35 tests verified programmatically with real SQLite database transactions.
