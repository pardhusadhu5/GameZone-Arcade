# 🎮 Member 6 Contribution Report – GameZone Arcade

**Project Name:** GameZone Arcade Backend  
**Group Number:** LG-01  
**Team Member:** S. Pardhu Naidu  
**Registration Number:** 252U1R5128  
**Assigned Role:** Member 6 – Postman API Testing, API Documentation, Testing Report, and Final Submission (Lead)  
**Submission Date:** 15-11-2026  
**Repository:** [https://github.com/pardhusadhu5/GameZone-Arcade](https://github.com/pardhusadhu5/GameZone-Arcade)  

---

## 1. Project Overview

GameZone Arcade is a collaborative RESTful backend application developed for a gaming arcade environment using **Node.js**, **Express.js**, and **SQLite** (via `better-sqlite3`). The system is architected to handle gamer profile administration, gaming console inventory, and structured booking workflows governed by strict business logic rules.

The project was executed by six team members of Group **LG-01**, each assigned a distinct modular responsibility:
- **Member 1 (N. Sri Vardhan):** Express Server setup, middleware configuration, and routing integration.
- **Member 2 (R. Praisy):** SQLite schema creation, database connectivity, and seed data initialization.
- **Member 3 (M. Manoj):** REST API development and controller logic for Gamers, Consoles, and Booking queries.
- **Member 4 (P. Mahitha):** Input validation middleware, error responses, and console platform search.
- **Member 5 (R. Joel):** Booking creation workflow, status lifecycle management, and assignment Twist Rule.
- **Member 6 (S. Pardhu Naidu):** Postman API testing, collection engineering, comprehensive API documentation, testing report, screenshot evidence curation, and GitHub submission management.

---

## 2. Individual Role – Member 6

As **Member 6**, my primary role is **Postman API Testing, API Documentation, Testing Report, and Final Submission**. 

While Members 1–5 focused on implementing server architecture, database schemas, controller logic, validation, and workflow state machines, my duty was to independently inspect the unified backend, develop an automated test harness, systematically verify every positive and negative execution path, author complete project documentation, curate testing proof, and package the repository for final submission.

---

## 3. Responsibilities

My assigned responsibilities encompassed 12 core areas:

1. **Postman API Testing:** Executing manual and automated HTTP requests across all backend endpoints.
2. **Creating and Organizing Postman Collections:** Designing, structuring, and exporting a standardized Postman collection.
3. **Testing Server and Health Check Endpoints:** Verifying server availability, runtime responses, and database connectivity.
4. **Testing Gamer Management APIs:** Validating full CRUD operations (`GET`, `POST`, `PUT`, `DELETE`) for gamer entities.
5. **Testing Console Management APIs:** Validating CRUD operations, query-based platform filtering, and partial search.
6. **Testing Booking Management APIs:** Validating booking creation, retrieval, status updates, and multi-table SQL `JOIN` details.
7. **Testing Successful API Responses:** Verifying HTTP `200 OK` and `201 Created` payloads, headers, and schemas.
8. **Testing Invalid Inputs and Error Responses:** Subjecting routes to invalid types, empty values, missing keys, and malformed JSON.
9. **Verifying HTTP Status Codes:** Ensuring strict compliance with REST standards (`200`, `201`, `400`, `404`, `409`, `500`).
10. **Preparing API Documentation:** Writing complete technical endpoint references in `documentation/API_Documentation.md`.
11. **Preparing Project README Documentation:** Updating the root `README.md` with accurate setup, architecture, and team metadata.
12. **Recording Test Results and Identifying Edge-Case Bugs:** Logging test execution outputs, state-machine transitions, and defect reports in `documentation/Testing_Report.md`.

---

## 4. Tools and Technologies Used

| Tool / Technology | Purpose |
|---|---|
| **Postman (v11.x)** | API design, manual request execution, response inspection, and test assertion scripting |
| **Postman Collection Runner** | Bulk automated regression test execution across all folders |
| **Node.js (v18+)** | Backend runtime environment and custom in-process automated test runner |
| **Express.js (v5)** | Web application framework handling routing and middleware execution |
| **SQLite3 & better-sqlite3** | Local database inspection, query verification, and data integrity checks |
| **Git & GitHub** | Version control, branch history management, conflict resolution, and final release pushing |
| **Markdown (GFM)** | Technical documentation authoring for API specs, contribution reports, and testing logs |

---

## 5. Postman Collection Structure

The official collection is named **GameZone Arcade Backend API** and exported to:
`documentation/postman/GameZone_Arcade_API.postman_collection.json`

The collection utilizes a collection-level variable:
- `{{baseUrl}}`: Set to `http://localhost:3000`

### Modular Hierarchy (35 Total Requests)

```text
GameZone Arcade Backend API/
├── 1. Server/                              (2 requests)
│   ├── Home Route                          [GET  {{baseUrl}}/]
│   └── Health Check                        [GET  {{baseUrl}}/health]
├── 2. Gamer Management/                    (5 requests)
│   ├── Get All Gamers                      [GET  {{baseUrl}}/gamers]
│   ├── Get Gamer By ID                     [GET  {{baseUrl}}/gamers/:id]
│   ├── Create Gamer                        [POST {{baseUrl}}/gamers]
│   ├── Update Gamer                        [PUT  {{baseUrl}}/gamers/:id]
│   └── Delete Gamer                        [DELETE {{baseUrl}}/gamers/:id]
├── 3. Console Management/                  (7 requests)
│   ├── Get All Consoles                    [GET  {{baseUrl}}/consoles]
│   ├── Get Console By ID                   [GET  {{baseUrl}}/consoles/:id]
│   ├── Search Consoles By Platform         [GET  {{baseUrl}}/consoles/search?platform=play]
│   ├── Filter Consoles By Platform         [GET  {{baseUrl}}/consoles?platform=Xbox]
│   ├── Create Console                      [POST {{baseUrl}}/consoles]
│   ├── Update Console                      [PUT  {{baseUrl}}/consoles/:id]
│   └── Delete Console                      [DELETE {{baseUrl}}/consoles/:id]
├── 4. Booking Management/                  (7 requests)
│   ├── Get All Bookings                    [GET  {{baseUrl}}/bookings]
│   ├── Get Booking Details using JOIN      [GET  {{baseUrl}}/bookings/details]
│   ├── Get Booking By ID                   [GET  {{baseUrl}}/bookings/:id]
│   ├── Filter Bookings By Status           [GET  {{baseUrl}}/bookings?status=pending]
│   ├── Create Booking (Auto-Pending)       [POST {{baseUrl}}/bookings]
│   ├── Update Status: Pending to Approved  [PATCH {{baseUrl}}/bookings/:id/status]
│   └── Update Status: Approved to Done     [PATCH {{baseUrl}}/bookings/:id/status]
└── 5. Error Testing/                       (14 requests)
    ├── Unknown API Route                   [GET  {{baseUrl}}/unknown-route]
    ├── Invalid Gamer ID Format             [GET  {{baseUrl}}/gamers/invalid_id]
    ├── Nonexistent Gamer ID                [GET  {{baseUrl}}/gamers/999999]
    ├── Missing Gamer Required Name         [POST {{baseUrl}}/gamers]
    ├── Invalid Gamer Email Format          [POST {{baseUrl}}/gamers]
    ├── Duplicate Gamer Email               [POST {{baseUrl}}/gamers]
    ├── Nonexistent Console ID              [GET  {{baseUrl}}/consoles/999999]
    ├── Missing Console Platform Field      [POST {{baseUrl}}/consoles]
    ├── Booking with Nonexistent Gamer ID   [POST {{baseUrl}}/bookings]
    ├── Booking with Nonexistent Console ID [POST {{baseUrl}}/bookings]
    ├── Invalid Booking Status Filter       [GET  {{baseUrl}}/bookings?status=unknown]
    ├── Twist Rule: Reject Pending to Done  [PATCH {{baseUrl}}/bookings/:id/status]
    ├── Twist Rule: Reject Done to Approved [PATCH {{baseUrl}}/bookings/:id/status]
    └── Malformed JSON Request Body         [POST {{baseUrl}}/gamers]
```

Every request is equipped with JavaScript assertion tests (`pm.test()`) that automatically assert status codes and inspect JSON schema structures.

---

## 6. API Testing Activities

### 6.1 Server and Health Check Endpoints

| Method | Endpoint URL | Purpose | Request Body | Expected Status | Actual Result |
|---|---|---|---|:---:|:---:|
| `GET` | `{{baseUrl}}/` | Verify server online status and welcome message | None | `200 OK` | **PASS** – Returns `{ "message": "Welcome to GameZone Arcade", "status": "Running" }` |
| `GET` | `{{baseUrl}}/health` | Verify application operational health and SQLite connectivity | None | `200 OK` | **PASS** – Returns `{ "status": "healthy", "service": "GameZone Arcade Backend", "database": "connected" }` |

### 6.2 Gamer Management Endpoints

| Method | Endpoint URL | Purpose | Request Body | Expected Status | Actual Result |
|---|---|---|---|:---:|:---:|
| `GET` | `{{baseUrl}}/gamers` | Retrieve all registered gamers | None | `200 OK` | **PASS** – Returns `{ count: 5, gamers: [...] }` |
| `GET` | `{{baseUrl}}/gamers/1` | Retrieve single gamer by primary ID | None | `200 OK` | **PASS** – Returns gamer object (`gamer_id: 1`) |
| `POST` | `{{baseUrl}}/gamers` | Register a new unique gamer profile | `{"name":"Marcus Phoenix","email":"marcus@example.com"}` | `201 Created` | **PASS** – Gamer created with auto-incremented ID |
| `PUT` | `{{baseUrl}}/gamers/:id` | Update existing gamer's name and email | `{"name":"Marcus Fenix","email":"marcus.fenix@example.com"}` | `200 OK` | **PASS** – Record updated and returned in response |
| `DELETE` | `{{baseUrl}}/gamers/:id` | Remove an unbooked gamer from the database | None | `200 OK` | **PASS** – Returns `{ "message": "Gamer deleted successfully" }` |

### 6.3 Console Management Endpoints

| Method | Endpoint URL | Purpose | Request Body | Expected Status | Actual Result |
|---|---|---|---|:---:|:---:|
| `GET` | `{{baseUrl}}/consoles` | Retrieve all gaming console stations | None | `200 OK` | **PASS** – Returns array of consoles with total count |
| `GET` | `{{baseUrl}}/consoles/1` | Retrieve a specific console station by ID | None | `200 OK` | **PASS** – Returns console object (`console_id: 1`) |
| `GET` | `{{baseUrl}}/consoles/search?platform=play` | Search consoles by partial platform match | None | `200 OK` | **PASS** – Case-insensitive search returns PlayStation stations |
| `GET` | `{{baseUrl}}/consoles?platform=Xbox` | Filter consoles by exact platform name | None | `200 OK` | **PASS** – Returns only consoles with platform `Xbox` |
| `POST` | `{{baseUrl}}/consoles` | Add a new console unit to the arcade | `{"name":"Nintendo Switch OLED","platform":"Nintendo"}` | `201 Created` | **PASS** – Console station persisted successfully |
| `PUT` | `{{baseUrl}}/consoles/:id` | Update console name or platform | `{"name":"Nintendo Switch Pro","platform":"Nintendo"}` | `200 OK` | **PASS** – Station specifications updated |
| `DELETE` | `{{baseUrl}}/consoles/:id` | Remove an unbooked console unit | None | `200 OK` | **PASS** – Console record removed |

### 6.4 Booking Management Endpoints

| Method | Endpoint URL | Purpose | Request Body | Expected Status | Actual Result |
|---|---|---|---|:---:|:---:|
| `GET` | `{{baseUrl}}/bookings` | Retrieve all arcade bookings | None | `200 OK` | **PASS** – Returns list of all bookings |
| `GET` | `{{baseUrl}}/bookings/details` | Retrieve bookings with multi-table relational `JOIN` | None | `200 OK` | **PASS** – Each record contains `gamer_name`, `console_name`, `platform` |
| `GET` | `{{baseUrl}}/bookings/1` | Retrieve a single booking by ID | None | `200 OK` | **PASS** – Returns complete booking details for ID 1 |
| `GET` | `{{baseUrl}}/bookings?status=pending` | Filter bookings by status parameter | None | `200 OK` | **PASS** – Returns only bookings matching `pending` |
| `POST` | `{{baseUrl}}/bookings` | Create new booking (verifies auto-default status) | `{"gamer_id": 1, "console_id": 1}` | `201 Created` | **PASS** – Initial status is automatically set to `pending` |
| `PATCH` | `{{baseUrl}}/bookings/:id/status` | Update status: `pending` ➔ `approved` | `{"status": "approved"}` | `200 OK` | **PASS** – Status successfully updated to `approved` |
| `PATCH` | `{{baseUrl}}/bookings/:id/status` | Update status: `approved` ➔ `done` | `{"status": "done"}` | `200 OK` | **PASS** – Status successfully updated to `done` |

---

## 7. HTTP Status Code Verification

I systematically verified that the backend returns standard, semantically accurate HTTP status codes:

- **200 OK:** Returned on successful data retrieval (`GET`), record modifications (`PUT`), partial status transitions (`PATCH`), and entity deletions (`DELETE`).
- **201 Created:** Returned when a new entity is inserted (`POST /gamers`, `POST /consoles`, `POST /bookings`).
- **400 Bad Request:** Returned when client input fails validation, including missing required fields, invalid email format, malformed numeric IDs, unsupported status filters, and invalid Twist Rule state transitions.
- **404 Not Found:** Returned when querying nonexistent primary keys (`/gamers/999999`, `/consoles/999999`, `/bookings/999999`), invalid foreign keys in bookings, or requesting unmapped URLs (`/unknown-route`).
- **409 Conflict:** Returned on database constraint violations, including duplicate gamer email registration and attempting to delete a gamer or console referenced by active bookings.
- **500 Internal Server Error:** Managed defensively by centralized error-handling middleware (`errorHandler.js`).

---

## 8. Error and Validation Testing

To ensure production-grade resilience, I engineered 14 dedicated error and negative test scenarios:

| Test Scenario | Method & Endpoint | Tested Condition | Expected Response | Actual Status |
|---|---|---|---|:---:|
| **Unknown Route** | `GET /unknown-route` | Access unmapped path | `404 Not Found` (`Route not found`) | **PASS (404)** |
| **Invalid ID Type** | `GET /gamers/invalid_id` | Pass alphabetic string for integer ID | `400 Bad Request` (`Invalid gamer ID`) | **PASS (400)** |
| **Nonexistent Gamer** | `GET /gamers/999999` | Query primary key that does not exist | `404 Not Found` (`Gamer not found`) | **PASS (404)** |
| **Missing Gamer Name** | `POST /gamers` | Omit `name` attribute in payload | `400 Bad Request` (`Gamer name is required`) | **PASS (400)** |
| **Invalid Email Regex** | `POST /gamers` | Supply malformed email (`"not-an-email"`) | `400 Bad Request` (`A valid email is required`) | **PASS (400)** |
| **Duplicate Email** | `POST /gamers` | Attempt duplicate registration with existing email | `409 Conflict` (`Email already registered`) | **PASS (409)** |
| **Nonexistent Console** | `GET /consoles/999999` | Query primary key that does not exist | `404 Not Found` (`Console not found`) | **PASS (404)** |
| **Missing Console Platform** | `POST /consoles` | Omit `platform` attribute in payload | `400 Bad Request` (`Console platform is required`) | **PASS (400)** |
| **Foreign Key (Gamer)** | `POST /bookings` | Book with invalid `gamer_id: 999999` | `404 Not Found` (`Gamer not found`) | **PASS (404)** |
| **Foreign Key (Console)** | `POST /bookings` | Book with invalid `console_id: 999999` | `404 Not Found` (`Console not found`) | **PASS (404)** |
| **Invalid Status Filter** | `GET /bookings?status=foo` | Query filter using non-whitelisted status | `400 Bad Request` (`Invalid booking status`) | **PASS (400)** |
| **Twist Rule Jump Rejection** | `PATCH /bookings/:id/status` | Attempt illegal direct jump `pending` ➔ `done` | `400 Bad Request` (`Invalid status change`) | **PASS (400)** |
| **Twist Rule Backwards Rejection** | `PATCH /bookings/:id/status` | Attempt illegal reversal `done` ➔ `approved` | `400 Bad Request` (`Invalid status change`) | **PASS (400)** |
| **Malformed JSON** | `POST /gamers` | Send syntax-broken JSON body (`{ "name": `) | `400 Bad Request` (`Invalid JSON request body`) | **PASS (400)** |

### Twist Rule State Machine Verification

The assignment requires enforcing the lifecycle sequence:
```text
[NEW BOOKING] ──> pending ──> approved ──> done
```
I verified that:
1. `pending` ➔ `approved` succeeds (`200 OK`).
2. `approved` ➔ `done` succeeds (`200 OK`).
3. Direct jump `pending` ➔ `done` is rejected (`400 Bad Request`). Follow-up `GET` checks confirmed the database record remained strictly `pending`.
4. Reversal `done` ➔ `approved` is rejected (`400 Bad Request`).
5. Reversal `done` ➔ `pending` is rejected (`400 Bad Request`).

---

## 9. Documentation Work

My documentation contributions delivered clear, comprehensive, and professional artifacts:

1. **`README.md` Modernization:**
   - Corrected inaccurate fictional folder structures (`backend/`) from early drafts to match the true repository root.
   - Added complete setup, seed, startup, and testing instructions.
   - Authored the structured **Project Metadata Table** and **Team Members & Contributions Table**.
2. **`documentation/API_Documentation.md`:**
   - Authored an exhaustive technical reference covering all 20 API endpoints, request bodies, query parameters, success payloads, and error responses.
3. **`documentation/Testing_Report.md`:**
   - Compiled an empirical testing report featuring a standardized 35-row verification matrix (`Test ID | Module | Test Case | Expected Result | Actual Result | Status`).
4. **`Member6_Contribution.md`:**
   - Authored individual contribution reports strictly reflecting Member 6 responsibilities.
5. **Screenshot Evidence Organization:**
   - Curated 24 high-resolution Postman execution screenshots organized into dedicated subdirectories:
     - `documentation/Screenshots/Server/` (2 screenshots)
     - `documentation/Screenshots/Gamer_Management/` (6 screenshots)
     - `documentation/Screenshots/Console_Management/` (7 screenshots)
     - `documentation/Screenshots/Booking_Management/` (7 screenshots)
     - `documentation/Screenshots/Error_Testing/` (6 screenshots)

---

## 10. Challenges Faced

1. **Untracked Working Tree Conflicts during Git Synchronization:**
   - *Problem:* Peer members pushed updates to `origin/main` that tracked previously untracked files locally (such as `controllers/` and `routes/`), causing merge blocks.
   - *Solution:* Safely archived working files to a backup scratch directory, fast-forwarded `origin/main`, re-applied clean modifications, and confirmed zero file corruption.
2. **Safeguarding Seed Data during Deletion Testing:**
   - *Problem:* Seeded database entities (`gamer_id: 1`, `console_id: 1`) have active bookings, triggering SQLite foreign key constraint failures upon deletion.
   - *Solution:* Developed isolated test scripts that dynamically instantiate and tear down disposable test records (`G03`/`G05` and `C05`/`C07`), ensuring seed data remained intact while testing both successful deletion and foreign key constraint blocking.
3. **Verifying Database Immutability on Twist Rule Violations:**
   - *Problem:* Confirming that a rejected `PATCH` request does not silently mutate database state.
   - *Solution:* Executed immediate sequential `GET` requests directly following failed `PATCH` requests to confirm byte-for-byte state preservation in SQLite.

---

## 11. Solutions and Improvements

- **Collection Variable Standardization:** Replaced hardcoded `http://localhost:3000` strings across all 35 requests with `{{baseUrl}}`, making the suite adaptable to cloud deployments or different local ports.
- **Automated Response Assertions:** Embedded JavaScript test logic inside every request in the Postman collection to enable one-click continuous regression testing via Collection Runner.
- **Centralized Documentation Placement:** Consolidated disparate draft files into the Git repository root (`documentation/`), establishing an intuitive, clean directory structure for grading.

---

## 12. Learning Outcomes

- **RESTful API Quality Assurance:** Mastered systematic black-box and white-box API verification, input boundary testing, and HTTP status code semantics.
- **Advanced Postman Engineering:** Gained proficiency in Postman collection structuring, dynamic variable templating, and automated JavaScript assertion scripting (`pm.response`, `pm.expect`).
- **Relational Integrity & Business Logic:** Deepened practical understanding of relational database constraints, foreign key enforcement, multi-table `JOIN` queries, and state-machine business workflows.
- **Technical Writing & Collaboration:** Developed skills in writing industry-standard API documentation, structuring multi-contributor project repositories, and managing clean Git branch histories.

---

## 13. Individual Contribution Summary

| Metric | Recorded Value |
|---|---|
| **Assigned Role** | Member 6 – Postman Testing, API Documentation, and Submission |
| **Total Postman Requests Authored** | **35 requests** across 5 folders |
| **Total Test Scenarios Executed** | **35 test cases** |
| **Tests Passed** | **35 / 35** (100% pass rate) |
| **Tests Failed** | **0** |
| **Tests Untested** | **0** |
| **Twist Rule Verification** | **Verified & Enforced** (All 5 state rules validated) |
| **Visual Evidence Screenshots** | **24 screenshots** organized across 5 folders |
| **Documentation Files Authored** | `Member6_Contribution.md`, `README.md`, `API_Documentation.md`, `Testing_Report.md` |
| **Peer Source Code Modified** | **None** (Preserved all source work from Members 1–5) |
| **Git Status** | Fully committed, synchronized, and verified on `main` branch |
