export function HttpResponse(statusCode, message, data = null) {
    return {
        statusCode,
        message,
        data
    };
}

export function OkResponse(message = "OK", data = null) {
    return HttpResponse(200, message, data);
}

export function CreatedResponse(message = "Created", data = null) {
    return HttpResponse(201, message, data);
}

