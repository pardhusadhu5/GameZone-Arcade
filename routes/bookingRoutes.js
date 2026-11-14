
const express = require("express");
const db = require("../database/db");

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
router.post("/", (req, res) => {
    const { gamer_id, console_id } = req.body;

    if (!isValidId(gamer_id) || !isValidId(console_id)) {
        return res.status(400).json({
            error: "Valid gamer_id and console_id are required"
        });
    }

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

// 2. GET ALL BOOKINGS / FILTER BY STATUS
router.get("/", (req, res) => {
    const { status } = req.query;

    const validStatuses = ["pending", "approved", "done"];

    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
            error: "Invalid booking status"
        });
    }

    let sql = bookingJoinQuery;
    const params = [];

    if (status) {
        sql += " WHERE b.status = ?";
        params.push(status);
    }

    sql += " ORDER BY b.booking_id DESC";

    try {
        const bookings = db.prepare(sql).all(...params);

        return res.status(200).json({
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Could not retrieve bookings"
        });
    }
});

// 3. GET BOOKING DETAILS USING JOIN
// Keep this before /:id
router.get("/details", (req, res) => {
    try {
        const bookings = db.prepare(`
            ${bookingJoinQuery}
            ORDER BY b.booking_id DESC
        `).all();

        return res.status(200).json({
            message: "Booking details retrieved successfully",
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Could not retrieve booking details"
        });
    }
});

// 4. GET ONE BOOKING BY ID
router.get("/:id", (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(400).json({
            error: "Invalid booking ID"
        });
    }

    try {
        const booking = db.prepare(`
            ${bookingJoinQuery}
            WHERE b.booking_id = ?
        `).get(Number(id));

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found"
            });
        }

        return res.status(200).json({
            message: "Booking retrieved successfully",
            booking
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Could not retrieve booking"
        });
    }
});

// 5. UPDATE BOOKING STATUS
router.patch("/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidId(id)) {
        return res.status(400).json({
            error: "Invalid booking ID"
        });
    }

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
