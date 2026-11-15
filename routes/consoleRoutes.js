const express = require("express");
const consoleController = require("../controllers/consoleController");
const {
    validateConsole,
    validateConsoleSearch,
    validateIdParam
} = require("../middleware/validation");

const router = express.Router();

router.get("/search", validateConsoleSearch, consoleController.searchConsoles);
router.get("/:id/bookings", consoleController.getConsoleBookings);
router.get("/:id", consoleController.getConsoleById);
router.get("/", consoleController.getAllConsoles);
router.post("/", validateConsole, consoleController.createConsole);
router.put("/:id", validateIdParam(), validateConsole, consoleController.updateConsole);
router.delete("/:id", consoleController.deleteConsole);

module.exports = router;
