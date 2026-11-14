const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "gamezone.db");
let db;

try {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    db = new Database(dbPath);

    db.pragma("foreign_keys = ON");

    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    db.transaction(() => db.exec(schema))();

    const emailColumn = db.prepare("PRAGMA table_info(gamers)")
        .all()
        .find((column) => column.name === "email");

    if (emailColumn && !emailColumn.notnull) {
        db.pragma("foreign_keys = OFF");

        try {
            db.transaction(() => {
                db.exec(`
                    CREATE TABLE gamers_new (
                        gamer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE
                    )
                `);
                db.exec(`
                    INSERT INTO gamers_new (gamer_id, name, email)
                    SELECT gamer_id, name, email FROM gamers
                `);
                db.exec("DROP TABLE gamers");
                db.exec("ALTER TABLE gamers_new RENAME TO gamers");

                const violations = db.pragma("foreign_key_check");
                if (violations.length > 0) {
                    throw new Error("Gamer migration would leave invalid foreign keys");
                }
            })();
        } finally {
            db.pragma("foreign_keys = ON");
        }
    }

    console.log("GameZone Arcade database connected and initialized!");
} catch (error) {
    if (db?.open) {
        db.close();
    }

    throw new Error(`Failed to initialize database at ${dbPath}: ${error.message}`, {
        cause: error
    });
}

module.exports = db;
