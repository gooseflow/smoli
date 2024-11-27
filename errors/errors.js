export function AppError(message, statusCode, reason = null) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.name = "AppError";
    error.reason = reason;
    Error.captureStackTrace(error, AppError);
    return error;
}

export function BadRequestError(message = "Bad Request", reason = null) {
    const error = AppError(message, 404, reason);
    error.name = "BadRequestError";
    return error;
}

export function NotFoundError(message = "Not Found", reason = null) {
    const error = AppError(message, 404, reason);
    error.name = "NotFoundError";
    return error;
}

