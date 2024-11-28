export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    if (err.isHttp) {
        return res.status(err.statusCode).send({ message: err.message });
    }

    console.error(err);
    return res.status(500).send({ message: 'Internal server error' });
}

export function errorLogger(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

