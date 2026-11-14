
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

// Create the database file inside database folder
const dbPath = path.join(__dirname, "gamezone.db");

const db = new Database(dbPath);

// Enable foreign key relationships
db.pragma("foreign_keys = ON");

// Read the SQL schema
const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

// Create tables if they do not exist
db.exec(schema);

console.log("GameZone Arcade database connected!");
console.log("Gamers, Consoles and Bookings tables initialized!");

module.exports = db;
