const express = require("express");
const db = require("../database/db");
const {
    validateBooking,
    validateBookingStatus,
    validateIdParam
} = require("../middleware/validation");
const bookingQueryRoutes = require("./bookingQueryRoutes");

const router = express.Router();

function isValidId(id) {
    return /^\d+$/.test(String(id)) && Number(id) > 0;
}

// Reusable JOIN query
const bookingJoinQuery = `
    SELECT
        b.booking_id,
        g.gamer_id,
        g.name AS gamer_name,
        g.email AS gamer_email,
        c.console_id,
        c.name AS console_name,
        c.platform,
        b.status
    FROM bookings b
    JOIN gamers g ON b.gamer_id = g.gamer_id
    JOIN consoles c ON b.console_id = c.console_id
`;

// 1. CREATE BOOKING
router.post("/", validateBooking, (req, res) => {
    const { gamer_id, console_id } = req.body;

    try {
        const gamer = db.prepare(
            "SELECT * FROM gamers WHERE gamer_id = ?"
        ).get(Number(gamer_id));

        if (!gamer) {
            return res.status(404).json({
                error: "Gamer not found"
            });
        }

        const consoleData = db.prepare(
            "SELECT * FROM consoles WHERE console_id = ?"
        ).get(Number(console_id));

        if (!consoleData) {
            return res.status(404).json({
                error: "Console not found"
            });
        }

        const result = db.prepare(`
            INSERT INTO bookings (gamer_id, console_id)
            VALUES (?, ?)
        `).run(Number(gamer_id), Number(console_id));

        const booking = db.prepare(`
            ${bookingJoinQuery}
            WHERE b.booking_id = ?
        `).get(result.lastInsertRowid);

        return res.status(201).json({
            message: "Booking created successfully",
            booking
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Could not create booking"
        });
    }
});

// Mount Member 3 booking query routes (GET /, GET /details, GET /:id)
router.use(bookingQueryRoutes);

// 2. UPDATE BOOKING STATUS
router.patch("/:id/status", validateIdParam(), validateBookingStatus, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const booking = db.prepare(
            "SELECT * FROM bookings WHERE booking_id = ?"
        ).get(Number(id));

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found"
            });
        }

        const allowedTransitions = {
            pending: "approved",
            approved: "done"
        };

        if (allowedTransitions[booking.status] !== status) {
            return res.status(400).json({
                error: "Invalid status change"
            });
        }

        db.prepare(`
            UPDATE bookings
            SET status = ?
            WHERE booking_id = ?
        `).run(status, Number(id));

        const updatedBooking = db.prepare(`
            ${bookingJoinQuery}
            WHERE b.booking_id = ?
        `).get(Number(id));

        return res.status(200).json({
            message: "Booking status updated successfully",
            booking: updatedBooking
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Could not update booking status"
        });
    }
});

module.exports = router;
