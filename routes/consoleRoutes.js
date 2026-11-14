
const express = require("express");
const db = require("../database/db");

const router = express.Router();

// Validate console ID
function isValidId(id) {
    return Number.isInteger(Number(id)) && Number(id) > 0;
}

// Validate console details
function validateConsole(name, platform) {
    if (typeof name !== "string" || !name.trim()) {
        return "Console name is required";
    }

    if (typeof platform !== "string" || !platform.trim()) {
        return "Console platform is required";
    }

    return null;
}

// 1. SEARCH CONSOLES BY PLATFORM
router.get("/search", (req, res) => {
    const { platform } = req.query;

    if (!platform || !platform.trim()) {
        return res.status(400).json({
            message: "Please provide a platform to search"
        });
    }

    const consoles = db.prepare(`
        SELECT * FROM consoles
        WHERE LOWER(platform) LIKE LOWER(?)
        ORDER BY console_id
    `).all(`%${platform.trim()}%`);

    res.status(200).json({
        count: consoles.length,
        consoles
    });
});

// 2. GET ALL CONSOLES OR FILTER BY PLATFORM
router.get("/", (req, res) => {
    const { platform } = req.query;

    let consoles;

    if (platform && platform.trim()) {
        consoles = db.prepare(`
            SELECT * FROM consoles
            WHERE LOWER(platform) = LOWER(?)
            ORDER BY console_id
        `).all(platform.trim());
    } else {
        consoles = db.prepare(
            "SELECT * FROM consoles ORDER BY console_id"
        ).all();
    }

    res.status(200).json({
        count: consoles.length,
        consoles
    });
});

// 3. GET CONSOLE BY ID
router.get("/:id", (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(400).json({
            message: "Invalid console ID"
        });
    }

    const consoleData = db.prepare(
        "SELECT * FROM consoles WHERE console_id = ?"
    ).get(Number(id));

    if (!consoleData) {
        return res.status(404).json({
            message: "Console not found"
        });
    }

    res.status(200).json(consoleData);
});

// 4. ADD NEW CONSOLE
router.post("/", (req, res) => {
    const { name, platform } = req.body;

    const validationError = validateConsole(name, platform);

    if (validationError) {
        return res.status(400).json({
            message: validationError
        });
    }

    const result = db.prepare(`
        INSERT INTO consoles (name, platform)
        VALUES (?, ?)
    `).run(name.trim(), platform.trim());

    const newConsole = db.prepare(
        "SELECT * FROM consoles WHERE console_id = ?"
    ).get(result.lastInsertRowid);

    res.status(201).json({
        message: "Console added successfully",
        console: newConsole
    });
});

// 5. UPDATE CONSOLE
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, platform } = req.body;

    if (!isValidId(id)) {
        return res.status(400).json({
            message: "Invalid console ID"
        });
    }

    const validationError = validateConsole(name, platform);

    if (validationError) {
        return res.status(400).json({
            message: validationError
        });
    }

    const existingConsole = db.prepare(
        "SELECT * FROM consoles WHERE console_id = ?"
    ).get(Number(id));

    if (!existingConsole) {
        return res.status(404).json({
            message: "Console not found"
        });
    }

    db.prepare(`
        UPDATE consoles
        SET name = ?, platform = ?
        WHERE console_id = ?
    `).run(name.trim(), platform.trim(), Number(id));

    const updatedConsole = db.prepare(
        "SELECT * FROM consoles WHERE console_id = ?"
    ).get(Number(id));

    res.status(200).json({
        message: "Console updated successfully",
        console: updatedConsole
    });
});

// 6. DELETE CONSOLE
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(400).json({
            message: "Invalid console ID"
        });
    }

    const existingConsole = db.prepare(
        "SELECT * FROM consoles WHERE console_id = ?"
    ).get(Number(id));

    if (!existingConsole) {
        return res.status(404).json({
            message: "Console not found"
        });
    }

    try {
        db.prepare(
            "DELETE FROM consoles WHERE console_id = ?"
        ).run(Number(id));

        res.status(200).json({
            message: "Console deleted successfully"
        });
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
            return res.status(409).json({
                message: "Cannot delete console because bookings exist"
            });
        }

        console.error(error);

        res.status(500).json({
            message: "Could not delete console"
        });
    }
});

module.exports = router;
