# Member 1 – Express Server and Routes Implementation

## Assigned Responsibility

Member 1 is responsible for **Express Server Setup and Route Configuration** for the GameZone Arcade Backend (Group: LG-01).

---

## Files Created or Modified

| File | Action | Description |
|---|---|---|
| `server.js` | Modified | Complete Express server setup with all required configuration |
| `middleware/notFound.js` | Verified / In place | 404 not-found middleware for unknown routes |
| `middleware/errorHandler.js` | Verified / In place | Centralized error handler middleware |
| `Member1_Contribution.md` | Created | This contribution documentation file |

> All route files (`routes/gamerRoutes.js`, `routes/consoleRoutes.js`, `routes/bookingRoutes.js`) and middleware files were already present and correct. `server.js` was updated to align the root endpoint response message with the project specification and to add `module.exports` for testability.

---

## Express Server Configuration

**File:** `server.js`

The server follows this execution order as required by the assignment:

1. **Express application initialization** – `const app = express()`
2. **JSON body parser** – `app.use(express.json())`
3. **Root endpoint** – `GET /`
4. **Health-check endpoint** – `GET /health`
5. **Gamer routes** – `app.use('/gamers', gamerRoutes)`
6. **Console routes** – `app.use('/consoles', consoleRoutes)`
7. **Booking routes** – `app.use('/bookings', bookingRoutes)`
8. **Not-found middleware** – `app.use(notFound)`
9. **Centralized error handler** – `app.use(errorHandler)`
10. **Server startup** – `app.listen(PORT, ...)`

Port is configured using `process.env.PORT` with a fallback of `3000`.

The app is exported via `module.exports = app` to support future automated testing.

---

## Route Registration Details

| Route Group | Base Path | Route File |
|---|---|---|
| Gamer Routes | `/gamers` | `routes/gamerRoutes.js` |
| Console Routes | `/consoles` | `routes/consoleRoutes.js` |
| Booking Routes | `/bookings` | `routes/bookingRoutes.js` |

```javascript
app.use("/gamers", gamerRoutes);
app.use("/consoles", consoleRoutes);
app.use("/bookings", bookingRoutes);
```

---

## Root and Health Endpoints

### `GET /`

Returns a welcome message confirming the API is live.

**Response (HTTP 200):**
```json
{
  "message": "Welcome to GameZone Arcade API"
}
```

### `GET /health`

Returns the current health status of the backend server and database connection.

**Response (HTTP 200):**
```json
{
  "status": "healthy",
  "service": "GameZone Arcade Backend",
  "database": "connected"
}
```

---

## Not-Found Middleware

**File:** `middleware/notFound.js`

Handles all requests to unknown routes. Runs after all API routes are registered.

- Returns HTTP **404**
- Includes the HTTP method and requested URL in the response message

**Response Example (HTTP 404):**
```json
{
  "success": false,
  "message": "Route not found: GET /invalid-route"
}
```

---

## Error-Handling Middleware

**File:** `middleware/errorHandler.js`

Centralized Express error handler (4-argument signature: `err, req, res, next`).

- Logs error messages to the console during development
- Handles malformed JSON bodies (HTTP **400**)
- Returns safe, generic messages for unexpected server errors (HTTP **500**)
- Passes through status codes and messages from business-rule errors set by other members
- Never exposes internal stack traces or database credentials in responses

**Response Example – Malformed JSON (HTTP 400):**
```json
{
  "success": false,
  "message": "Invalid JSON request body"
}
```

**Response Example – Internal Server Error (HTTP 500):**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Postman Tests and Actual Results

All tests executed against the live server (`http://localhost:3000`) running `node server.js`.

| S.No. | Method | Endpoint | Expected | Actual Status | Actual Response | Result |
|---|---|---|---|---|---|---|
| 1 | GET | `/` | Welcome response | **200 OK** | `{"message":"Welcome to GameZone Arcade API"}` | ✅ PASS |
| 2 | GET | `/health` | Healthy server response | **200 OK** | `{"status":"healthy","service":"GameZone Arcade Backend","database":"connected"}` | ✅ PASS |
| 3 | GET | `/gamers` | Gamer route responds | **200 OK** | `{"count":5,"gamers":[...]}` | ✅ PASS |
| 4 | GET | `/consoles` | Console route responds | **200 OK** | `{"count":2,"consoles":[...]}` | ✅ PASS |
| 5 | GET | `/bookings` | Booking route responds | **200 OK** | `{"count":3,"bookings":[...]}` | ✅ PASS |
| 6 | GET | `/invalid-route` | HTTP 404 | **404 Not Found** | `{"success":false,"message":"Route not found: GET /invalid-route"}` | ✅ PASS |
| 7 | POST | `/gamers` with malformed JSON | Appropriate error | **400 Bad Request** | `{"success":false,"message":"Invalid JSON request body"}` | ✅ PASS |

**All 7 tests passed.**

Additional verifications:
- ✅ Server starts without errors (`GameZone Arcade server running on port 3000`)
- ✅ Database initializes automatically (`GameZone Arcade database connected!`)
- ✅ JSON request bodies are parsed
- ✅ Unknown routes return 404
- ✅ Errors are handled consistently
- ✅ Existing API endpoints continue working

---

## Git Commit ID

> To be filled after `git push` is confirmed.

---

## GitHub Branch Used

**Branch:** `main`

**Remote:** `https://github.com/pardhusadhu5/GameZone-Arcade.git`
