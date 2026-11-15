const express = require("express");
const gamerController = require("../controllers/gamerController");
const { validateGamer, validateIdParam } = require("../middleware/validation");

const router = express.Router();

router.get("/", gamerController.getAllGamers);
router.get("/:id", gamerController.getGamerById);
router.post("/", validateGamer, gamerController.createGamer);
router.put("/:id", validateIdParam(), validateGamer, gamerController.updateGamer);
router.delete("/:id", gamerController.deleteGamer);

module.exports = router;
