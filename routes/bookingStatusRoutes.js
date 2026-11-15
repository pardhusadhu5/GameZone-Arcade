const express = require("express");
const { updateBookingStatus } = require("../controllers/bookingStatusController");
const { validateBookingStatus, validateIdParam } = require("../middleware/validation");

const router = express.Router();

// PATCH /bookings/:id/status - Update booking status per Twist Rule (Member 5)
// Reuses Member 4's validation middleware
router.patch("/:id/status", validateIdParam(), validateBookingStatus, updateBookingStatus);

module.exports = router;
