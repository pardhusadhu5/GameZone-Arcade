
const express = require("express");
const db = require("./database/db");

const gamerRoutes = require("./routes/gamerRoutes");
const consoleRoutes = require("./routes/consoleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

// 1. Express application initialization
const app = express();

// 2. JSON body parser middleware
app.use(express.json());

// 4. Root endpoint – confirms the API is running
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to GameZone Arcade API"
    });
});

// 4. Health-check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        service: "GameZone Arcade Backend",
        database: db.open ? "connected" : "disconnected"
    });
});

// 5-7. API route groups
app.use("/gamers", gamerRoutes);
app.use("/consoles", consoleRoutes);
app.use("/bookings", bookingRoutes);

// 8. Not-found middleware (must come after all API routes)
app.use(notFound);

// 9. Centralized error handler (must be last)
app.use(errorHandler);

// 10. Server startup
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`GameZone Arcade server running on port ${PORT}`);
});

// Export app for testing purposes
module.exports = app;
