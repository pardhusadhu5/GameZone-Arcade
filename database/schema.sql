-- GAMERS TABLE
CREATE TABLE IF NOT EXISTS gamers (
    gamer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- CONSOLES TABLE
CREATE TABLE IF NOT EXISTS consoles (
    console_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    platform TEXT NOT NULL
);

-- BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    gamer_id INTEGER NOT NULL,
    console_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK(status IN ('pending', 'approved', 'done')),

    FOREIGN KEY (gamer_id)
        REFERENCES gamers(gamer_id),

    FOREIGN KEY (console_id)
        REFERENCES consoles(console_id)
);
