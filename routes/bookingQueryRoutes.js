const express = require("express");
const bookingQueryController = require("../controllers/bookingQueryController");

const router = express.Router();

router.get("/", bookingQueryController.getAllBookings);
router.get("/details", bookingQueryController.getBookingDetails);
router.get("/:id", bookingQueryController.getBookingById);

module.exports = router;
