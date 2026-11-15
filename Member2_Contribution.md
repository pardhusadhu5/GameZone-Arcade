# Member 2 Contribution Report

## 1. Member Information

| Field | Details |
|---|---|
| Team Member | Member 2 - R. Praisy |
| Registration Number | 252U1R5127 |
| Role | Database Design and Implementation |
| Project | GameZone Arcade Backend |

## 2. Project Responsibility

My responsibility was to set up the SQLite database used by the GameZone Arcade backend. This work included creating the database connection with `better-sqlite3`, designing the database schema, creating tables, and preparing seed data for initial use.

## 3. Database Connection

The `database/db.js` file opens the SQLite database at `database/gamezone.db` and exports the connection for the backend to use. It enables foreign key enforcement, reads and applies `schema.sql` during initialization, and uses a transaction while applying the schema. It also checks for an older `gamers` table definition and, when needed, migrates it so the email column is required while preserving existing gamer IDs.

The backend runs SQL through `better-sqlite3` prepared statements. The controllers use methods such as `.get()` to retrieve one record, `.all()` to retrieve multiple records, and `.run()` to insert, update, or delete records.

## 4. Database Schema

The schema in `database/schema.sql` creates three tables:

| Table | Columns and data types | Purpose |
|---|---|---|
| `gamers` | `gamer_id INTEGER`, `name TEXT`, `email TEXT` | Stores gamer details. `gamer_id` is an auto-incrementing primary key; `name` and `email` are required, and `email` is unique. |
| `consoles` | `console_id INTEGER`, `name TEXT`, `platform TEXT` | Stores console details. `console_id` is an auto-incrementing primary key; `name` and `platform` are required. |
| `bookings` | `booking_id INTEGER`, `gamer_id INTEGER`, `console_id INTEGER`, `status TEXT` | Connects a gamer to a console. `booking_id` is an auto-incrementing primary key; both reference IDs are required. `status` is required, defaults to `pending`, and is limited to `pending`, `approved`, or `done`. |

The `bookings.gamer_id` column references `gamers.gamer_id`, and `bookings.console_id` references `consoles.console_id`. This creates a one-to-many relationship from gamers to bookings and from consoles to bookings: each booking has one gamer and one console, while each gamer or console can be related to multiple bookings.

## 5. Seed Data

The `database/seed.js` file inserts example gamers, consoles, and a booking so the application can be tried with initial records. It uses prepared statements and wraps the inserts in a transaction. The seed script can be run with `npm run seed`.

The seed operations are designed for safe repeated execution: existing gamers are skipped by email, consoles are checked by name before insertion, and a booking is inserted only when the same gamer-console pair is not already present.

## 6. Database Relationships

Bookings connect gamers and consoles through their foreign key columns. The database connection enables SQLite foreign key enforcement, and the schema requires both referenced records to exist. The default foreign key behavior prevents deleting a gamer or console while bookings still refer to it.

The backend also uses SQL `JOIN` queries to show related data. For example, booking queries join `bookings` with `gamers` and `consoles` to return gamer and console names alongside booking status.

## 7. Integration

The Express server imports the database connection during startup. The gamer, console, and booking controllers also import the shared connection from `database/db.js` and use it to execute their SQL queries. This allows API handlers to access the same SQLite database for gamer, console, and booking operations.

My contribution provides the database foundation used by those controllers and APIs; it does not include implementing their API behavior.

## 8. Testing and Verification

I verified the schema and database implementation against `database/schema.sql`, `database/db.js`, and `database/seed.js`. I also inspected the existing SQLite file using read-only checks:

- The database contains the `gamers`, `consoles`, and `bookings` tables.
- The inspected database contained 5 gamers, 2 consoles, and 3 bookings.
- SQLite `integrity_check` returned `ok`.
- SQLite `foreign_key_check` returned no violations.
- The schema source contains the expected primary keys, foreign keys, required fields, unique gamer email, and booking status constraint.

These checks verified the database structure and integrity. No separate API or Postman test was performed as part of this database verification.

## 9. Challenges Faced

One important consideration was maintaining referential integrity between bookings, gamers, and consoles. The database connection enables foreign key checks, and the schema defines the references explicitly. The connection code also accounts for an earlier `gamers` table definition in which email might not yet be required, and checks for foreign key violations during that migration.

## 10. Learning Outcomes

This work helped me learn how to create a relational database with SQLite, choose suitable columns and data types, and define primary and foreign keys. I also learned how constraints help protect data, how transactions and prepared statements are used with `better-sqlite3`, how seed scripts can be made repeatable, and how a shared database connection supports backend controllers and API requests.

## 11. Conclusion

I contributed the SQLite database setup for the GameZone Arcade backend, including its connection, schema, relationships, and repeatable sample-data script. This database supports the backend's gamer, console, and booking records and provides the foundation for the team's API integration.
