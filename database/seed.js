const db = require("./db");

try {
    db.transaction(() => {
        const insertGamer = db.prepare(`
            INSERT INTO gamers (name, email)
            VALUES (?, ?)
            ON CONFLICT(email) DO NOTHING
        `);

        insertGamer.run("Alex", "alex@example.com");
        insertGamer.run("Sam", "sam@example.com");

        const insertConsole = db.prepare(`
            INSERT INTO consoles (name, platform)
            SELECT ?, ?
            WHERE NOT EXISTS (
                SELECT 1 FROM consoles WHERE name = ?
            )
        `);

        insertConsole.run("PS5 Station 1", "PlayStation", "PS5 Station 1");
        insertConsole.run("Xbox Station 1", "Xbox", "Xbox Station 1");

        db.prepare(`
            INSERT INTO bookings (gamer_id, console_id)
            SELECT gamers.gamer_id, consoles.console_id
            FROM gamers
            JOIN consoles ON consoles.name = ?
            WHERE gamers.email = ?
            AND NOT EXISTS (
                SELECT 1
                FROM bookings
                WHERE bookings.gamer_id = gamers.gamer_id
                    AND bookings.console_id = consoles.console_id
            )
        `).run("PS5 Station 1", "alex@example.com");
    })();

    console.log("Sample data inserted successfully!");
} finally {
    db.close();
}
