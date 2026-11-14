# 🎮 GameZone Arcade – Backend API

**Group:** LG-01
**Project Type:** Backend Development Group Assignment
**Technology:** Node.js, Express.js, SQLite
**Database Package:** better-sqlite3
**API Testing:** Postman
**Version Control:** Git and GitHub

## Project Metadata

| Field | Details |
|---|---|
| **Group Number** | LG-01 |
| **Project Name** | GameZone Arcade Backend |
| **Team Size** | 6 Members |
| **Project Type** | Group Project / Course Assignment |
| **Domain** | Backend Web Development & REST APIs |
| **Course** | Backend Development Fundamentals |
| **Study Level** | Undergraduate (UG) |
| **Year & Term** | II Year & II Term |
| **Class & Section** | AIDE - 2B & 313 |
| **Faculty** | Yugandhar Gurjalwar |
| **Technologies** | Node.js, Express.js, SQLite, better-sqlite3 |
| **Testing Tool** | Postman |
| **Version Control** | Git & GitHub |
| **Submission Date** | 15-11-2026 |
| **Demo Date** | 16-11-2026 |

## Team Members and Contributions

| S.No. | Team Member Name | Registration Number | Assigned Role | Responsibilities |
|:---:|---|:---:|---|---|
| 1 | **N. Sri Vardhan** | 252U1R5110 | Express Server and Routes | Setup Express app, configure routing architecture, implement middleware, and handle server-level error responses. |
| 2 | **R. Praisy** | 252U1R5127 | Database Management | Design relational schema, establish foreign key constraints, manage SQLite connections via `better-sqlite3`, and seed initial data. |
| 3 | **M. Manoj** | 252U1R5106 | REST API Development | Implement full CRUD operations for Gamers and Consoles, develop booking query endpoints, and execute SQL JOIN queries. |
| 4 | **P. Mahitha** | 252U1R5121 | Validation and Search | Implement request payload validation, email format/uniqueness checks, console platform search, and status filtering. |
| 5 | **R. Joel** | 252U1R5125 | Booking Workflow and Twist Rule | Implement booking creation, manage booking lifecycle states, and enforce the strict Twist Rule state-machine transitions. |
| 6 | **S. Pardhu Naidu** | 252U1R5128 | Postman Testing and Documentation (Lead) | Design automated Postman test suite (`pm.test`), verify all 35 test cases, author API documentation and testing reports, and oversee final GitHub submission. |

---|---|
| Group Number | LG-01 |
| Project Name | GameZone Arcade |
| Team Size | 6 Members |
| Project Type | Group Assignment |
| Domain | Backend Development |
| Course | Backend Development Fundamentals |
| Study Level | Undergraduate (UG) |
| Year & Term | II Year & II Term |
| Class & Section | AIDE - 2B & 313 |
| Faculty | Yugandhar Gurjalwar |
| Technologies | Node.js, Express.js, SQLite, better-sqlite3 |
| Testing Tool | Postman |
| Version Control | Git & GitHub |
| Submission Date | 15-11-2026 |
| Demo Date | 16-11-2026 |

## Team Members and Contributions

| S.No. | Team Member Name | Registration Number | Assigned Role | Responsibilities |
|---|---|---|---|---|
| 1 | N. Sri Vardhan | 252U1R5110| Express Server and Routes | Server setup, Express configuration, route integration, error handling |
| 2 | R . Praisy | 252U1R5127 | Database Management | SQLite database connection, schema creation, tables and seed data |
| 3 | M . Manoj | 252U1R5106 | REST API Development | Gamer and console CRUD operations, booking query endpoints |
| 4 | P . Mahita | 252U1R5121 | Validation and Search | Input validation, search functionality, error responses |
| 5 | R . Joel  | 252U1R5125 | Booking Workflow and Twist Rule | Booking creation, status updates, business rules and transition validation |
| 6 | S . Pardhu Naidu | 252U1R5128 | Postman Testing and Documentation | API testing, Postman collection, README and project documentation |

---

## 1. Project Overview

GameZone Arcade is a backend application developed as a group assignment by six members of Group LG-01. The application provides RESTful APIs for managing gamers, gaming consoles, and bookings.

The project demonstrates the practical implementation of backend development concepts, including Express server configuration, REST API development, relational database management, CRUD operations, SQL JOIN queries, input validation, search functionality, error handling, and business logic.

The application uses Node.js and Express.js to handle HTTP requests and SQLite with better-sqlite3 to store and manage application data.

Postman is used to test API endpoints, verify responses, and validate both successful and unsuccessful request scenarios.

The project was divided into six individual responsibilities to ensure that every team member contributed to a specific part of the application. All assigned tasks were completed and integrated into the final project.

---

## 2. Project Objectives

The main objectives of GameZone Arcade are:

- Develop a working backend application using Node.js and Express.js.
- Design and implement a relational SQLite database.
- Create RESTful APIs for gamers, consoles, and bookings.
- Implement Create, Read, Update, and Delete (CRUD) operations.
- Use SQL JOIN operations to retrieve related information.
- Implement input validation and meaningful error responses.
- Provide search and filtering functionality.
- Implement the assignment-specific booking status-transition rule.
- Test API functionality using Postman.
- Maintain project code and documentation using Git and GitHub.
- Develop and integrate the application collaboratively among six members.

---

## 3. Technologies Used

| Technology         | Purpose                             |
| ------------------ | ----------------------------------- |
| Node.js            | JavaScript runtime environment      |
| Express.js         | Backend web application framework   |
| SQLite             | Relational database                 |
| better-sqlite3     | Connecting Node.js with SQLite      |
| JavaScript         | Backend programming language        |
| SQL                | Database queries and operations     |
| Postman            | API testing and verification        |
| Git                | Version control                     |
| GitHub             | Code hosting and team collaboration |
| Visual Studio Code | Development environment             |

---

## 4. Main Features

### 4.1 Server Management

- Express server configuration.
- JSON request-body parsing.
- API route integration.
- Server availability checking.
- Health-check endpoint.
- 404 handling for unknown routes.
- Centralized error handling.

### 4.2 Gamer Management

- Retrieve all gamers.
- Retrieve an individual gamer by ID.
- Register a new gamer.
- Update gamer information.
- Delete a gamer.
- Validate required gamer information.
- Prevent duplicate email addresses.

### 4.3 Console Management

- Retrieve all gaming consoles.
- Retrieve a console by ID.
- Add a new gaming console.
- Update console information.
- Delete a console.
- Search consoles by platform.
- Filter consoles using query parameters.

### 4.4 Booking Management

- Create a booking between a gamer and a console.
- Retrieve all bookings.
- Retrieve individual booking information.
- Retrieve detailed booking information using SQL JOIN.
- Filter bookings using booking status.
- Update booking status.
- Validate gamer and console references.

### 4.5 Validation and Error Handling

- Validate required input fields.
- Prevent duplicate gamer email addresses.
- Handle invalid gamer and console IDs.
- Validate booking references.
- Reject invalid booking status values.
- Handle unknown API routes.
- Handle malformed JSON requests.
- Return appropriate HTTP status codes.

### 4.6 Assignment-Specific Twist Rule

The project implements a booking status-transition rule.

The allowed booking workflow is:

1. A newly created booking receives the default status `pending`.
2. A booking can move from `pending` to `approved`.
3. An approved booking can move from `approved` to `done`.
4. Invalid status transitions are rejected.
5. An invalid transition returns an HTTP `400 Bad Request` response.

This rule ensures that bookings follow the required sequence rather than allowing arbitrary status changes.

---

## 5. Database Design

The application uses SQLite with three main relational database tables.

### 5.1 Gamers Table

Stores information about registered gamers.

Typical fields:

- `id` – Unique gamer identifier.
- `name` – Name of the gamer.
- `email` – Email address of the gamer.

### 5.2 Consoles Table

Stores information about gaming consoles.

Typical fields:

- `id` – Unique console identifier.
- `name` – Name of the gaming console.
- `platform` – Console platform.

### 5.3 Bookings Table

Stores booking records and connects gamers with consoles.

Typical fields:

- `id` – Unique booking identifier.
- `gamer_id` – References a gamer.
- `console_id` – References a console.
- `status` – Current booking status.

### 5.4 Database Relationships

The database uses primary keys and foreign keys to establish relationships between tables.

- Each gamer can have multiple bookings.
- Each console can be associated with multiple bookings.
- Each booking references an existing gamer and console.
- JOIN queries combine related records to retrieve detailed booking information.

**Relationship representation:**

```text
GAMERS
  |
  | gamer_id
  |
  v
BOOKINGS
  ^
  | console_id
  |
CONSOLES
```

---

## 6. REST API Endpoints

**Base URL:**

```text
http://localhost:3000
```

### 6.1 Server Endpoints

| Method | Endpoint  | Description               |
| ------ | --------- | ------------------------- |
| GET    | `/`       | Check server availability |
| GET    | `/health` | Check backend health      |

### 6.2 Gamer Endpoints

| Method | Endpoint      | Description              |
| ------ | ------------- | ------------------------ |
| GET    | `/gamers`     | Retrieve all gamers      |
| GET    | `/gamers/:id` | Retrieve gamer by ID     |
| POST   | `/gamers`     | Create a gamer           |
| PUT    | `/gamers/:id` | Update gamer information |
| DELETE | `/gamers/:id` | Delete a gamer           |

### 6.3 Console Endpoints

| Method | Endpoint                         | Description                 |
| ------ | -------------------------------- | --------------------------- |
| GET    | `/consoles`                      | Retrieve all consoles       |
| GET    | `/consoles/:id`                  | Retrieve console by ID      |
| GET    | `/consoles/search?platform=play` | Search consoles by platform |
| GET    | `/consoles?platform=Xbox`        | Filter consoles by platform |
| POST   | `/consoles`                      | Create a console            |
| PUT    | `/consoles/:id`                  | Update console information  |
| DELETE | `/consoles/:id`                  | Delete a console            |

### 6.4 Booking Endpoints

| Method | Endpoint                   | Description                                      |
| ------ | -------------------------- | ------------------------------------------------ |
| GET    | `/bookings`                | Retrieve all bookings                            |
| GET    | `/bookings/details`        | Retrieve detailed booking information using JOIN |
| GET    | `/bookings/:id`            | Retrieve booking by ID                           |
| GET    | `/bookings?status=pending` | Filter bookings by status                        |
| POST   | `/bookings`                | Create a booking                                 |
| PATCH  | `/bookings/:id/status`     | Update booking status                            |

*Note: These endpoints describe the project's planned and documented API interface. Refer to the implemented routes for the final endpoint behavior.*

---

## 7. Project Structure

The project follows a clean, modular Node.js/Express architecture organized inside the Git repository root:

```text
GameZone-Arcade/
├── .git/
├── README.md
├── package.json
├── package-lock.json
├── server.js
├── controllers/
│   ├── bookingController.js
│   ├── consoleController.js
│   └── gamerController.js
├── database/
│   ├── db.js
│   ├── gamezone.db
│   ├── schema.sql
│   └── seed.js
├── middleware/
│   ├── errorHandler.js
│   └── notFound.js
├── routes/
│   ├── bookingRoutes.js
│   ├── consoleRoutes.js
│   └── gamerRoutes.js
└── documentation/
    ├── API_Documentation.md
    ├── Testing_Report.md
    ├── Member6_Contribution.md
    ├── postman/
    │   └── GameZone_Arcade_API.postman_collection.json
    └── Screenshots/
        ├── Server/
        ├── Gamer_Management/
        ├── Console_Management/
        ├── Booking_Management/
        └── Error_Testing/
```

---

## 8. Installation and Setup

Follow these instructions to run the GameZone Arcade backend locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (installed with Node.js)
- Git
- Postman (for running API collections and viewing automated test scripts)

### Step 1: Clone the Repository

```bash
git clone https://github.com/pardhusadhu5/GameZone-Arcade.git
```

### Step 2: Open the Project Directory

```bash
cd GameZone-Arcade
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Seed the Database

Initialize tables and populate initial test records:

```bash
npm run seed
```

### Step 5: Start the Backend Server

Start the application:

```bash
# Standard production mode
npm start

# Development mode with hot-reloading (nodemon)
npm run dev
```

The server listens on port `3000` by default.

### Step 6: Verify the Server

Open your browser or Postman and visit:

```text
GET http://localhost:3000/
GET http://localhost:3000/health
```

---

## 9. API Testing Using Postman

Postman was used to test and verify all GameZone Arcade backend APIs.

The collection is named **GameZone Arcade Backend API** and is organized into five functional folders:

1. **1. Server** (2 requests: Home route, Health check)
2. **2. Gamer Management** (5 requests: Get all, Get by ID, Create gamer, Update gamer, Delete gamer)
3. **3. Console Management** (7 requests: Get all, Get by ID, Search by platform, Filter by platform, Create console, Update console, Delete console)
4. **4. Booking Management** (7 requests: Get all, Get details with JOIN, Get by ID, Filter by status, Create booking, Update pending ➔ approved, Update approved ➔ done)
5. **5. Error Testing** (14 requests: Nonexistent IDs, malformed IDs, missing fields, email format validation, duplicate emails, foreign key validation, invalid filter status, Twist Rule rejection of direct jumps and backward transitions, malformed JSON, and 404 unknown routes)

### Automated Assertions

Every request includes automated JavaScript test scripts (`pm.test()`) asserting:
- Expected HTTP status codes (200, 201, 400, 404, 409).
- Response JSON structure and required attributes.
- Database relationship validity in JOIN queries.
- Strict enforcement of Twist Rule booking lifecycle transitions.

### Importing the Collection

1. Open Postman.
2. Click **Import**.
3. Select the file: `documentation/postman/GameZone_Arcade_API.postman_collection.json`.
4. Ensure the collection variable `{{baseUrl}}` is set to `http://localhost:3000`.
5. Execute requests individually or run the entire suite using **Postman Collection Runner**.

### Documentation References

- **API Documentation:** `documentation/API_Documentation.md`
- **Testing Report:** `documentation/Testing_Report.md`
- **Member 6 Contribution Report:** `documentation/Member6_Contribution.md`
- **Visual Evidence Screenshots:** `documentation/Screenshots/`

---

## 10. HTTP Status Codes

The backend uses HTTP status codes to communicate the result of API requests.

| Status Code | Meaning                                                  |
| ----------- | -------------------------------------------------------- |
| 200         | OK – Request completed successfully                      |
| 201         | Created – New resource created                           |
| 400         | Bad Request – Invalid request or business rule violation |
| 404         | Not Found – Requested resource or route not found        |
| 409         | Conflict – Conflict with existing data                   |
| 500         | Internal Server Error – Unexpected server-side error     |

The exact status code for each endpoint depends on its implemented response logic.

---

## 11. Team Contributions

This project was developed collaboratively by six members of **Group LG-01**. Each member was assigned specific responsibilities and contributed to the development, implementation, testing, or documentation of the GameZone Arcade API.

### Individual Contributions

### Member 1 – Express Server and Routes

- **Name:** [N.SriVardhan]
- **GitHub:** [svardhan589-cpu]
- **Assigned Task:** Express server configuration, route integration, and HTTP status code handling.

**Completed Tasks:**

- Configured the Express application.
- Implemented JSON middleware.
- Integrated API routes.
- Configured 404 and error-handling middleware.
- Verified server responses and HTTP status codes.

**Files Contributed:**

- `server.js`
- `middleware/errorHandler.js`
- `middleware/notFound.js`

### Member 2 – Database Management

- **Name:** [R.Praisy]
- **GitHub:** [praisy515-ui]
- **Assigned Task:** SQLite database design and queries.

**Completed Tasks:**

- Created gamers, consoles, and bookings tables.
- Established primary and foreign keys.
- Configured database connection.
- Implemented database queries.
- Inserted sample records.

**Files Contributed:**

- `database/db.js`
- `database/schema.sql`
- `database/seed.js`

### Member 3 – REST API Development

- **Name:** [M.Manoj]
- **GitHub:** [Manojpatel-11]
- **Assigned Task:** CRUD operations and JOIN endpoints.

**Completed Tasks:**

- Implemented Gamer CRUD endpoints.
- Implemented Console CRUD endpoints.
- Implemented booking retrieval endpoints.
- Developed SQL JOIN queries.
- Retrieved related gamer and console information.

**Files Contributed:**

- `routes/gamerRoutes.js`
- `controllers/gamerController.js`
- `routes/consoleRoutes.js`
- `controllers/consoleController.js`
- `routes/bookingQueryRoutes.js`
- `controllers/bookingQueryController.js`

### Member 4 – Validation and Search

- **Name:** [M.Mahita]
- **GitHub:** [mahitha1962007]
- **Assigned Task:** Input validation, error messages, and search.

**Completed Tasks:**

- Implemented input validation.
- Handled duplicate email errors.
- Validated required fields.
- Implemented console search.
- Implemented platform filtering.

**Files Contributed:**

- `middleware/validation.js`
- `controllers/consoleSearchController.js`
- `[Other files actually modified]`

### Member 5 – Booking Workflow and Twist Rule

- **Name:** [R.Joel]
- **GitHub:** [JoelAstro]
- **Assigned Task:** Booking creation, status management, and special status-transition rules.

**Completed Tasks:**

- Implemented booking creation.
- Set default booking status to `pending`.
- Implemented `pending` to `approved` transition.
- Implemented `approved` to `done` transition.
- Rejected invalid status transitions.
- Verified HTTP 400 error response for invalid transitions.

**Files Contributed:**

- `routes/bookingCreateRoutes.js`
- `controllers/bookingCreateController.js`
- `routes/bookingStatusRoutes.js`
- `controllers/bookingStatusController.js`

### Member 6 – Postman Testing and Documentation

- **Name:** [S.PardhuNaidu]
- **GitHub:** [pardhusadhu5]
- **Assigned Task:** API testing, Postman collection, and project documentation.

**Completed Tasks:**

- Created and organized Postman requests.
- Tested API endpoints.
- Verified positive and negative test cases.
- Added automated response assertions.
- Prepared API documentation.
- Prepared the testing report.
- Documented project setup and execution instructions.
- Organized project documentation for submission.

**Files Contributed:**

- `documentation/postman/GameZone_Arcade_API.postman_collection.json`
- `README.md`
- `documentation/API_Documentation.md`
- `documentation/Testing_Report.md`
- `documentation/Member6_Contribution.md`
- `documentation/Screenshots/`

---

## 12. Contribution Verification

Individual contributions can be verified through:

- GitHub commit history.
- Individual branches and pull requests.
- Files modified by each contributor.
- Postman test results.
- Project documentation.
- Individual project demonstrations.

Each member was responsible for completing their assigned task and contributing to the integrated backend application.

---

## 13. Learning Outcomes

Through this project, the team gained practical experience in:

- Developing backend applications using Node.js and Express.js.
- Designing relational databases using SQLite.
- Implementing CRUD operations.
- Connecting multiple database tables using JOIN queries.
- Developing RESTful API endpoints.
- Implementing input validation and error handling.
- Applying business rules in backend workflows.
- Testing APIs using Postman.
- Collaborating through Git and GitHub.
- Dividing development responsibilities and integrating individual contributions.
- Preparing technical documentation for a software project.

---

## 14. Future Enhancements

Possible future improvements include:

- Adding user authentication and authorization.
- Developing an admin dashboard.
- Adding pagination to data retrieval endpoints.
- Improving booking availability management.
- Adding automated integration tests.
- Implementing API rate limiting.
- Introducing deployment and production monitoring.
- Developing a frontend application to interact with the backend.

These enhancements can extend the current backend into a more complete gaming arcade management system.

---

## 15. Conclusion

GameZone Arcade is a collaborative backend development project completed by six members of Group LG-01.

The project demonstrates the implementation of an Express server, SQLite database management, RESTful APIs, CRUD operations, SQL JOIN queries, input validation, search functionality, error handling, and a booking status-transition rule.

The work was divided into six responsibilities covering server configuration, database management, REST API development, validation and search, booking workflow, and Postman testing with documentation.

All assigned tasks were completed and integrated into the group project. Postman was used to verify the implemented API functionality, and the supporting API documentation and testing report were prepared.

The project helped the team understand the complete backend development workflow, from database design and API implementation to testing, documentation, collaboration, and final demonstration.

---

**Project:** GameZone Arcade
**Group:** LG-01
**Team Size:** 6 Members
**Repository:** [https://github.com/pardhusadhu5/GameZone-Arcade]
**Documentation:** `documentation/`
**API Testing:** Postman
