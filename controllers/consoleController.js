const db = require("../database/db");

function parseId(id) {
    if (!/^\d+$/.test(String(id))) {
        return null;
    }

    const parsedId = Number(id);
    return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

function validateConsole(name, platform) {
    if (typeof name !== "string" || !name.trim()) {
        return "Console name is required";
    }

    if (typeof platform !== "string" || !platform.trim()) {
        return "Platform is required";
    }

    return null;
}

function handleDatabaseError(error, res, operation) {
    console.error(`Could not ${operation}:`, error);

    if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
        return res.status(409).json({
            message: "Cannot delete console because bookings exist"
        });
    }

    return res.status(500).json({
        message: `Could not ${operation}`
    });
}

function getAllConsoles(req, res) {
    const { platform } = req.query;

    try {
        let consoles;
        if (platform && typeof platform === "string" && platform.trim()) {
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

        return res.status(200).json({
            count: consoles.length,
            consoles
        });
    } catch (error) {
        return handleDatabaseError(error, res, "retrieve consoles");
    }
}

function searchConsoles(req, res) {
    const { platform } = req.query;

    if (!platform || typeof platform !== "string" || !platform.trim()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: ["Platform search term is required"]
        });
    }

    try {
        const consoles = db.prepare(`
            SELECT * FROM consoles
            WHERE LOWER(platform) LIKE LOWER(?)
            ORDER BY console_id
        `).all(`%${platform.trim()}%`);

        return res.status(200).json({
            success: true,
            ...(consoles.length === 0 && {
                message: "No consoles found for the given platform"
            }),
            count: consoles.length,
            consoles,
            data: consoles
        });
    } catch (error) {
        return handleDatabaseError(error, res, "search consoles");
    }
}

function getConsoleById(req, res) {
    const consoleId = parseId(req.params.id);
    if (consoleId === null) {
        return res.status(400).json({ message: "Invalid console ID" });
    }

    try {
        const consoleData = db.prepare(
            "SELECT * FROM consoles WHERE console_id = ?"
        ).get(consoleId);

        if (!consoleData) {
            return res.status(404).json({ message: "Console not found" });
        }

        return res.status(200).json(consoleData);
    } catch (error) {
        return handleDatabaseError(error, res, "retrieve console");
    }
}

function createConsole(req, res) {
    const { name, platform } = req.body ?? {};
    const validationError = validateConsole(name, platform);

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const result = db.prepare(`
            INSERT INTO consoles (name, platform)
            VALUES (?, ?)
        `).run(name.trim(), platform.trim());

        const consoleData = db.prepare(
            "SELECT * FROM consoles WHERE console_id = ?"
        ).get(Number(result.lastInsertRowid));

        return res.status(201).json({
            message: "Console added successfully",
            console: consoleData
        });
    } catch (error) {
        return handleDatabaseError(error, res, "create console");
    }
}

function updateConsole(req, res) {
    const consoleId = parseId(req.params.id);
    if (consoleId === null) {
        return res.status(400).json({ message: "Invalid console ID" });
    }

    const { name, platform } = req.body ?? {};
    const validationError = validateConsole(name, platform);

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const existingConsole = db.prepare(
            "SELECT console_id FROM consoles WHERE console_id = ?"
        ).get(consoleId);

        if (!existingConsole) {
            return res.status(404).json({ message: "Console not found" });
        }

        db.prepare(`
            UPDATE consoles
            SET name = ?, platform = ?
            WHERE console_id = ?
        `).run(name.trim(), platform.trim(), consoleId);

        const consoleData = db.prepare(
            "SELECT * FROM consoles WHERE console_id = ?"
        ).get(consoleId);

        return res.status(200).json({
            message: "Console updated successfully",
            console: consoleData
        });
    } catch (error) {
        return handleDatabaseError(error, res, "update console");
    }
}

function deleteConsole(req, res) {
    const consoleId = parseId(req.params.id);
    if (consoleId === null) {
        return res.status(400).json({ message: "Invalid console ID" });
    }

    try {
        const existingConsole = db.prepare(
            "SELECT console_id FROM consoles WHERE console_id = ?"
        ).get(consoleId);

        if (!existingConsole) {
            return res.status(404).json({ message: "Console not found" });
        }

        const result = db.prepare(
            "DELETE FROM consoles WHERE console_id = ?"
        ).run(consoleId);

        if (result.changes === 0) {
            return res.status(404).json({ message: "Console not found" });
        }

        return res.status(200).json({
            message: "Console deleted successfully"
        });
    } catch (error) {
        return handleDatabaseError(error, res, "delete console");
    }
}

function getConsoleBookings(req, res) {
    const consoleId = parseId(req.params.id);
    if (consoleId === null) {
        return res.status(400).json({ message: "Invalid console ID" });
    }

    try {
        const bookings = db.prepare(`
            SELECT
                bookings.booking_id,
                gamers.name AS gamer_name,
                gamers.email,
                consoles.name AS console_name,
                consoles.platform,
                bookings.status
            FROM bookings
            JOIN gamers ON bookings.gamer_id = gamers.gamer_id
            JOIN consoles ON bookings.console_id = consoles.console_id
            WHERE consoles.console_id = ?
        `).all(consoleId);

        return res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        return handleDatabaseError(error, res, "retrieve console bookings");
    }
}

module.exports = {
    getAllConsoles,
    searchConsoles,
    getConsoleById,
    createConsole,
    updateConsole,
    deleteConsole,
    getConsoleBookings
};
