# Member 4 Contribution

**Project:** GameZone Arcade Backend (LG-01)
**Responsibility:** Input validation, console search, and proper error responses

## Files

- `middleware/validation.js` — shared validation middleware for gamer, console, booking, search query, and route ID inputs.
- `routes/gamerRoutes.js` — attaches gamer and ID validation to create/update routes.
- `routes/consoleRoutes.js` — attaches console, search query, and ID validation; adds a consistent search response.
- `routes/bookingRoutes.js` — attaches booking, status, and ID validation without changing status transition rules.

## Validation

Invalid input returns HTTP 400 with `success: false`, `message: "Validation failed"`, and an `errors` array.

- Gamers require a non-whitespace string `name` and a non-empty, basic-format `email` string.
- Consoles require non-whitespace string `name` and `platform` values.
- Booking creation requires numeric, safe, positive integer `gamer_id` and `console_id` values.
- Booking status must be exactly `pending`, `approved`, or `done`. The route retains the existing transition/business rules.
- Gamer, console, and booking IDs on the validated update routes must be positive safe integer path values.
- Missing/non-object request bodies and non-string search values return validation errors rather than throwing.

## Console Search

`GET /consoles/search?platform=play` reads `platform` from `req.query`, validates it, and performs case-insensitive partial matching with a parameterized SQLite `LIKE` query using the existing database connection. Results use the schema fields `console_id`, `name`, and `platform`; no matches return HTTP 200 with an empty `data` array.

## Test Results

The upstream-based integration checkout was tested at `http://localhost:3001`; all 16 required scenarios passed, plus seven additional HTTP checks for repeated query parameters, valid updates, a valid booking and transition, and health. All 23 checks passed. Twelve focused middleware assertions and syntax checks also passed. Test records were removed, and the tracked SQLite database was restored byte-for-byte to its original state.

Postman/Newman was not installed, so these results came from direct HTTP requests using Node.js `fetch`, not a Postman UI or Newman run. Actual Postman execution remains outstanding.

| # | Scenario | Actual result |
|---|---|---|
| 1 | Create gamer with valid name/email | HTTP 201 |
| 2 | Create gamer without name | HTTP 400 |
| 3 | Create gamer without email | HTTP 400 |
| 4 | Create gamer with invalid email | HTTP 400 |
| 5 | Create console with valid details | HTTP 201 |
| 6 | Create console without name | HTTP 400 |
| 7 | Create console without platform | HTTP 400 |
| 8 | Create booking without `gamer_id` | HTTP 400 |
| 9 | Create booking without `console_id` | HTTP 400 |
| 10 | Create booking with malformed IDs | HTTP 400 |
| 11 | Search PlayStation | HTTP 200, matching records returned |
| 12 | Search Xbox | HTTP 200, matching records returned |
| 13 | Partial platform search | HTTP 200, matching records returned |
| 14 | Search unknown platform | HTTP 200, empty `data` array |
| 15 | Search without platform | HTTP 400 |
| 16 | Update booking with unsupported status | HTTP 400 |

## Git

- **Branch:** `main`
- **Remote:** `https://github.com/pardhusadhu5/GameZone-Arcade.git`
- **Commit:** `b66b707` (`feat: add input validation and console search`)