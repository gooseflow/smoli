import express from "express";
import { requestInfo } from "../middleware/logging.js";
import { urlsHandler } from "../handlers/urls.js";
import { errorHandler, errorLogger } from "../middleware/errors.js";
import { server } from "../handlers/server.js";

const router = express.Router();

router.use(requestInfo);

router.get("/", (req, res) => {
    if (server.isSameSite(req)) {
        return res.render('home');
    } else {
        return res.render('layout');
    }
});

router.post("/", async (req, res, next) => {
    const { url } = req.body;

    try {
        const shortUrl = await urlsHandler.createShortUrl(url);
        const serverUrl = server.getServerUrl(req);

        if (!server.isValidUrl(url)) {
            return res.render("error", {
                err: true,
                message: "entered URL is invalid",
                hint: "hint: make sure to include protocol"
            });
        }

        return res.render("result", { shortUrl: `${serverUrl}/${shortUrl}`, longUrl: url });
    } catch (error) {
        next(error);
    }
});

router.get("/:url", async (req, res, next) => {
    try {
        const { url } = req.params;
        const longUrl = await urlsHandler.getLongUrl(url);
        return res.redirect(301, longUrl);
    } catch (error) {
        if (error.statusCode = 404) {
            return res.render("layout", { err: true, message: "entered URL not found" });
        }
        next(error);
    }
});

router.use(errorLogger);
router.use(errorHandler);

export default router;

