export function errorHandler(err, req, res, next) {
    if (err.isHttp) {
        res.status(err.statusCode).send({ message: err.message });
        return;
    }

    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
}

