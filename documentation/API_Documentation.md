# 🎮 GameZone Arcade – REST API Documentation

**Project:** GameZone Arcade Backend  
**Group:** LG-01  
**Author:** Member 6 – Postman Testing, API Documentation, Testing Report, and Final Submission  
**Base URL:** `http://localhost:3000`  
**Version:** 1.0.0  

---

## 1. Project Introduction

GameZone Arcade is a robust backend RESTful API service developed using **Node.js**, **Express.js**, and **SQLite** (via `better-sqlite3`). The system is engineered to manage gaming arcade operations, including gamer profiles, gaming console stations, and structured booking workflows with strict business rules.

The system features:
- Complete CRUD operations for gamers and consoles.
- Relational foreign key enforcement and relational SQL JOIN queries for booking details.
- Comprehensive input validation and data sanitization.
- Centralized error-handling middleware for uniform client error responses.
- An assignment-specific status workflow (Twist Rule): `pending` ➔ `approved` ➔ `done`.

---

## 2. Technologies Used

| Layer / Role | Technology | Description |
|---|---|---|
| **Runtime** | Node.js (v18+) | Server-side JavaScript runtime engine |
| **Framework** | Express.js (v5) | Minimalist web application and routing framework |
| **Database** | SQLite3 | Embedded, lightweight relational database |
| **DB Driver** | better-sqlite3 | Synchronous, high-performance SQLite client for Node.js |
| **API Client & Testing** | Postman | Automated API collection testing, assertions, and runner |
| **Version Control** | Git & GitHub | Source code repository and collaborative tracking |

---

## 3. Installation, Setup, and Server Startup

### Prerequisites
- Node.js installed (v18 or higher recommended)
- Git installed

### 1. Clone or Open the Repository
```bash
git clone https://github.com/pardhusadhu5/GameZone-Arcade.git
cd GameZone-Arcade
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Initialize / Seed the SQLite Database
```bash
npm run seed
```
This runs `database/seed.js`, executing `database/schema.sql` to initialize tables (`gamers`, `consoles`, `bookings`) and populate sample data.

### 4. Start the Application Server
```bash
# Production / Standard start
npm start

# Or Development mode with hot-reloading (via nodemon)
npm run dev
```

The server starts on port `3000` by default:
```text
GameZone Arcade database connected!
Gamers, Consoles and Bookings tables initialized!
GameZone Arcade server running on port 3000
```

---

## 4. API Endpoints Overview

| Category | Method | Endpoint Path | Description |
|---|---|---|---|
| **Server** | `GET` | `/` | Root verification endpoint |
| **Server** | `GET` | `/health` | Server and SQLite database health check |
| **Gamers** | `GET` | `/gamers` | Retrieve all registered gamers |
| **Gamers** | `GET` | `/gamers/:id` | Retrieve single gamer by primary ID |
| **Gamers** | `POST` | `/gamers` | Register a new gamer (unique email required) |
| **Gamers** | `PUT` | `/gamers/:id` | Update existing gamer's name and email |
| **Gamers** | `DELETE`| `/gamers/:id` | Remove a gamer (if no active bookings exist) |
| **Consoles** | `GET` | `/consoles` | Retrieve all arcade consoles |
| **Consoles** | `GET` | `/consoles/:id` | Retrieve single console by primary ID |
| **Consoles** | `GET` | `/consoles/search?platform=:query`| Search consoles by partial platform match |
| **Consoles** | `GET` | `/consoles?platform=:name` | Filter consoles by exact platform match |
| **Consoles** | `POST` | `/consoles` | Add a new console station |
| **Consoles** | `PUT` | `/consoles/:id` | Update console name and platform |
| **Consoles** | `DELETE`| `/consoles/:id` | Remove a console station |
| **Bookings** | `GET` | `/bookings` | Retrieve all bookings |
| **Bookings** | `GET` | `/bookings/details` | Retrieve bookings with SQL JOIN data |
| **Bookings** | `GET` | `/bookings/:id` | Retrieve single booking by ID |
| **Bookings** | `GET` | `/bookings?status=:val` | Filter bookings by status (`pending`, `approved`, `done`) |
| **Bookings** | `POST` | `/bookings` | Create new booking (defaults to `pending`) |
| **Bookings** | `PATCH`| `/bookings/:id/status` | Update booking status following the Twist Rule |

---

## 5. Server Management Endpoints

### 5.1 Root Home Route
- **Method:** `GET`
- **Path:** `/`
- **Purpose:** Verifies that the server is online and accepting requests.
- **Headers:** None required.
- **Request Body:** None.

**Successful Response (200 OK):**
```json
{
  "message": "Welcome to GameZone Arcade",
  "status": "Running"
}
```

---

### 5.2 Server & Database Health Check
- **Method:** `GET`
- **Path:** `/health`
- **Purpose:** Validates application operational health and SQLite database connectivity status.
- **Request Body:** None.

**Successful Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "GameZone Arcade Backend",
  "database": "connected"
}
```

---

## 6. Gamer Management Endpoints

### 6.1 Get All Gamers
- **Method:** `GET`
- **Path:** `/gamers`
- **Purpose:** Retrieves all gamers sorted by `gamer_id`.

**Successful Response (200 OK):**
```json
{
  "count": 2,
  "gamers": [
    {
      "gamer_id": 1,
      "name": "Alex",
      "email": "alex@example.com"
    },
    {
      "gamer_id": 2,
      "name": "Sam",
      "email": "sam@example.com"
    }
  ]
}
```

---

### 6.2 Get Gamer by ID
- **Method:** `GET`
- **Path:** `/gamers/:id`
- **Parameters:** `id` (positive integer route parameter)
- **Purpose:** Retrieves a single gamer by primary key.

**Successful Response (200 OK):**
```json
{
  "gamer_id": 1,
  "name": "Alex",
  "email": "alex@example.com"
}
```

**Error Responses:**
- **400 Bad Request** (Invalid ID format):
  ```json
  {
    "message": "Invalid gamer ID"
  }
  ```
- **404 Not Found** (ID does not exist):
  ```json
  {
    "message": "Gamer not found"
  }
  ```

---

### 6.3 Create Gamer
- **Method:** `POST`
- **Path:** `/gamers`
- **Header:** `Content-Type: application/json`
- **Required Parameters:** `name` (non-empty string), `email` (valid email format, unique)

**Example Request Body:**
```json
{
  "name": "Marcus Fenix",
  "email": "marcus.fenix@example.com"
}
```

**Successful Response (201 Created):**
```json
{
  "message": "Gamer registered successfully",
  "gamer": {
    "gamer_id": 3,
    "name": "Marcus Fenix",
    "email": "marcus.fenix@example.com"
  }
}
```

**Error Responses:**
- **400 Bad Request** (Missing name):
  ```json
  {
    "message": "Gamer name is required"
  }
  ```
- **400 Bad Request** (Malformed email):
  ```json
  {
    "message": "A valid email is required"
  }
  ```
- **409 Conflict** (Duplicate email):
  ```json
  {
    "message": "Email already registered"
  }
  ```

---

### 6.4 Update Gamer
- **Method:** `PUT`
- **Path:** `/gamers/:id`
- **Header:** `Content-Type: application/json`
- **Parameters:** `id` (positive integer)
- **Required Parameters:** `name` (string), `email` (string)

**Example Request Body:**
```json
{
  "name": "Marcus Phoenix",
  "email": "marcus.phoenix@example.com"
}
```

**Successful Response (200 OK):**
```json
{
  "message": "Gamer updated successfully",
  "gamer": {
    "gamer_id": 3,
    "name": "Marcus Phoenix",
    "email": "marcus.phoenix@example.com"
  }
}
```

**Error Responses:**
- **400 Bad Request** (Invalid ID or missing fields):
  ```json
  {
    "message": "A valid email is required"
  }
  ```
- **404 Not Found** (Gamer ID not found):
  ```json
  {
    "message": "Gamer not found"
  }
  ```
- **409 Conflict** (Email in use by another gamer):
  ```json
  {
    "message": "Email already registered"
  }
  ```

---

### 6.5 Delete Gamer
- **Method:** `DELETE`
- **Path:** `/gamers/:id`
- **Parameters:** `id` (positive integer)
- **Purpose:** Removes gamer if no dependent bookings exist.

**Successful Response (200 OK):**
```json
{
  "message": "Gamer deleted successfully"
}
```

**Error Responses:**
- **404 Not Found**:
  ```json
  {
    "message": "Gamer not found"
  }
  ```
- **409 Conflict** (Foreign key constraint active):
  ```json
  {
    "message": "Cannot delete gamer because bookings exist"
  }
  ```

---

## 7. Console Management Endpoints

### 7.1 Get All Consoles
- **Method:** `GET`
- **Path:** `/consoles`
- **Purpose:** Retrieves all gaming console stations in the arcade.

**Successful Response (200 OK):**
```json
{
  "count": 2,
  "consoles": [
    {
      "console_id": 1,
      "name": "PS5 Station 1",
      "platform": "PlayStation"
    },
    {
      "console_id": 2,
      "name": "Xbox Station 1",
      "platform": "Xbox"
    }
  ]
}
```

---

### 7.2 Get Console by ID
- **Method:** `GET`
- **Path:** `/consoles/:id`
- **Parameters:** `id` (positive integer)

**Successful Response (200 OK):**
```json
{
  "console_id": 1,
  "name": "PS5 Station 1",
  "platform": "PlayStation"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Console not found"
}
```

---

### 7.3 Search Consoles by Platform
- **Method:** `GET`
- **Path:** `/consoles/search?platform=:query`
- **Query Parameter:** `platform` (case-insensitive substring)

**Example:** `GET /consoles/search?platform=play`

**Successful Response (200 OK):**
```json
{
  "count": 1,
  "consoles": [
    {
      "console_id": 1,
      "name": "PS5 Station 1",
      "platform": "PlayStation"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Please provide a platform to search"
}
```

---

### 7.4 Filter Consoles by Platform
- **Method:** `GET`
- **Path:** `/consoles?platform=:name`
- **Query Parameter:** `platform` (case-insensitive exact match)

**Example:** `GET /consoles?platform=Xbox`

**Successful Response (200 OK):**
```json
{
  "count": 1,
  "consoles": [
    {
      "console_id": 2,
      "name": "Xbox Station 1",
      "platform": "Xbox"
    }
  ]
}
```

---

### 7.5 Create Console
- **Method:** `POST`
- **Path:** `/consoles`
- **Header:** `Content-Type: application/json`
- **Required Parameters:** `name` (string), `platform` (string)

**Example Request Body:**
```json
{
  "name": "Nintendo Switch OLED Station",
  "platform": "Nintendo"
}
```

**Successful Response (201 Created):**
```json
{
  "message": "Console added successfully",
  "console": {
    "console_id": 3,
    "name": "Nintendo Switch OLED Station",
    "platform": "Nintendo"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Console platform is required"
}
```

---

### 7.6 Update Console
- **Method:** `PUT`
- **Path:** `/consoles/:id`
- **Parameters:** `id` (positive integer)
- **Required Parameters:** `name` (string), `platform` (string)

**Example Request Body:**
```json
{
  "name": "Nintendo Switch Pro Station",
  "platform": "Nintendo"
}
```

**Successful Response (200 OK):**
```json
{
  "message": "Console updated successfully",
  "console": {
    "console_id": 3,
    "name": "Nintendo Switch Pro Station",
    "platform": "Nintendo"
  }
}
```

---

### 7.7 Delete Console
- **Method:** `DELETE`
- **Path:** `/consoles/:id`
- **Parameters:** `id` (positive integer)

**Successful Response (200 OK):**
```json
{
  "message": "Console deleted successfully"
}
```

**Error Response (409 Conflict):**
```json
{
  "message": "Cannot delete console because bookings exist"
}
```

---

## 8. Booking Management Endpoints

### 8.1 Get All Bookings
- **Method:** `GET`
- **Path:** `/bookings`
- **Purpose:** Retrieves all bookings joined with gamer and console attributes.

**Successful Response (200 OK):**
```json
{
  "count": 1,
  "bookings": [
    {
      "booking_id": 1,
      "gamer_id": 1,
      "gamer_name": "Alex",
      "gamer_email": "alex@example.com",
      "console_id": 1,
      "console_name": "PS5 Station 1",
      "platform": "PlayStation",
      "status": "pending"
    }
  ]
}
```

---

### 8.2 Get Booking Details Using SQL JOIN
- **Method:** `GET`
- **Path:** `/bookings/details`
- **Purpose:** Explicit relational query joining `bookings`, `gamers`, and `consoles` tables.

**Successful Response (200 OK):**
```json
{
  "message": "Booking details retrieved successfully",
  "count": 1,
  "bookings": [
    {
      "booking_id": 1,
      "gamer_id": 1,
      "gamer_name": "Alex",
      "gamer_email": "alex@example.com",
      "console_id": 1,
      "console_name": "PS5 Station 1",
      "platform": "PlayStation",
      "status": "pending"
    }
  ]
}
```

---

### 8.3 Get Booking by ID
- **Method:** `GET`
- **Path:** `/bookings/:id`
- **Parameters:** `id` (positive integer)

**Successful Response (200 OK):**
```json
{
  "message": "Booking retrieved successfully",
  "booking": {
    "booking_id": 1,
    "gamer_id": 1,
    "gamer_name": "Alex",
    "gamer_email": "alex@example.com",
    "console_id": 1,
    "console_name": "PS5 Station 1",
    "platform": "PlayStation",
    "status": "pending"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Booking not found"
}
```

---

### 8.4 Filter Bookings by Status
- **Method:** `GET`
- **Path:** `/bookings?status=:val`
- **Allowed Statuses:** `pending`, `approved`, `done`

**Example:** `GET /bookings?status=pending`

**Successful Response (200 OK):**
```json
{
  "count": 1,
  "bookings": [
    {
      "booking_id": 1,
      "gamer_id": 1,
      "gamer_name": "Alex",
      "gamer_email": "alex@example.com",
      "console_id": 1,
      "console_name": "PS5 Station 1",
      "platform": "PlayStation",
      "status": "pending"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid booking status"
}
```

---

### 8.5 Create Booking
- **Method:** `POST`
- **Path:** `/bookings`
- **Header:** `Content-Type: application/json`
- **Required Parameters:** `gamer_id` (positive integer), `console_id` (positive integer)
- **Note:** Every newly created booking is initialized automatically with status `pending`.

**Example Request Body:**
```json
{
  "gamer_id": 1,
  "console_id": 1
}
```

**Successful Response (201 Created):**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "booking_id": 2,
    "gamer_id": 1,
    "gamer_name": "Alex",
    "gamer_email": "alex@example.com",
    "console_id": 1,
    "console_name": "PS5 Station 1",
    "platform": "PlayStation",
    "status": "pending"
  }
}
```

**Error Responses:**
- **400 Bad Request** (Missing/Invalid IDs):
  ```json
  {
    "error": "Valid gamer_id and console_id are required"
  }
  ```
- **404 Not Found** (Foreign key gamer not found):
  ```json
  {
    "error": "Gamer not found"
  }
  ```
- **404 Not Found** (Foreign key console not found):
  ```json
  {
    "error": "Console not found"
  }
  ```

---

### 8.6 Update Booking Status (Twist Rule Implementation)
- **Method:** `PATCH`
- **Path:** `/bookings/:id/status`
- **Header:** `Content-Type: application/json`
- **Required Parameters:** `status` (string)

#### Twist Rule State Machine
```text
[NEW BOOKING] ──> pending ──> approved ──> done
```
Strict transition rules:
1. `pending` ➔ `approved` is **allowed**.
2. `approved` ➔ `done` is **allowed**.
3. All other transitions (e.g. `pending` ➔ `done`, `done` ➔ `approved`, `done` ➔ `pending`, `approved` ➔ `pending`) are **rejected** and database record is preserved unmodified.

**Valid Request Body:**
```json
{
  "status": "approved"
}
```

**Successful Response (200 OK):**
```json
{
  "message": "Booking status updated successfully",
  "booking": {
    "booking_id": 2,
    "gamer_id": 1,
    "gamer_name": "Alex",
    "gamer_email": "alex@example.com",
    "console_id": 1,
    "console_name": "PS5 Station 1",
    "platform": "PlayStation",
    "status": "approved"
  }
}
```

**Rejection Response (400 Bad Request):**
```json
{
  "error": "Invalid status change"
}
```

---

## 9. Global Error Handling & HTTP Status Codes

The application employs centralized middleware (`middleware/notFound.js` and `middleware/errorHandler.js`) ensuring all errors return standard JSON envelopes.

| Status Code | Standard Meaning | Usage in GameZone Arcade |
|---|---|---|
| **200 OK** | Request succeeded | Successful GET, PUT, PATCH, DELETE operations |
| **201 Created** | New resource created | Successful POST `/gamers`, POST `/consoles`, POST `/bookings` |
| **400 Bad Request** | Invalid input or transition | Missing required field, malformed ID, invalid transition, malformed JSON |
| **404 Not Found** | Resource or route missing | Nonexistent ID (`/gamers/999999`), unknown API route (`/unknown-route`) |
| **409 Conflict** | State/integrity conflict | Duplicate email address, deleting gamer/console with active bookings |
| **500 Internal Server Error** | Server-side exception | Uncaught database failure or execution crash |
