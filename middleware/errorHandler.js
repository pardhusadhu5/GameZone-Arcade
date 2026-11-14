
function errorHandler(err, req, res, next) {
    console.error("Backend Error:", err.message);

    // Handle invalid JSON
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body"
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.status
            ? err.message
            : "Internal server error"
    });
}

module.exports = errorHandler;