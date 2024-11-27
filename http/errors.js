export function HttpError(statusCode, message, reason = null) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.name = "AppError";
    error.reason = reason;
    Error.captureStackTrace(error, HttpError);
    return error;
}

export function BadRequestError(message = "Bad Request", reason = null) {
    const error = HttpError(400, message, reason);
    error.name = "BadRequestError";
    return error;
}

export function NotFoundError(message = "Not Found", reason = null) {
    const error = HttpError(404, message, reason);
    error.name = "NotFoundError";
    return error;
}

export function InternalServerError(message = "Internal Server Error", reason = null) {
    const error = HttpError(500, message, reason);
    error.name = "InternalServerError";
    return error;
}

