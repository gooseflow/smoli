export function requestInfo(req, res, next) {
    const time = Date.now();
    const method = req.method;
    const url = req.originalUrl;

    console.log(`\x1B[34m[router] ${method} - ${url} - ${time}\x1B[0m`);
    next();
}

