const db = require("../database/db");

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

function parseId(id) {
    if (!/^\d+$/.test(String(id))) {
        return null;
    }

    const parsedId = Number(id);
    return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

function handleDatabaseError(error, res, operation) {
    const message = `Could not ${operation}`;
    console.error(`${message}:`, error);

    return res.status(500).json({
        error: message
    });
}

function getAllBookings(req, res) {
    const { status } = req.query;
    const validStatuses = ["pending", "approved", "done"];

    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid booking status" });
    }

    let sql = bookingJoinQuery;
    const parameters = [];

    if (status) {
        sql += " WHERE b.status = ?";
        parameters.push(status);
    }

    sql += " ORDER BY b.booking_id DESC";

    try {
        const bookings = db.prepare(sql).all(...parameters);

        return res.status(200).json({
            count: bookings.length,
            bookings
        });
    } catch (error) {
        return handleDatabaseError(error, res, "retrieve bookings");
    }
}

function getBookingDetails(req, res) {
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
        return handleDatabaseError(error, res, "retrieve booking details");
    }
}

function getBookingById(req, res) {
    const bookingId = parseId(req.params.id);
    if (bookingId === null) {
        return res.status(400).json({ error: "Invalid booking ID" });
    }

    try {
        const booking = db.prepare(`
            ${bookingJoinQuery}
            WHERE b.booking_id = ?
        `).get(bookingId);

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        return res.status(200).json({
            message: "Booking retrieved successfully",
            booking
        });
    } catch (error) {
        return handleDatabaseError(error, res, "retrieve booking");
    }
}

module.exports = {
    getAllBookings,
    getBookingDetails,
    getBookingById
};
