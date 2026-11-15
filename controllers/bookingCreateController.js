const db = require("../database/db");

// Helper: validate positive integer ID
function isValidId(id) {
    return /^\d+$/.test(String(id).trim()) && Number(id) > 0;
}

// Reusable SQL JOIN query to fetch detailed booking information
const bookingJoinQuery = `
    SELECT
        b.booking_id,
        b.gamer_id,
        g.name AS gamer_name,
        g.email AS gamer_email,
        b.console_id,
        c.name AS console_name,
        c.platform,
        b.status
    FROM bookings b
    JOIN gamers g ON b.gamer_id = g.gamer_id
    JOIN consoles c ON b.console_id = c.console_id
`;

/**
 * POST /bookings
 * Purpose: Create a new booking for a gamer and a console.
 * Requirements:
 * 1. Accept gamer_id and console_id from request body.
 * 2. Validate required values.
 * 3. Verify that the gamer exists.
 * 4. Verify that the console exists.
 * 5. Automatically assign initial status as 'pending'.
 * 6. Prevent client from bypassing workflow by directly setting 'approved' or 'done'.
 * 7. Return created booking details with HTTP 201.
 * 8. Handle foreign key and validation errors properly.
 * 9. Use parameterized SQL queries.
 */
const createBooking = (req, res) => {
    try {
        const { gamer_id, console_id } = req.body;

        // Check required fields are present
        if (gamer_id === undefined || gamer_id === null || console_id === undefined || console_id === null) {
            return res.status(400).json({
                error: "Valid gamer_id and console_id are required",
                message: "Gamer ID and Console ID are required"
            });
        }

        // Validate IDs are positive integers
        if (!isValidId(gamer_id) || !isValidId(console_id)) {
            return res.status(400).json({
                error: "Valid gamer_id and console_id are required",
                message: "Gamer ID and Console ID must be valid positive integers"
            });
        }

        // Prevent client from bypassing initial workflow
        if (req.body.status && String(req.body.status).trim().toLowerCase() !== "pending") {
            return res.status(400).json({
                error: "Invalid initial status. New bookings must start with 'pending' status",
                message: "Cannot create booking directly with approved or done status"
            });
        }

        // Verify gamer exists
        const gamer = db.prepare(
            "SELECT * FROM gamers WHERE gamer_id = ?"
        ).get(Number(gamer_id));

        if (!gamer) {
            return res.status(404).json({
                error: "Gamer not found",
                message: "Gamer not found"
            });
        }

        // Verify console exists
        const consoleData = db.prepare(
            "SELECT * FROM consoles WHERE console_id = ?"
        ).get(Number(console_id));

        if (!consoleData) {
            return res.status(404).json({
                error: "Console not found",
                message: "Console not found"
            });
        }

        // Insert booking with initial 'pending' status using parameterized statement
        const insertStmt = db.prepare(`
            INSERT INTO bookings (gamer_id, console_id, status)
            VALUES (?, ?, 'pending')
        `);

        const result = insertStmt.run(Number(gamer_id), Number(console_id));

        // Fetch newly created booking with JOIN
        const newBooking = db.prepare(`
            ${bookingJoinQuery}
            WHERE b.booking_id = ?
        `).get(Number(result.lastInsertRowid));

        return res.status(201).json({
            message: "Booking created successfully",
            booking_id: newBooking.booking_id,
            status: newBooking.status,
            booking: newBooking
        });

    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
            return res.status(404).json({
                error: "Referenced gamer or console does not exist",
                message: error.message
            });
        }

        console.error("Error creating booking:", error);
        return res.status(500).json({
            error: "Could not create booking",
            message: "Internal server error"
        });
    }
};

module.exports = {
    createBooking,
    isValidId,
    bookingJoinQuery
};
