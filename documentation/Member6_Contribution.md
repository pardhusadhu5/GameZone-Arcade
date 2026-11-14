# 👤 Member 6 Contribution Report

**Student Name:** S. Pardhu Naidu  
**Registration Number:** 252U1R5128  
**Group:** LG-01  
**Project:** GameZone Arcade Backend API  
**Assigned Responsibility:** MEMBER 6 – POSTMAN TESTING, API DOCUMENTATION, TESTING REPORT, AND FINAL SUBMISSION  
**Submission Date:** 15-11-2026  

---

## 1. Member Role and Scope of Work

As Member 6 of Group LG-01, my assigned role was **Postman Testing, API Documentation, Testing Report, and Final Submission**. 

My core responsibilities included:
1. Inspecting the integrated codebase across all group members to understand the implemented REST endpoints, database schema, and validation logic without altering other members' source code.
2. Building, refining, and exporting a fully compliant Postman API collection with environment variable support (`{{baseUrl}}`), proper request bodies, and automated Postman test assertion scripts.
3. Conducting rigorous end-to-end API testing across all 5 modules (Server, Gamer Management, Console Management, Booking Management, Error Testing).
4. Verifying the assignment-specific **Twist Rule** (`pending` ➔ `approved` ➔ `done`), ensuring invalid transitions and direct state jumps are rejected.
5. Authoring the complete technical `API_Documentation.md`.
6. Authoring the empirical `Testing_Report.md` based on verified test executions.
7. Updating the root `README.md` to accurately represent the real repository structure, team contributions, and setup guides.
8. Organizing testing evidence screenshots into standard module folders.
9. Preparing and staging the final Git submission for push to GitHub.

---

## 2. Detailed Work Completed

### 2.1 Postman Collection Preparation
- Designed and authored the standard collection `GameZone_Arcade_API.postman_collection.json` compliant with Postman Collection Schema v2.1.0.
- Implemented `{{baseUrl}}` (default: `http://localhost:3000`) across all 35 requests.
- Structured the collection into 5 modular folders:
  1. `1. Server` (2 requests)
  2. `2. Gamer Management` (5 requests)
  3. `3. Console Management` (7 requests)
  4. `4. Booking Management` (7 requests)
  5. `5. Error Testing` (14 requests)
- Eliminated generic default names (e.g., "New Request") and replaced them with descriptive labels specifying the intent and parameters.
- Attached Postman test scripts (`pm.test()`) asserting HTTP status codes (200, 201, 400, 404, 409) and verifying essential response properties and schemas.

### 2.2 Complete API Testing Execution
- Tested all 35 test cases spanning every module:
  - **Server (S01–S02):** Checked root home message and database health status.
  - **Gamer Management (G01–G05):** Verified full CRUD cycle (retrieve all, retrieve by ID, register new gamer, update gamer name/email, delete gamer).
  - **Console Management (C01–C07):** Verified full CRUD cycle, plus case-insensitive partial substring search (`GET /consoles/search?platform=play`) and exact platform filtering (`GET /consoles?platform=Xbox`).
  - **Booking Management (B01–B06):** Verified booking retrieval, single booking lookup, relational `JOIN` query combining gamer and console data (`GET /bookings/details`), status filtering (`GET /bookings?status=pending`), and booking creation with automatic `pending` assignment.

### 2.3 Twist Rule Verification
- Verified the mandatory status progression constraint:
  - Confirmed that every newly created booking initializes strictly with status `pending`.
  - Confirmed valid transition from `pending` ➔ `approved` (HTTP 200 OK).
  - Confirmed valid transition from `approved` ➔ `done` (HTTP 200 OK).
  - Confirmed rejection of illegal direct jump `pending` ➔ `done` (HTTP 400 Bad Request, `"Invalid status change"`).
  - Verified that the record in the SQLite database remains unaltered when an illegal transition is attempted.
  - Confirmed rejection of backward transition `done` ➔ `approved` (HTTP 400 Bad Request).

### 2.4 Error Handling and Edge-Case Testing (E01–E12)
- Tested non-numeric / malformed IDs (`GET /gamers/invalid_id`) returning HTTP 400.
- Tested nonexistent entity IDs (`GET /gamers/999999`, `GET /consoles/999999`) returning HTTP 404.
- Tested input validation for missing required fields (omitted gamer name, omitted console platform) returning HTTP 400.
- Tested email format validation regex returning HTTP 400.
- Tested unique constraint violation on duplicate email registration returning HTTP 409.
- Tested foreign key checks preventing bookings with nonexistent gamers or consoles returning HTTP 404.
- Tested invalid booking status query filters returning HTTP 400.
- Tested malformed JSON request bodies returning HTTP 400 via Express error middleware.
- Tested unknown API routes returning HTTP 404.

### 2.5 API Documentation Authoring
- Created `documentation/API_Documentation.md` detailing:
  - Technical architecture and dependencies.
  - Complete installation and step-by-step startup instructions.
  - Exhaustive endpoint catalog with HTTP verbs, routes, purposes, required headers/parameters, sample request payloads, and real JSON response schemas.
  - Status code explanation matrix.

### 2.6 Testing Report Compilation
- Created `documentation/Testing_Report.md` providing:
  - Complete testing environment documentation.
  - 35-row structured table: `| Test ID | Module | Test Case | Expected Result | Actual Result | Status |`.
  - In-depth Twist Rule analysis.
  - Summary metrics: 35 tests executed, 35 passed, 0 failed, 0 untested.

### 2.7 Root README.md Modernization
- Updated the root `README.md` to:
  - Fix inaccurate folder structures from earlier drafts.
  - Provide an accurate directory layout reflecting the actual Git repository.
  - Document API endpoints, Twist Rule mechanics, Postman testing procedures, and team member role allocations.

### 2.8 Screenshot Organization
- Curated and organized 24 visual execution proof screenshots into five dedicated subdirectories:
  - `documentation/Screenshots/Server/`
  - `documentation/Screenshots/Gamer_Management/`
  - `documentation/Screenshots/Console_Management/`
  - `documentation/Screenshots/Booking_Management/`
  - `documentation/Screenshots/Error_Testing/`

---

## 3. Challenges Faced and Solutions

1. **Nested Directory Structure:**
   - *Challenge:* The repository contained a nested directory where git tracked files at `GameZone-Arcade/GameZone-Arcade/` while some draft documentation was placed in an outer directory.
   - *Solution:* Located the true Git repository containing `.git`, verified `git remote`, and ensured all final documentation, screenshots, and collections were organized inside the actual Git repository root.

2. **Foreign Key Integrity during Deletion Testing:**
   - *Challenge:* Deleting seeded records (`gamer_id: 1` or `console_id: 1`) triggers SQLite foreign key integrity constraints because active bookings reference them.
   - *Solution:* Crafted dedicated test records dynamically for create-update-delete verification, ensuring seeded demo data remained intact and foreign key constraint behavior was properly validated.

3. **Twist Rule State Isolation:**
   - *Challenge:* Testing invalid transitions requires verifying that the database record is not mutated when a rejected transition is attempted.
   - *Solution:* Executed immediate follow-up `GET` queries to inspect the actual database state before and after invalid `PATCH` calls, proving zero database corruption.

---

## 4. Key Learning Outcomes

- Gained hands-on expertise with REST API architecture, HTTP methods, and semantic status code conventions.
- Deepened understanding of relational integrity, SQLite transactions, and foreign key constraints in Node.js.
- Mastered Postman collection design, environment variable parameterization (`{{baseUrl}}`), and automated test script assertions.
- Strengthened software quality assurance methodologies by designing rigorous edge-case, validation, and state-machine tests.
- Developed practical collaborative engineering discipline by respecting team boundaries, preserving peer code, and producing high-standard technical documentation.
