
const express = require("express");
const db = require("../database/db");

const router = express.Router();

// Helper: validate a positive integer ID
function isValidId(id) {
    return Number.isInteger(Number(id)) && Number(id) > 0;
}

// 1. GET ALL GAMERS
router.get("/", (req, res) => {
    const gamers = db.prepare(
        "SELECT * FROM gamers ORDER BY gamer_id"
    ).all();

    res.status(200).json({
        count: gamers.length,
        gamers
    });
});

// 2. GET ONE GAMER
router.get("/:id", (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(400).json({
            message: "Invalid gamer ID"
        });
    }

    const gamer = db.prepare(
        "SELECT * FROM gamers WHERE gamer_id = ?"
    ).get(Number(id));

    if (!gamer) {
        return res.status(404).json({
            message: "Gamer not found"
        });
    }

    res.status(200).json(gamer);
});

// 3. CREATE GAMER
router.post("/", (req, res) => {
    const { name, email } = req.body;

    if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
            message: "Gamer name is required"
        });
    }

    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        return res.status(400).json({
            message: "A valid email is required"
        });
    }

    try {
        const result = db.prepare(`
            INSERT INTO gamers (name, email)
            VALUES (?, ?)
        `).run(name.trim(), email.trim().toLowerCase());

        const newGamer = db.prepare(
            "SELECT * FROM gamers WHERE gamer_id = ?"
        ).get(result.lastInsertRowid);

        res.status(201).json({
            message: "Gamer registered successfully",
            gamer: newGamer
        });
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        console.error(error);
        res.status(500).json({
            message: "Could not register gamer"
        });
    }
});

// 4. UPDATE GAMER
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!isValidId(id)) {
        return res.status(400).json({
            message: "Invalid gamer ID"
        });
    }

    if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
            message: "Gamer name is required"
        });
    }

    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        return res.status(400).json({
            message: "A valid email is required"
        });
    }

    const existingGamer = db.prepare(
        "SELECT * FROM gamers WHERE gamer_id = ?"
    ).get(Number(id));

    if (!existingGamer) {
        return res.status(404).json({
            message: "Gamer not found"
        });
    }

    try {
        db.prepare(`
            UPDATE gamers
            SET name = ?, email = ?
            WHERE gamer_id = ?
        `).run(name.trim(), email.trim().toLowerCase(), Number(id));

        const updatedGamer = db.prepare(
            "SELECT * FROM gamers WHERE gamer_id = ?"
        ).get(Number(id));

        res.status(200).json({
            message: "Gamer updated successfully",
            gamer: updatedGamer
        });
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        console.error(error);
        res.status(500).json({
            message: "Could not update gamer"
        });
    }
});

// 5. DELETE GAMER
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(400).json({
            message: "Invalid gamer ID"
        });
    }

    const existingGamer = db.prepare(
        "SELECT * FROM gamers WHERE gamer_id = ?"
    ).get(Number(id));

    if (!existingGamer) {
        return res.status(404).json({
            message: "Gamer not found"
        });
    }

    try {
        db.prepare(
            "DELETE FROM gamers WHERE gamer_id = ?"
        ).run(Number(id));

        res.status(200).json({
            message: "Gamer deleted successfully"
        });
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
            return res.status(409).json({
                message: "Cannot delete gamer because bookings exist"
            });
        }

        console.error(error);
        res.status(500).json({
            message: "Could not delete gamer"
        });
    }
});

module.exports = router;
