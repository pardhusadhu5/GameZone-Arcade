const supportedBookingStatuses = new Set(["pending", "approved", "done"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sendValidationError(res, errors) {
    return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
    });
}

function getRequestBody(req) {
    return req.body && typeof req.body === "object" && !Array.isArray(req.body)
        ? req.body
        : {};
}

function validateGamer(req, res, next) {
    const { name, email } = getRequestBody(req);
    const errors = [];

    if (name === undefined || name === null) {
        errors.push("Name is required");
    } else if (typeof name !== "string") {
        errors.push("Name must be a string");
    } else if (!name.trim()) {
        errors.push("Name cannot be empty or only whitespace");
    }

    if (email === undefined || email === null) {
        errors.push("Email is required");
    } else if (typeof email !== "string") {
        errors.push("Email must be a string");
    } else if (!email.trim()) {
        errors.push("Email cannot be empty");
    } else if (!emailPattern.test(email.trim())) {
        errors.push("Valid email is required");
    }

    if (errors.length > 0) {
        return sendValidationError(res, errors);
    }

    return next();
}

function validateConsole(req, res, next) {
    const { name, platform } = getRequestBody(req);
    const errors = [];

    if (name === undefined || name === null) {
        errors.push("Console name is required");
    } else if (typeof name !== "string") {
        errors.push("Console name must be a string");
    } else if (!name.trim()) {
        errors.push("Console name cannot be empty");
    }

    if (platform === undefined || platform === null) {
        errors.push("Platform is required");
    } else if (typeof platform !== "string") {
        errors.push("Platform must be a string");
    } else if (!platform.trim()) {
        errors.push("Platform cannot be empty");
    }

    if (errors.length > 0) {
        return sendValidationError(res, errors);
    }

    return next();
}

function isPositiveInteger(value) {
    return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function validateBooking(req, res, next) {
    const { gamer_id: gamerId, console_id: consoleId } = getRequestBody(req);
    const errors = [];

    if (gamerId === undefined || gamerId === null || gamerId === "") {
        errors.push("gamer_id is required");
    } else if (!isPositiveInteger(gamerId)) {
        errors.push("gamer_id must be a valid positive integer");
    }

    if (consoleId === undefined || consoleId === null || consoleId === "") {
        errors.push("console_id is required");
    } else if (!isPositiveInteger(consoleId)) {
        errors.push("console_id must be a valid positive integer");
    }

    if (errors.length > 0) {
        return sendValidationError(res, errors);
    }

    return next();
}

function validateBookingStatus(req, res, next) {
    const { status } = getRequestBody(req);

    if (typeof status !== "string" || !status.trim()) {
        return sendValidationError(res, ["Status is required"]);
    }

    if (!supportedBookingStatuses.has(status)) {
        return sendValidationError(res, [
            "Status must be one of: pending, approved, done"
        ]);
    }

    return next();
}

function validateIdParam(paramName = "id") {
    return (req, res, next) => {
        const id = req.params[paramName];

        if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) <= 0) {
            return sendValidationError(res, [`${paramName} must be a positive integer`]);
        }

        return next();
    };
}

function validateConsoleSearch(req, res, next) {
    const { platform } = req.query;

    if (typeof platform !== "string" || !platform.trim()) {
        return sendValidationError(res, ["Platform search term is required"]);
    }

    return next();
}

module.exports = {
    validateBooking,
    validateBookingStatus,
    validateConsole,
    validateConsoleSearch,
    validateGamer,
    validateIdParam
};