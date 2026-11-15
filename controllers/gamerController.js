const db = require("../database/db");

function parseId(id) {
    if (!/^\d+$/.test(String(id))) {
        return null;
    }

    const parsedId = Number(id);
    return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

function validateGamer(name, email) {
    if (typeof name !== "string" || !name.trim()) {
        return "Gamer name is required";
    }

    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        return "A valid email is required";
    }

    return null;
}

function handleDatabaseError(error, res, operation) {
    console.error(`Could not ${operation} gamer:`, error);

    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return res.status(409).json({
            message: "Email already registered"
        });
    }

    if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
        return res.status(409).json({
            message: "Cannot delete gamer because bookings exist"
        });
    }

    return res.status(500).json({
        message: `Could not ${operation} gamer`
    });
}

function getAllGamers(req, res) {
    try {
        const gamers = db.prepare(
            "SELECT * FROM gamers ORDER BY gamer_id"
        ).all();

        return res.status(200).json({
            count: gamers.length,
            gamers
        });
    } catch (error) {
        return handleDatabaseError(error, res, "retrieve");
    }
}

function getGamerById(req, res) {
    const gamerId = parseId(req.params.id);
    if (gamerId === null) {
        return res.status(400).json({ message: "Invalid gamer ID" });
    }

    try {
        const gamer = db.prepare(
            "SELECT * FROM gamers WHERE gamer_id = ?"
        ).get(gamerId);

        if (!gamer) {
            return res.status(404).json({ message: "Gamer not found" });
        }

        return res.status(200).json(gamer);
    } catch (error) {
        return handleDatabaseError(error, res, "retrieve");
    }
}

function createGamer(req, res) {
    const { name, email } = req.body ?? {};
    const validationError = validateGamer(name, email);

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const result = db.prepare(
            "INSERT INTO gamers (name, email) VALUES (?, ?)"
        ).run(name.trim(), email.trim().toLowerCase());

        const gamer = db.prepare(
            "SELECT * FROM gamers WHERE gamer_id = ?"
        ).get(Number(result.lastInsertRowid));

        return res.status(201).json({
            message: "Gamer registered successfully",
            gamer
        });
    } catch (error) {
        return handleDatabaseError(error, res, "create");
    }
}

function updateGamer(req, res) {
    const gamerId = parseId(req.params.id);
    if (gamerId === null) {
        return res.status(400).json({ message: "Invalid gamer ID" });
    }

    const { name, email } = req.body ?? {};
    const validationError = validateGamer(name, email);

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const existingGamer = db.prepare(
            "SELECT gamer_id FROM gamers WHERE gamer_id = ?"
        ).get(gamerId);

        if (!existingGamer) {
            return res.status(404).json({ message: "Gamer not found" });
        }

        db.prepare(`
            UPDATE gamers
            SET name = ?, email = ?
            WHERE gamer_id = ?
        `).run(name.trim(), email.trim().toLowerCase(), gamerId);

        const gamer = db.prepare(
            "SELECT * FROM gamers WHERE gamer_id = ?"
        ).get(gamerId);

        return res.status(200).json({
            message: "Gamer updated successfully",
            gamer
        });
    } catch (error) {
        return handleDatabaseError(error, res, "update");
    }
}

function deleteGamer(req, res) {
    const gamerId = parseId(req.params.id);
    if (gamerId === null) {
        return res.status(400).json({ message: "Invalid gamer ID" });
    }

    try {
        const result = db.prepare(
            "DELETE FROM gamers WHERE gamer_id = ?"
        ).run(gamerId);

        if (result.changes === 0) {
            return res.status(404).json({ message: "Gamer not found" });
        }

        return res.status(200).json({
            message: "Gamer deleted successfully"
        });
    } catch (error) {
        return handleDatabaseError(error, res, "delete");
    }
}

module.exports = {
    getAllGamers,
    getGamerById,
    createGamer,
    updateGamer,
    deleteGamer
};
