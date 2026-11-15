const express = require("express");
const { createBooking } = require("../controllers/bookingCreateController");
const { validateBooking } = require("../middleware/validation");

const router = express.Router();

// POST /bookings - Create a new booking with initial 'pending' status (Member 5)
// Reuses Member 4's validation middleware
router.post("/", validateBooking, createBooking);

module.exports = router;
