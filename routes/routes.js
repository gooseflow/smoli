import express from "express";
import { requestInfo } from "../middleware/logging.js";
import { indexPageDetails } from "../handlers/views.js";
import { urlsHandler } from "../handlers/urls.js";
import { errorHandler } from "../middleware/errors.js";

const router = express.Router();

router.use(requestInfo);

router.get("/", (_, res) => {
    res.render("index", indexPageDetails());
});

router.post("/", async (req, res, next) => {
    const { url } = req.body;

    try {
        const shortUrl = await urlsHandler.createShortUrl(url);
        res.status(201).send({ message: `created shortUrl: ${shortUrl}` });
    } catch (error) {
        next(error);
    }
});

router.get("/:url", async (req, res, next) => {
    try {
        const { url } = req.params;
        const longUrl = await urlsHandler.getLongUrl(url);
        res.redirect(301, longUrl);
    } catch (error) {
        next(error);
    }
});

router.use(errorHandler);

export default router;

