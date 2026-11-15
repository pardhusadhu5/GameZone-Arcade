const db = require("../database/db");
const { isValidId, bookingJoinQuery } = require("./bookingCreateController");

/**
 * PATCH /bookings/:id/status
 * Purpose: Update the status of an existing booking according to the Twist Rule.
 * 
 * Twist Rule Workflow:
 *      NEW BOOKING
 *           |
 *           v
 *        PENDING
 *           |
 *           | (approved)
 *           v
 *        APPROVED
 *           |
 *           | (done)
 *           v
 *          DONE
 * 
 * Allowed transitions:
 * - 'pending' -> 'approved'
 * - 'approved' -> 'done'
 * 
 * All other transitions are rejected with HTTP 400 Bad Request.
 * Database is never updated on invalid transitions.
 */
const updateBookingStatus = (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // 1. Validate booking ID
        if (!isValidId(id)) {
            return res.status(400).json({
                error: "Invalid booking ID",
                message: "Booking ID must be a valid positive integer"
            });
        }

        // 2. Validate status presence in request body
        if (!status || typeof status !== "string" || !status.trim()) {
            return res.status(400).json({
                error: "Status is required",
                message: "Please provide a valid status string in the request body"
            });
        }

        const requestedStatus = status.trim().toLowerCase();

        // 3. Validate against allowed booking statuses in the system
        const validStatuses = ["pending", "approved", "done"];
        if (!validStatuses.includes(requestedStatus)) {
            return res.status(400).json({
                error: "Invalid status value",
                message: `Invalid status '${status}'. Allowed statuses are: pending, approved, done`
            });
        }

        // 4. Verify booking exists in the database
        const booking = db.prepare(
            "SELECT * FROM bookings WHERE booking_id = ?"
        ).get(Number(id));

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found",
                message: `Booking with ID ${id} does not exist`
            });
        }

        // 5. Enforce Twist Rule: strictly allowed transitions only
        const allowedTransitions = {
            pending: "approved",
            approved: "done"
        };

        const currentStatus = booking.status;
        const expectedNextStatus = allowedTransitions[currentStatus];

        if (expectedNextStatus !== requestedStatus) {
            // Provide explicit, descriptive explanation for why the transition was rejected
            let reason = `Cannot transition booking from '${currentStatus}' to '${requestedStatus}'.`;
            if (currentStatus === "done") {
                reason = "Booking is already 'done' (terminal state) and cannot be updated to any other status.";
            } else if (currentStatus === "pending" && requestedStatus === "done") {
                reason = "Cannot skip 'approved' status. A 'pending' booking must first be transitioned to 'approved'.";
            } else if (currentStatus === "approved" && requestedStatus === "pending") {
                reason = "Cannot move booking status backwards from 'approved' to 'pending'.";
            } else if (currentStatus === requestedStatus) {
                reason = `Booking is already in '${currentStatus}' status.`;
            }

            return res.status(400).json({
                error: "Invalid status transition",
                message: reason,
                workflow: "pending -> approved -> done"
            });
        }

        // 6. Safe database update using parameterized statement
        const updateStmt = db.prepare(`
            UPDATE bookings
            SET status = ?
            WHERE booking_id = ?
        `);

        updateStmt.run(requestedStatus, Number(id));

        // 7. Retrieve updated booking details with JOIN
        const updatedBooking = db.prepare(`
            ${bookingJoinQuery}
            WHERE b.booking_id = ?
        `).get(Number(id));

        return res.status(200).json({
            message: "Booking status updated successfully",
            booking_id: Number(id),
            old_status: currentStatus,
            new_status: requestedStatus,
            booking: updatedBooking
        });

    } catch (error) {
        console.error("Error updating booking status:", error);
        return res.status(500).json({
            error: "Could not update booking status",
            message: "Internal server error"
        });
    }
};

module.exports = {
    updateBookingStatus
};
