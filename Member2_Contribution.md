# Member 2 - Database Design and Implementation Contribution Report

**Project:** GameZone Arcade Backend (LG-01)

**Team Member:** R. Praisy

**Registration Number:** 252U1R5127

**Assigned Responsibility:** MEMBER 2 - DATABASE DESIGN, SQLITE CONNECTION, SCHEMA, AND SEED DATA

**Submission Date:** 15-11-2026

**Repository:** [https://github.com/pardhusadhu5/GameZone-Arcade](https://github.com/pardhusadhu5/GameZone-Arcade)

---

## 1. Member Role & Overview

As **Member 2**, my responsibility was to create the SQLite database foundation used by the GameZone Arcade backend. My work covers:

1. Establishing the database connection using `better-sqlite3`.
2. Creating the gamers, consoles, and bookings tables.
3. Defining primary keys, foreign keys, and data constraints.
4. Preparing repeatable sample data for development and verification.
5. Making the shared database connection available to the backend controllers.

---

## 2. Database Files and Architecture

| File | Responsibility |
|---|---|
| `database/db.js` | Opens `database/gamezone.db`, enables foreign-key enforcement, applies the schema, and exports the shared connection. |
| `database/schema.sql` | Defines the gamers, consoles, and bookings tables and their constraints. |
| `database/seed.js` | Adds sample gamers, consoles, and an initial booking without repeatedly adding the same sample records. |

The database package is `better-sqlite3`. The database file is stored in the project's `database` folder.

---

## 3. SQLite Connection and Query Execution

`database/db.js` creates the database connection with `better-sqlite3`. It enables SQLite foreign-key enforcement, reads `schema.sql`, and runs the SQL with `db.exec()`. The connection is then exported for the server and controllers to reuse.

Controllers execute SQL through prepared statements. The backend uses `.get()` to read one record, `.all()` to read multiple records, and `.run()` to insert, update, or delete records. Parameter placeholders (`?`) are used to supply query values.

---

## 4. Database Schema and Relationships

The schema defines three related tables:

| Table | Columns and data types | Purpose and constraints |
|---|---|---|
| `gamers` | `gamer_id INTEGER`, `name TEXT`, `email TEXT` | Stores gamer information. `gamer_id` is an auto-incrementing primary key; `name` is required, and `email` has a unique constraint. |
| `consoles` | `console_id INTEGER`, `name TEXT`, `platform TEXT` | Stores console stations. `console_id` is an auto-incrementing primary key; `name` and `platform` are required. |
| `bookings` | `booking_id INTEGER`, `gamer_id INTEGER`, `console_id INTEGER`, `status TEXT` | Connects a gamer to a console. `booking_id` is an auto-incrementing primary key; the two reference IDs are required. `status` defaults to `pending` and is limited to `pending`, `approved`, or `done`. |

Each booking references one gamer and one console through foreign keys:

- `bookings.gamer_id` references `gamers.gamer_id`.
- `bookings.console_id` references `consoles.console_id`.

These references create one-to-many relationships: a gamer or console can be associated with multiple bookings. The foreign keys prevent a booking from referring to a gamer or console that does not exist.

---

## 5. Seed Data and Repeatable Execution

The `database/seed.js` script adds two example gamers (Alex and Sam), two console stations (PS5 Station 1 and Xbox Station 1), and an example booking for Alex on the PS5 station when the bookings table is empty. It can be run with `npm run seed`.

The script avoids adding the same sample records on repeated runs:

- Gamer inserts use `INSERT OR IGNORE`, with the unique email constraint identifying existing sample gamers.
- Console inserts first check whether a console with the same name already exists.
- The sample booking is inserted only when there are no bookings in the table.

---

## 6. Backend Integration and Database Queries

The Express server imports `database/db.js` during startup. Gamer, console, and booking controllers use the exported connection to run their database queries. This allows API requests to read and update the shared SQLite database.

Booking query endpoints use SQL `JOIN` operations to combine booking records with gamer and console information. This allows responses to include related details such as gamer name, console name, platform, and booking status. API behavior and booking workflow rules are implemented by the corresponding team members.

---

## 7. Testing and Verification

The database source files and the existing SQLite database were checked using read-only inspection:

- Confirmed the `gamers`, `consoles`, and `bookings` tables and their primary-key and foreign-key definitions.
- The inspected database contained 5 gamers, 2 consoles, and 3 bookings.
- SQLite `integrity_check` returned `ok`.
- SQLite `foreign_key_check` returned no violations.
- Confirmed the booking status default and allowed-value constraint in `schema.sql`.

These checks covered database structure and integrity. No separate API or Postman test was performed as part of this database verification.

---

## 8. Challenges Faced and Solutions

Maintaining valid links between bookings, gamers, and consoles was an important database-design consideration. I addressed it by defining foreign keys in the schema and enabling SQLite foreign-key enforcement in the shared connection.

Another consideration was making the sample data script safe to rerun. The seed script uses the unique gamer email, checks console names, and inserts the sample booking only when the bookings table is empty.

---

## 9. Key Learning Outcomes

- Learned to design relational tables and choose SQLite data types and constraints.
- Improved my understanding of primary keys, foreign keys, and one-to-many relationships.
- Practiced using `better-sqlite3` prepared statements and SQL `JOIN` queries.
- Learned how a shared database connection integrates with backend controllers and APIs.
- Understood how conditional seed inserts help avoid duplicate sample records.

---

## 10. Individual Contribution Summary

I contributed the SQLite connection, database schema, table relationships, and seed-data setup for the GameZone Arcade backend. This work provides the data layer used by the team's gamer, console, and booking APIs.
