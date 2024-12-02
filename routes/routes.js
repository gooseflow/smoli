import express from "express";
import { requestInfo } from "../middleware/logging.js";
import { urlsHandler } from "../handlers/urls.js";
import { errorHandler, errorLogger } from "../middleware/errors.js";
import { server } from "../handlers/server.js";

const router = express.Router();

router.use(requestInfo);

router.get("/", (req, res) => {
    if (server.isSameSite(req)) {
        res.render('home');
    } else {
        res.render('layout');
    }
});

router.post("/", async (req, res, next) => {
    const { url } = req.body;

    try {
        const shortUrl = await urlsHandler.createShortUrl(url);
        const serverUrl = server.getServerUrl(req);
        res.render("result", { shortUrl: `${serverUrl}/${shortUrl}`, longUrl: url });
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

router.use(errorLogger);
router.use(errorHandler);

export default router;

