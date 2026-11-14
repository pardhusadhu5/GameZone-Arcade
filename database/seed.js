
const db = require("./db");

// Insert sample gamers
const insertGamer = db.prepare(`
    INSERT OR IGNORE INTO gamers (name, email)
    VALUES (?, ?)
`);

insertGamer.run("Alex", "alex@example.com");
insertGamer.run("Sam", "sam@example.com");

// Insert sample consoles
const insertConsole = db.prepare(`
    INSERT INTO consoles (name, platform)
    SELECT ?, ?
    WHERE NOT EXISTS (
        SELECT 1 FROM consoles WHERE name = ?
    )
`);

insertConsole.run("PS5 Station 1", "PlayStation", "PS5 Station 1");
insertConsole.run("Xbox Station 1", "Xbox", "Xbox Station 1");

// Insert sample bookings only if there are no bookings
const bookingCount = db.prepare(
    "SELECT COUNT(*) AS total FROM bookings"
).get();

if (bookingCount.total === 0) {
    const gamer = db.prepare(
        "SELECT gamer_id FROM gamers WHERE email = ?"
    ).get("alex@example.com");

    const console = db.prepare(
        "SELECT console_id FROM consoles WHERE name = ?"
    ).get("PS5 Station 1");

    db.prepare(`
        INSERT INTO bookings (gamer_id, console_id)
        VALUES (?, ?)
    `).run(gamer.gamer_id, console.console_id);
}

console.log("Sample data inserted successfully!");
